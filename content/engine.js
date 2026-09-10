// Foco Total - motor compartilhado de ocultacao.
// Cada plataforma chama FocoTotal.init(platform, rules).
"use strict";

var FocoTotal = window.__FOCO_TOTAL_ENGINE__ || (() => {
  const VERSION = "1.0.0-optimized";
  const STYLE_ID = "foco-total-style";
  const HIDE_ATTR = "data-foco-total-hide";
  const ROUTE_EVENT = "foco-total-route";

  let platform = null;
  let rules = {};
  let state = { enabled: true, siteOn: true, prefs: {} };
  let observer = null;
  let storageListener = null;
  let routeListener = null;
  let scheduled = false;
  let pendingRoots = new Set();
  let activeDynamic = new Set();
  let observedDynamic = new Set();
  let lastCss = "";
  let lastRuleSignature = "";

  function isActive() {
    return state.enabled && state.siteOn;
  }

  function activeKeys() {
    if (!isActive()) return [];
    return Object.keys(rules).filter((key) => state.prefs[key]);
  }

  function dynamicKeys(keys = activeKeys()) {
    return keys.filter((key) => rules[key]?.dynamic);
  }

  function observedDynamicKeys(keys = activeKeys()) {
    return keys.filter((key) => rules[key]?.dynamic && rules[key].observe !== false);
  }

  function signature(keys) {
    return keys.slice().sort().join("|");
  }

  function buildCss(keys = activeKeys()) {
    const selectors = [];
    const extra = [];
    for (const key of keys) {
      const rule = rules[key];
      if (rule.css) selectors.push(...rule.css);
      if (rule.dynamic) selectors.push(`[${HIDE_ATTR}~="${key}"]`);
      if (rule.extraCss) extra.push(rule.extraCss);
    }
    let css = selectors.length
      ? `${selectors.join(",\n")} { display: none !important; }`
      : "";
    if (extra.length) css += (css ? "\n" : "") + extra.join("\n");
    return css;
  }

  function applyStyle(keys = activeKeys()) {
    const css = buildCss(keys);
    if (css === lastCss) return;
    lastCss = css;

    const tag = document.getElementById(STYLE_ID);
    if (!css) {
      tag?.remove();
      return;
    }
    const style = tag || document.createElement("style");
    style.id = STYLE_ID;
    if (!tag) (document.head || document.documentElement).appendChild(style);
    style.textContent = css;
  }

  function clearMarks(key) {
    for (const el of document.querySelectorAll(`[${HIDE_ATTR}~="${key}"]`)) {
      const keys = (el.getAttribute(HIDE_ATTR) || "")
        .split(" ")
        .filter((k) => k && k !== key);
      if (keys.length) el.setAttribute(HIDE_ATTR, keys.join(" "));
      else el.removeAttribute(HIDE_ATTR);
    }
  }

  function mark(el, key) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    const keys = (el.getAttribute(HIDE_ATTR) || "").split(" ").filter(Boolean);
    if (!keys.includes(key)) {
      keys.push(key);
      el.setAttribute(HIDE_ATTR, keys.join(" "));
    }
  }

  function makeContext(reason, root) {
    const full = root === document;
    return {
      platform,
      reason,
      full,
      routeChanged: reason === "route",
      activeChanged: reason === "state",
      root,
      one(selector) {
        if (root.nodeType === Node.ELEMENT_NODE && root.matches(selector)) return root;
        return root.querySelector?.(selector) || null;
      },
      all(selector) {
        const out = [];
        if (root.nodeType === Node.ELEMENT_NODE && root.matches(selector)) out.push(root);
        if (root.querySelectorAll) out.push(...root.querySelectorAll(selector));
        return out;
      },
    };
  }

  function runRule(key, root, reason, context) {
    const rule = rules[key];
    if (!rule?.dynamic) return;
    try {
      rule.dynamic(root, (el) => mark(el, key), context || makeContext(reason, root));
    } catch (error) {
      console.warn("[Foco Total] regra dinamica falhou:", platform, key, error);
    }
  }

  function runDynamicFull(reason) {
    const context = makeContext(reason, document);
    for (const key of activeDynamic) runRule(key, document, reason, context);
  }

  function runDynamicIncremental() {
    scheduled = false;
    if (!observedDynamic.size) {
      pendingRoots.clear();
      return;
    }
    const roots = [...pendingRoots].filter((node) => node.isConnected);
    pendingRoots.clear();
    for (const root of roots) {
      const context = makeContext("mutation", root);
      for (const key of observedDynamic) runRule(key, root, "mutation", context);
    }
  }

  function scheduleFromMutations(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) pendingRoots.add(node);
      }
    }
    if (!pendingRoots.size || scheduled) return;
    scheduled = true;
    requestAnimationFrame(runDynamicIncremental);
  }

  function connectObserverIfNeeded() {
    if (!observedDynamic.size || observer || !chrome.runtime?.id) return;
    const start = () => {
      if (!document.body || observer || !observedDynamic.size) return;
      observer = new MutationObserver(scheduleFromMutations);
      observer.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start, { once: true });
  }

  function disconnectObserverIfIdle() {
    if (observedDynamic.size || !observer) return;
    observer.disconnect();
    observer = null;
    pendingRoots.clear();
    scheduled = false;
  }

  function patchRouteEvents() {
    if (window.__FOCO_TOTAL_ROUTE_PATCHED__) return;
    window.__FOCO_TOTAL_ROUTE_PATCHED__ = true;
    let last = location.href;
    const notify = () => {
      if (location.href === last) return;
      last = location.href;
      window.dispatchEvent(new Event(ROUTE_EVENT));
    };
    for (const name of ["pushState", "replaceState"]) {
      const original = history[name];
      history[name] = function focoTotalHistoryPatch(...args) {
        const result = original.apply(this, args);
        queueMicrotask(notify);
        return result;
      };
    }
    window.addEventListener("popstate", notify);
    window.addEventListener("yt-navigate-finish", notify);
  }

  function reconcile(reason) {
    if (!chrome.runtime?.id) {
      observer?.disconnect();
      observer = null;
      return;
    }

    const keys = activeKeys();
    const nextDynamic = new Set(dynamicKeys(keys));
    const nextObserved = new Set(observedDynamicKeys(keys));
    for (const key of activeDynamic) {
      if (!nextDynamic.has(key)) clearMarks(key);
    }
    activeDynamic = nextDynamic;
    observedDynamic = nextObserved;

    const nextSignature = signature(keys);
    applyStyle(keys);
    if (signature([...activeDynamic]) !== lastRuleSignature) {
      lastRuleSignature = signature([...activeDynamic]);
      reason = "state";
    }

    disconnectObserverIfIdle();
    connectObserverIfNeeded();
    if (activeDynamic.size && (reason === "init" || reason === "state" || reason === "route")) {
      runDynamicFull(reason);
    }
  }

  async function init(name, ruleDefs) {
    platform = name;
    rules = ruleDefs || {};
    patchRouteEvents();

    const data = await chrome.storage.local.get(["enabled", "siteEnabled", platform]);
    state.enabled = data.enabled !== false;
    state.siteOn = (data.siteEnabled || {})[platform] !== false;
    state.prefs = data[platform] || {};

    if (storageListener) chrome.storage.onChanged.removeListener(storageListener);
    storageListener = (changes, area) => {
      if (area !== "local") return;
      if (changes.enabled) state.enabled = changes.enabled.newValue !== false;
      if (changes.siteEnabled) state.siteOn = (changes.siteEnabled.newValue || {})[platform] !== false;
      if (changes[platform]) state.prefs = changes[platform].newValue || {};
      reconcile("state");
    };
    chrome.storage.onChanged.addListener(storageListener);

    if (routeListener) window.removeEventListener(ROUTE_EVENT, routeListener);
    routeListener = () => reconcile("route");
    window.addEventListener(ROUTE_EVENT, routeListener);

    reconcile("init");
  }

  const api = { init, version: VERSION };
  window.__FOCO_TOTAL_ENGINE__ = api;
  return api;
})();
