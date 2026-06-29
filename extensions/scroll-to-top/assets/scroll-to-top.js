/* =================================================================
   UpScroll – Scroll to Top — Storefront Script
   v1.0 | Vanilla JS, no dependencies, no jQuery
   ================================================================= */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────────────────── */

  var BTN_ID  = 'cs-scroll-to-top-btn';
  var ROOT_ID = 'cs-scroll-to-top-root';
  var VIS_CLS = 'cs-stt-visible';

  var SCROLL_MS = {
    instant : 0,
    fast    : 300,
    medium  : 600,
    slow    : 1000
  };

  /* ── SVG icons ─────────────────────────────────────────────── */

  var ICONS = {
    'arrow': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="12" y1="19" x2="12" y2="5"/>' +
      '<polyline points="5 12 12 5 19 12"/>' +
      '</svg>'
    ),
    'chevron': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="18 15 12 9 6 15"/>' +
      '</svg>'
    ),
    'double-chevron': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2.5"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="17 17 12 12 7 17"/>' +
      '<polyline points="17 11 12 6 7 11"/>' +
      '</svg>'
    ),
    'circle': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<polyline points="15 13 12 10 9 13"/>' +
      '<line x1="12" y1="14" x2="12" y2="10"/>' +
      '</svg>'
    ),
    'home': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
      '<polyline points="9 22 9 12 15 12 15 22"/>' +
      '</svg>'
    ),
    'caret': (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' +
      ' fill="currentColor" aria-hidden="true">' +
      '<polygon points="12,5 20,19 4,19"/>' +
      '</svg>'
    )
  };

  /* ── Utility helpers ───────────────────────────────────────── */

  function getBorderRadius(shape, radius) {
    switch (shape) {
      case 'circle':  return '50%';
      case 'pill':    return '999px';
      case 'square':  return '0';
      case 'rounded': return radius + 'px';
      default:        return '50%';
    }
  }

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function buildShadow(s) {
    if (!s.enableShadow) return 'none';
    return '0 4px ' + s.shadowBlur + 'px ' + hexToRgba(s.shadowColor, s.shadowOpacity);
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration) {
    if (duration === 0) {
      window.scrollTo(0, targetY);
      return;
    }
    var startY    = window.scrollY || window.pageYOffset;
    var startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed  = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  /* ── Settings normalisation ────────────────────────────────── */

  function normalise(raw) {
    raw = raw || {};
    return {
      isEnabled:            raw.isEnabled !== false,
      iconType:             raw.iconType             || 'arrow',
      buttonShape:          raw.buttonShape          || 'circle',
      buttonSize:           Number(raw.buttonSize)   || 50,
      iconSize:             Number(raw.iconSize)     || 20,
      borderRadius:         Number(raw.borderRadius) || 0,
      borderWidth:          Number(raw.borderWidth)  || 0,
      opacity:              raw.opacity  != null ? Number(raw.opacity)  : 1,
      buttonColor:          raw.buttonColor          || '#000000',
      iconColor:            raw.iconColor            || '#ffffff',
      hoverBackgroundColor: raw.hoverBackgroundColor || '#333333',
      hoverIconColor:       raw.hoverIconColor       || '#ffffff',
      borderColor:          raw.borderColor          || '#000000',
      shadowColor:          raw.shadowColor          || '#000000',
      buttonPosition:       raw.buttonPosition       || 'bottom-right',
      bottomOffset:         Number(raw.bottomOffset) || 20,
      sideOffset:           Number(raw.sideOffset)   || 20,
      showOnDesktop:        raw.showOnDesktop !== false,
      showOnMobile:         raw.showOnMobile  !== false,
      hideAtTop:            Boolean(raw.hideAtTop),
      scrollThreshold:      Number(raw.scrollThreshold) || 300,
      scrollSpeed:          raw.scrollSpeed           || 'medium',
      animationType:        raw.animationType         || 'fade',
      enableShadow:         Boolean(raw.enableShadow),
      shadowBlur:           Number(raw.shadowBlur)   || 10,
      shadowOpacity:        raw.shadowOpacity != null ? Number(raw.shadowOpacity) : 0.3
    };
  }

  /* ── Button construction ───────────────────────────────────── */

  function buildButton(s) {
    var btn = document.createElement('button');
    btn.id   = BTN_ID;
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Scroll to top');

    // Data attributes drive CSS selectors
    btn.setAttribute('data-animation',    s.animationType);
    btn.setAttribute('data-position',     s.buttonPosition);
    btn.setAttribute('data-hide-mobile',  String(!s.showOnMobile));
    btn.setAttribute('data-hide-desktop', String(!s.showOnDesktop));

    // CSS custom properties (used by CSS animation/position rules)
    btn.style.setProperty('--cs-bottom',  s.bottomOffset + 'px');
    btn.style.setProperty('--cs-side',    s.sideOffset   + 'px');
    btn.style.setProperty('--cs-opacity', String(s.opacity));

    // Start hidden; showBtn/hideBtn manage visibility via inline styles +
    // class so the button is always controllable even if the CSS file
    // fails to load or a theme rule overrides visibility/opacity.
    btn.style.visibility    = 'hidden';
    btn.style.opacity       = '0';
    btn.style.pointerEvents = 'none';

    // Appearance
    applyAppearance(btn, s, false);

    // Icon wrapper
    var icon            = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.style.cssText  =
      'display:flex;align-items:center;justify-content:center;' +
      'width:' + s.iconSize + 'px;height:' + s.iconSize + 'px;' +
      'pointer-events:none;';
    icon.innerHTML      = ICONS[s.iconType] || ICONS['arrow'];
    btn.appendChild(icon);

    /* ── Hover ── */
    btn.addEventListener('mouseenter', function () {
      btn.style.backgroundColor = s.hoverBackgroundColor;
      btn.style.color           = s.hoverIconColor;
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.backgroundColor = s.buttonColor;
      btn.style.color           = s.iconColor;
    });

    /* ── Click: scroll to top ── */
    btn.addEventListener('click', function () {
      var dur = SCROLL_MS[s.scrollSpeed];
      smoothScrollTo(0, dur !== undefined ? dur : 600);
    });

    return btn;
  }

  function applyAppearance(btn, s, hovered) {
    btn.style.width           = s.buttonSize + 'px';
    btn.style.height          = s.buttonSize + 'px';
    btn.style.borderRadius    = getBorderRadius(s.buttonShape, s.borderRadius);
    btn.style.backgroundColor = hovered ? s.hoverBackgroundColor : s.buttonColor;
    btn.style.color           = hovered ? s.hoverIconColor       : s.iconColor;
    btn.style.border          = s.borderWidth > 0
      ? s.borderWidth + 'px solid ' + s.borderColor
      : 'none';
    btn.style.boxShadow       = buildShadow(s);
  }

  /* ── Show / hide ───────────────────────────────────────────── */

  function showBtn(btn) {
    // Bounce needs animation reset so it replays every time
    if (btn.getAttribute('data-animation') === 'bounce') {
      btn.style.animation = 'none';
      void btn.offsetWidth; // force reflow
      btn.style.animation = '';
    }
    // Inline styles guarantee the button appears even if the CSS file
    // failed to load or a theme rule has higher selector specificity.
    // CSS transitions still fire because they respond to computed value
    // changes regardless of whether those changes come from CSS or JS.
    btn.style.visibility    = 'visible';
    btn.style.opacity       = btn.style.getPropertyValue('--cs-opacity') || '1';
    btn.style.pointerEvents = 'auto';
    btn.classList.add(VIS_CLS);
  }

  function hideBtn(btn) {
    btn.classList.remove(VIS_CLS);
    // Stop bounce animation so it doesn't hold forwards fill while hidden
    if (btn.getAttribute('data-animation') === 'bounce') {
      btn.style.animation = 'none';
    }
    btn.style.visibility    = 'hidden';
    btn.style.opacity       = '0';
    btn.style.pointerEvents = 'none';
  }

  /* ── Visibility logic ──────────────────────────────────────── */

  function isAllowedOnDevice(s) {
    if (isMobile() && !s.showOnMobile)   return false;
    if (!isMobile() && !s.showOnDesktop) return false;
    return true;
  }

  function checkVisibility(btn, s) {
    var scrolled  = window.scrollY || window.pageYOffset;
    var threshold = s.scrollThreshold;

    if (!isAllowedOnDevice(s)) {
      hideBtn(btn);
      return;
    }

    // hideAtTop: suppress the button when the user is within 10px of the very top
    var suppressedAtTop = s.hideAtTop && scrolled < 10;

    if (!suppressedAtTop && scrolled > threshold) {
      showBtn(btn);
    } else {
      hideBtn(btn);
    }
  }

  /* ── Setup ─────────────────────────────────────────────────── */

  function setup(raw) {
    var s = normalise(raw);

    if (!s.isEnabled) return; // app disabled in dashboard — render nothing

    var btn = buildButton(s);

    // Force high z-index inline so the button sits above theme elements
    // regardless of what the CSS cascade produces.
    btn.style.zIndex = '999999';

    document.body.appendChild(btn);

    // Throttled scroll handler using requestAnimationFrame
    var rafPending = false;
    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        checkVisibility(btn, s);
        rafPending = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Re-check on resize (device breakpoint may change on orientation flip)
    window.addEventListener('resize', function () {
      checkVisibility(btn, s);
    }, { passive: true });

    // Run once on load to handle pages that are pre-scrolled
    checkVisibility(btn, s);
  }

  /* ── Bootstrap ─────────────────────────────────────────────── */

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root) {
      console.error('[UpScroll] Root element not found — verify the app embed is enabled in the Shopify theme editor.');
      return;
    }

    var appUrl = (root.getAttribute('data-app-url') || '').replace(/\/+$/, '');
    // Use window.location.hostname as a reliable fallback for the shop domain
    // in case {{ shop.permanent_domain }} doesn't resolve in a given context.
    var shop   = root.getAttribute('data-shop') || window.location.hostname;

    if (!appUrl) {
      // {{ app.url }} is empty — shopify app dev may not be running, the tunnel
      // URL hasn't propagated to the Partner Dashboard yet, or the app URL hasn't
      // been deployed. Render with defaults so the button still appears.
      console.error('[UpScroll] data-app-url is empty ({{ app.url }} did not resolve). Run "shopify app dev" or deploy the app. Rendering with defaults.');
      setup({});
      return;
    }

    var endpoint = appUrl + '/proxy/settings?shop=' + encodeURIComponent(shop);

    fetch(endpoint)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(setup)
      .catch(function (err) {
        // Settings unavailable (network error, server error, CORS on 500 response).
        // Render with defaults so the button always appears regardless of API health.
        console.error('[UpScroll] Settings fetch failed (' + err.message + '). Rendering with default settings.');
        setup({});
      });
  }

  /* ── Entry point ───────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
