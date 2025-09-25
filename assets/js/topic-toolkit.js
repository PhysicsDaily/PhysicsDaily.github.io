/*
 * TopicToolkit - shared client utilities for topic and chapter pages
 * ---------------------------------------------------------------
 * Provides a consistent API to read/write chapter progress and
 * hydrate progress indicators across topic overview and chapter pages.
 *
 * Usage options:
 *   1. Auto-init (recommended):
 *      - Include this script on the page (after the DOM markup).
 *      - Add data attributes to your markup, e.g.
 *            <article class="chapter-card" data-topic-chapter="3">
 *              <div class="chapter-progress" data-progress-bar></div>
 *            </article>
 *      - Optional global controls on <body>:
 *            data-progress-namespace="mechanics"
 *            data-topic-toolkit="off"  (to disable auto init)
 *   2. Manual control:
 *        TopicToolkit.init({ namespace: 'mechanics' });
 *        TopicToolkit.writeProgress({ chapter: '3', progress: 75 });
 */

(() => {
  if (window.TopicToolkit) return;

  const DEFAULTS = {
    namespace: null,
    chapterSelector: '[data-topic-chapter], [data-chapter-card]',
    progressBarSelector: '[data-progress-bar], .chapter-progress',
    progressLabelSelector: '[data-progress-label], .chapter-progress-label',
    summaryCompletedSelector: '[data-topic-progress="completed"], #completed-chapters',
    summaryInProgressSelector: '[data-topic-progress="in-progress"]',
    summaryTotalSelector: '[data-topic-progress="total"]',
    progressSuffix: '%',
    completedThreshold: 100,
    autoUpdateSummary: true,
    legacyKeys: [],
  };

  const clampProgress = (value) => {
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) return 0;
    return Math.min(100, Math.max(0, num));
  };

  const normalise = (value = '') => value.toString().trim().toLowerCase().replace(/\s+/g, '-');

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn('[TopicToolkit] Unable to read localStorage key', key, error);
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn('[TopicToolkit] Unable to write localStorage key', key, error);
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn('[TopicToolkit] Unable to remove localStorage key', key, error);
      }
    },
    keys() {
      try {
        return Object.keys(window.localStorage);
      } catch (error) {
        console.warn('[TopicToolkit] Unable to enumerate localStorage keys', error);
        return [];
      }
    },
  };

  const computeNamespace = (options = {}) => {
    if (options.namespace) return options.namespace;
    const fromBody = document.body?.dataset?.progressNamespace || document.body?.dataset?.progressSection;
    if (fromBody) return fromBody;
    return 'general';
  };

  const buildStorageKeys = ({ namespace, chapter, key, legacyKeys = [] }) => {
    const keys = [];
    if (key) keys.push(key);
    const normalisedNamespace = normalise(namespace);
    const normalisedChapter = normalise(chapter);
    keys.push(`pd:progress:${normalisedNamespace}:${normalisedChapter}`);
    keys.push(`${normalisedNamespace}-chapter-${normalisedChapter}-progress`);
    legacyKeys.forEach((legacyKey) => {
      if (typeof legacyKey === 'string' && legacyKey.length) {
        keys.push(legacyKey.replace('{chapter}', normalisedChapter));
      }
    });
    return [...new Set(keys)];
  };

  const readProgress = ({ chapter, namespace, key, legacyKeys } = {}) => {
    if (!chapter) return 0;
    const ns = computeNamespace({ namespace });
    const keys = buildStorageKeys({ namespace: ns, chapter, key, legacyKeys });
    for (const storageKey of keys) {
      const raw = storage.get(storageKey);
      if (raw === null || raw === undefined) continue;
      const value = clampProgress(raw);
      if (value > 0) return value;
      if (raw === '0') return 0;
    }
    return 0;
  };

  const writeProgress = ({ chapter, progress, namespace, key, legacyKeys } = {}) => {
    if (!chapter) return 0;
    const ns = computeNamespace({ namespace });
    const value = clampProgress(progress);
    const keys = buildStorageKeys({ namespace: ns, chapter, key, legacyKeys });
    keys.forEach((storageKey) => storage.set(storageKey, String(value)));
    window.dispatchEvent(new CustomEvent('topicProgressUpdated', {
      detail: { namespace: ns, chapter, progress: value },
    }));
    return value;
  };

  const resetProgress = ({ namespace, chapters } = {}) => {
    const ns = computeNamespace({ namespace });
    if (Array.isArray(chapters) && chapters.length) {
      chapters.forEach((chapter) => {
        const keys = buildStorageKeys({ namespace: ns, chapter });
        keys.forEach((storageKey) => storage.remove(storageKey));
      });
      return;
    }

    const prefixNew = `pd:progress:${normalise(ns)}:`;
    const prefixLegacy = `${normalise(ns)}-chapter-`;
    storage.keys().forEach((key) => {
      if (key.startsWith(prefixNew) || key.startsWith(prefixLegacy)) {
        storage.remove(key);
      }
    });
  };

  const initChapterCards = (options = {}) => {
    const settings = { ...DEFAULTS, ...options };
    const namespace = computeNamespace(settings);
    const cards = document.querySelectorAll(settings.chapterSelector);

    const stats = {
      namespace,
      total: 0,
      completed: 0,
      inProgress: 0,
      entries: [],
    };

    cards.forEach((card) => {
      const chapter = card.dataset.topicChapter || card.dataset.chapter || card.getAttribute('data-chapter');
      if (!chapter) return;
      const chapterNamespace = card.dataset.progressNamespace || namespace;
      const legacyKeys = [...settings.legacyKeys];
      if (card.dataset.progressLegacyKey) {
        legacyKeys.push(card.dataset.progressLegacyKey);
      }

      const progress = readProgress({
        chapter,
        namespace: chapterNamespace,
        key: card.dataset.progressKey,
        legacyKeys,
      });

      stats.total += 1;
      if (progress >= settings.completedThreshold) stats.completed += 1;
      else if (progress > 0) stats.inProgress += 1;

      const bars = card.querySelectorAll(settings.progressBarSelector);
      bars.forEach((bar) => {
        const target = bar.dataset.progressTarget
          ? card.querySelector(bar.dataset.progressTarget)
          : bar;
        if (target) target.style.width = `${progress}%`;
        if (bar.dataset.progressValueAttr) {
          target?.setAttribute(bar.dataset.progressValueAttr, `${progress}`);
        }
      });

      const labels = card.querySelectorAll(settings.progressLabelSelector);
      labels.forEach((label) => {
        label.textContent = `${progress}${settings.progressSuffix}`;
      });

      stats.entries.push({
        element: card,
        chapter,
        namespace: chapterNamespace,
        progress,
      });
    });

    return stats;
  };

  const updateSummary = (stats, options = {}) => {
    if (!stats) return;
    const settings = { ...DEFAULTS, ...options };

    const updateElements = (selector, value) => {
      if (!selector) return;
      document.querySelectorAll(selector).forEach((el) => {
        if (!el) return;
        el.textContent = value.toString();
      });
    };

    updateElements(settings.summaryCompletedSelector, stats.completed);
    updateElements(settings.summaryInProgressSelector, stats.inProgress);
    updateElements(settings.summaryTotalSelector, stats.total);
  };

  const init = (options = {}) => {
    const settings = { ...DEFAULTS, ...options };
    const stats = initChapterCards(settings);
    if (settings.autoUpdateSummary) {
      updateSummary(stats, settings);
    }
    return stats;
  };

  const autoInit = () => {
    if (document.body?.dataset?.topicToolkit === 'off') return;
    const hasCards = document.querySelector(DEFAULTS.chapterSelector);
    const hasSummary = document.querySelector(DEFAULTS.summaryCompletedSelector)
      || document.querySelector(DEFAULTS.summaryInProgressSelector)
      || document.querySelector(DEFAULTS.summaryTotalSelector);
    if (!hasCards && !hasSummary) return;
    try {
      init();
    } catch (error) {
      console.warn('[TopicToolkit] Auto init failed', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.TopicToolkit = {
    init,
    initChapterCards,
    updateSummary,
    readProgress,
    writeProgress,
    resetProgress,
    getNamespace: computeNamespace,
  };
})();
