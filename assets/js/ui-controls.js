// name=assets/js/ui-controls.js
// Lightweight UI behaviors for Start Test and Learn More buttons.
// Safe, non-invasive, and designed to call existing render functions when available.

// Wrap everything to avoid leaking to global scope
(function () {
  // Single place for app state (keeps future migration easier)
  var appState = window.__ha_app_state__ || (window.__ha_app_state__ = {});
  appState.currentQuestionIndex = typeof appState.currentQuestionIndex === 'number' ? appState.currentQuestionIndex : null;

  // Utilities: safe query helpers that try common patterns used in the project without changing HTML
  function q(selector) { return document.querySelector(selector); }
  function qAll(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  // Find a button by id, data-action, or text content fallback
  function findButtonByLabel(labelText) {
    // prefer explicit attributes first
    var byId = q('#' + labelText.replace(/\s+/g, '-').toLowerCase());
    if (byId) return byId;

    var byData = q('[data-action="' + labelText.toLowerCase().replace(/\s+/g, '-') + '"]');
    if (byData) return byData;

    // fallback: match button or a elements whose text content equals the label (trimmed)
    var candidates = qAll('button, a, [role="button"]');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (el.textContent && el.textContent.trim() === labelText) return el;
    }
    return null;
  }

  // Show/hide helpers (adds/removes 'hidden' attribute and 'is-hidden' class if needed)
  function hideElement(el) {
    if (!el) return;
    el.setAttribute('aria-hidden', 'true');
    el.classList.add('is-hidden');
    // also try style fallback
    el.style.display = 'none';
  }
  function showElement(el) {
    if (!el) return;
    el.removeAttribute('aria-hidden');
    el.classList.remove('is-hidden');
    el.style.display = '';
  }

  // Rendering behavior for first question: try existing app functions first
  function renderFirstQuestion() {
    // If the project already exposes a function like renderQuestion, initialize using it
    try {
      if (typeof window.renderQuestion === 'function') {
        appState.currentQuestionIndex = 0;
        // call existing rendering function if it expects an index param
        // try both renderQuestion(index) and renderQuestion() patterns
        try {
          window.renderQuestion(appState.currentQuestionIndex);
        } catch (e) {
          // fallback to calling without args
          window.renderQuestion();
        }
        return;
      }

      // If the app has a questions array and an existing render function name like showQuestion or updateQuestion
      if (Array.isArray(window.questions) && window.questions.length > 0) {
        appState.currentQuestionIndex = 0;
        if (typeof window.showQuestion === 'function') {
          window.showQuestion(0);
          return;
        }
        if (typeof window.updateQuestion === 'function') {
          window.updateQuestion(0);
          return;
        }
        // fallback: try to find a question container and populate from questions[0]
        var qContainer = q('#question-container') || q('.question-container') || q('[data-section="question"]');
        if (qContainer) {
          qContainer.innerHTML = '<div class="question-text">' + escapeHtml(window.questions[0].text || window.questions[0]) + '</div>';
          return;
        }
      }

      // If none of the above exist, dispatch a custom event so existing code can listen and initialize
      appState.currentQuestionIndex = 0;
      var evt = new CustomEvent('ha:startTest', { detail: { index: 0 }});
      document.dispatchEvent(evt);
    } catch (err) {
      // Never change scoring or other logic — errors are non-fatal here
      console.warn('renderFirstQuestion fallback error', err);
    }
  }

  // Simple modal builder for Learn More fallback
  function openLearnMoreModal() {
    // If a modal already exists, focus it
    if (q('#ha-learn-more-modal')) {
      q('#ha-learn-more-modal').focus();
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'ha-learn-more-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '10000';
    modal.tabIndex = -1;

    var panel = document.createElement('div');
    panel.style.maxWidth = '720px';
    panel.style.margin = '1rem';
    panel.style.padding = '1.25rem';
    panel.style.background = '#fff';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
    panel.style.maxHeight = '90vh';
    panel.style.overflow = 'auto';

    panel.innerHTML = (
      '<h2>About AI Worldview & Human Cognitive Archetypes</h2>' +
      '<p><strong>AI Worldview</strong> is a short interactive test that helps surface how you tend to see AI and its role.</p>' +
      '<p><strong>Human Cognitive Archetypes</strong> are profiles that describe typical patterns of thought and preference—how people prefer to interact with AI and make decisions.</p>' +
      '<p>After the test you will receive a short summary describing your archetype and some recommendations—no personal data is required for the basic summary.</p>' +
      '<div style="text-align:right; margin-top:1rem;"><button id="ha-learn-more-close" style="padding:0.5rem 1rem;">Close</button></div>'
    );

    modal.appendChild(panel);
    document.body.appendChild(modal);

    // Focus management
    panel.querySelector('#ha-learn-more-close').addEventListener('click', function () {
      closeModal();
    });

    modal.addEventListener('click', function (ev) {
      if (ev.target === modal) closeModal();
    });

    function closeModal() {
      if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    }

    // Focus the modal for accessibility
    modal.focus();
  }

  // Basic HTML escape helper
  function escapeHtml(s) {
    if (typeof s !== 'string') return s;
    return s.replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  // Main handlers
  function handleStartTestClick(ev) {
    ev.preventDefault();
    // Find landing and test sections
    var landing =
      q('#landing') ||
      q('.landing') ||
      q('[data-section="landing"]') ||
      q('section.landing') ||
      q('section#landing');

    var testSection =
      q('#test') ||
      q('.test') ||
      q('[data-section="test"]') ||
      q('section.test') ||
      q('section#test');

    // Hide landing, show test. Keep styles minimal to avoid changing project CSS.
    if (landing) hideElement(landing);
    if (testSection) showElement(testSection);

    // Initialize index and render first question
    appState.currentQuestionIndex = 0;
    renderFirstQuestion();

    // Emit a simple event so analytics or other listeners can respond
    var evt = new CustomEvent('ha:started', { detail: { index: 0 }});
    document.dispatchEvent(evt);
  }

  function handleLearnMoreClick(ev) {
    ev && ev.preventDefault && ev.preventDefault();

    // Try to smooth-scroll to an introduction / intro / about / details section if present
    var intro =
      q('#introduction') ||
      q('#intro') ||
      q('.introduction') ||
      q('[data-section="introduction"]') ||
      q('section.introduction') ||
      q('[id*="intro"]') ||
      q('[class*="intro"]');

    if (intro && typeof intro.scrollIntoView === 'function') {
      try {
        intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Also set focus for screen readers
        if (intro.tabIndex === -1) intro.tabIndex = -1;
        intro.focus();
        return;
      } catch (e) {
        // fall through to modal if scroll fails
      }
    }

    // Otherwise open modal
    openLearnMoreModal();
  }

  // Attach listeners after DOM is loaded
  function initUiBindings() {
    // Attach to explicit buttons if they exist, otherwise find by label fallback
    var startBtn = findButtonByLabel('Start Test');
    var learnBtn = findButtonByLabel('Learn More');

    if (startBtn) {
      startBtn.addEventListener('click', handleStartTestClick);
      startBtn.setAttribute('aria-controls', 'test');
      startBtn.setAttribute('aria-describedby', 'start-action');
    } else {
      // Try event delegation as a final fallback (listens for clicks on any element with text 'Start Test')
      document.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.getAttribute('role') === 'button')) {
          if (t.textContent && t.textContent.trim() === 'Start Test') {
            handleStartTestClick(ev);
          }
        }
      });
    }

    if (learnBtn) {
      learnBtn.addEventListener('click', handleLearnMoreClick);
      learnBtn.setAttribute('aria-describedby', 'learn-action');
    } else {
      document.addEventListener('click', function (ev) {
        var t = ev.target;
        if (t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.getAttribute('role') === 'button')) {
          if (t.textContent && t.textContent.trim() === 'Learn More') {
            handleLearnMoreClick(ev);
          }
        }
      });
    }

    // expose programmatic methods in case other code wants to call them
    window.HA_UI = window.HA_UI || {};
    window.HA_UI.startTest = handleStartTestClick;
    window.HA_UI.learnMore = handleLearnMoreClick;
    window.HA_UI.appState = appState;
  }

  // Wait for DOMContentLoaded so we don't miss elements added inline
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUiBindings);
  } else {
    // already loaded
    initUiBindings();
  }

})();
