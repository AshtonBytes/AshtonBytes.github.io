/* ============================================================
   AURIVARA: shared behavior
   Reads window.AURIVARA_AB = { key, variants:{A:{...},B:{...}} }
   Applies variant text to [data-ab="<field>"] elements.
   Includes GA4 event tracking with variant attached.
   ============================================================ */
(function () {
  "use strict";

  /* ============================================================
     CONTENT LOADING FROM MARKDOWN
     Fetches content.md and makes it available as window.AURIVARA_CONTENT
  ============================================================ */

  async function loadSiteContent() {
    try {
      const res = await fetch('/content.md');
      if (!res.ok) throw new Error('Failed to load content.md');
      const md = await res.text();

      const content = parseAurivaraMarkdown(md);
      window.AURIVARA_CONTENT = content;

      // Merge A/B variants from Markdown into the existing system
      if (content.variants && window.AURIVARA_AB) {
        window.AURIVARA_AB.variants = {
          A: content.variants.A || {},
          B: content.variants.B || {}
        };
      }

      console.log('%c[Aurivara] Content loaded from content.md', 'color:#4fb39a');
      return content;
    } catch (err) {
      console.warn('[Aurivara] Could not load content.md, using fallback in HTML', err);
      return null;
    }
  }

  function parseAurivaraMarkdown(md) {
    const lines = md.split('\n');
    const content = {
      meta: {},
      hero: { variants: {} },
      about: {},
      features: { items: [] },
      faq: { questions: [] },
      variants: {}
    };

    let currentSection = null;
    let currentVariant = null;
    let currentFeature = null;
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line || line.startsWith('>')) continue;

      // Top level sections
      if (line.startsWith('## ')) {
        const section = line.replace('## ', '').toLowerCase().trim();
        currentSection = section;
        currentVariant = null;
        currentFeature = null;
        currentQuestion = null;
        continue;
      }

      // Variant blocks under Hero
      if (line.startsWith('### Variant ')) {
        currentVariant = line.replace('### Variant ', '').trim().toUpperCase();
        if (currentSection === 'hero') {
          content.hero.variants[currentVariant] = {};
        }
        if (currentSection === 'variant config (for a/b testing)') {
          content.variants[currentVariant] = {};
        }
        continue;
      }

      // Key: Value lines
      if (line.includes(':') && !line.startsWith('-') && !line.startsWith('*')) {
        const colonIndex = line.indexOf(':');
        const key = line.substring(0, colonIndex).trim().toLowerCase().replace(/\s+/g, '');
        let value = line.substring(colonIndex + 1).trim();

        // Handle bold markdown in values
        value = value.replace(/\*\*(.+?)\*\*/g, '$1');

        if (currentSection === 'meta') {
          content.meta[key] = value;
        } else if (currentSection === 'hero' && currentVariant) {
          content.hero.variants[currentVariant][key] = value;
        } else if (currentSection === 'about') {
          content.about[key] = value;
        } else if (currentSection === 'features' && currentFeature) {
          currentFeature[key] = value;
        } else if (currentSection === 'variant config (for a/b testing)' && currentVariant) {
          content.variants[currentVariant][key] = value;
        }
        continue;
      }

      // Feature blocks
      if (line.startsWith('### Feature ')) {
        currentFeature = { num: line.replace('### Feature ', '').trim() };
        content.features.items.push(currentFeature);
        continue;
      }

      // FAQ Questions
      if (line.startsWith('#### Q')) {
        currentQuestion = {};
        content.faq.questions.push(currentQuestion);
        continue;
      }

      if (line.startsWith('**Question:**') && currentQuestion) {
        currentQuestion.question = line.replace('**Question:**', '').trim();
      }
      if (line.startsWith('**Answer:**') && currentQuestion) {
        currentQuestion.answer = line.replace('**Answer:**', '').trim();
      }
    }

    return content;
  }

  // Load content early (before A/B system runs)
  // Note: This is async, so we start it immediately
  const contentPromise = loadSiteContent();

  // After content loads, re-apply A/B if new variants came from Markdown
  contentPromise.then(() => {
    if (window.AURIVARA_CONTENT && window.AURIVARA_CONTENT.variants) {
      // The A/B system will have already merged the variants above.
      // We can trigger a re-application here if needed in the future.
      console.log('%c[Aurivara] Content variants merged from Markdown', 'color:#4fb39a');
    }
  });

  /* ---------------- A/B TESTING + VARIANT EXPOSURE ---------------- */
  var cfg = window.AURIVARA_AB || null;
  var variant = "A";
  var KEY = "aurivara_ab_variant";
  var pageName = (cfg && cfg.page) || "startup";
  var COOKIE_EXPIRY_DAYS = (cfg && cfg.cookieExpiryDays) || 15; // Persist variant for 15 days by default

  /* ---- Cookie helpers (replaces localStorage for stronger persistence across refreshes & sessions)
     Default expiry is now 15 days. Can be overridden via cookieExpiryDays in window.AURIVARA_AB.
  ---- */
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  if (cfg && cfg.variants) {
    KEY = cfg.key || KEY;

    // Prefer cookie, fall back to localStorage (with migration), then assign new
    variant = getCookie(KEY);
    if (variant !== "A" && variant !== "B") {
      variant = localStorage.getItem(KEY); // migration from previous localStorage users
      if (variant === "A" || variant === "B") {
        setCookie(KEY, variant, COOKIE_EXPIRY_DAYS);
      }
    }

    if (variant !== "A" && variant !== "B") {
      variant = Math.random() < 0.5 ? "A" : "B";
      setCookie(KEY, variant, COOKIE_EXPIRY_DAYS);
    }

    var applyVariant = function (v) {
      var data = cfg.variants[v];
      if (!data) return;
      Object.keys(data).forEach(function (field) {
        document.querySelectorAll('[data-ab="' + field + '"]').forEach(function (el) {
          el.textContent = data[field];
        });
      });

      console.log(
        "%c[Aurivara A/B] %c" + pageName + ": active variant: %c" + v,
        "color:#c8a24c;font-weight:bold", "color:#a39b8c", "color:#f4e3a4;font-weight:bold"
      );
      Object.keys(data).forEach(function (field) {
        console.log("  • " + field + ":", data[field]);
      });
    };

    applyVariant(variant);

    // Set variant as a User Property (in addition to the event parameter).
    // This enables better user-level analysis, audiences, and segmentation by variant.
    gtag('set', { 'variant': variant });

    // Push variant_assigned directly to dataLayer as an early, reliable signal.
    // This helps ensure the event is captured for returning users who already
    // have the A/B cookie (in addition to the delayed send below).
    (window.dataLayer = window.dataLayer || []).push({
      event: "variant_assigned",
      variant: variant,
      page: pageName
    });
  }

  // Expose variant globally so other scripts / console can access it
  window.AURIVARA_VARIANT = variant;
  window.AURIVARA_PAGE = pageName;

  /* ---------------- GA4 TRACKING HELPERS ---------------- */
  function trackEvent(eventName, params) {
    params = params || {};
    params.variant = variant;
    params.page = pageName;

    if (typeof gtag === "function") {
      gtag("event", eventName, params);
    } else {
      // Queue safely if gtag hasn't loaded yet
      (window.dataLayer = window.dataLayer || []).push({
        event: eventName,
        ...params
      });
    }

    // Also log in console during development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("%c[GA4] " + eventName, "color:#4fb39a", params);
    }
  }

  // Make tracking available globally
  window.AURIVARA = window.AURIVARA || {};
  window.AURIVARA.trackEvent = trackEvent;
  window.AURIVARA.getVariant = function () { return variant; };

  // Fire "variant_assigned" for GA4 A/B reporting.
  // We use a small delay + wait for the 'load' event to give the async
  // GA4 gtag script time to fully initialize. This ensures the event
  // reliably fires for both new visitors and returning users who already
  // have the A/B cookie.
  function sendVariantAssigned() {
    // Re-set the user property on every page load for reliability
    gtag('set', { 'variant': variant });
    trackEvent("variant_assigned");
  }

  if (document.readyState === "complete") {
    setTimeout(sendVariantAssigned, 120);
  } else {
    window.addEventListener("load", function () {
      setTimeout(sendVariantAssigned, 120);
    });
  }

  /* ---------------- NAV SCROLL STATE ---------------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- MOBILE MENU ---------------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    var closeMenu = function () {
      burger.classList.remove("open");
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------------- CTA CLICK TRACKING (with variant) ---------------- */
  // Tracks all primary conversion buttons + secondary CTAs
  document.addEventListener("click", function (e) {
    var target = e.target.closest("a, button");
    if (!target) return;

    var text = (target.textContent || "").trim().replace(/\s+/g, " ");
    var href = target.getAttribute("href") || "";
    var location = "unknown";

    // Hero primary CTA
    if (target.closest(".hero-actions")) {
      location = "hero_primary";
    }
    // About section CTA
    else if (target.closest(".about")) {
      location = "about";
    }
    // Nav CTA
    else if (target.closest(".nav-cta") || target.closest(".nav")) {
      location = "nav";
    }
    // Footer CTA
    else if (target.closest(".footer")) {
      location = "footer";
    }
    // Mobile menu
    else if (target.closest(".mobile-menu")) {
      location = "mobile_menu";
    }
    // Form submit button (we also track on actual submit)
    else if (target.closest("#contactForm")) {
      location = "contact_form_button";
    }

    // Only track if it looks like a conversion-oriented click
    var isConversionCTA = href.includes("#contact") ||
                          text.toLowerCase().includes("book") ||
                          text.toLowerCase().includes("hello") ||
                          text.toLowerCase().includes("touch") ||
                          text.toLowerCase().includes("call") ||
                          target.classList.contains("btn-gold");

    if (isConversionCTA) {
      trackEvent("cta_click", {
        cta_location: location,
        cta_text: text,
        destination: href
      });
    }
  });

  /* ---------------- FAQ ACCORDION + TRACKING ---------------- */
  var items = document.querySelectorAll("#faqList .faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;

    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      var questionText = q.textContent.replace(/\s*→$/, "").trim();

      items.forEach(function (other) {
        other.classList.remove("open");
        var oa = other.querySelector(".faq-a");
        if (oa) oa.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";

        // Track FAQ engagement with the question
        trackEvent("faq_open", { question: questionText });
      }
    });
  });

  /* ---------------- CONTACT FORM ---------------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var valid = true;
      [name, email].forEach(function (f) {
        if (!f) return;
        if (!f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
          f.style.borderColor = "#b4524a";
          valid = false;
        } else {
          f.style.borderColor = "";
        }
      });
      if (!valid) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var formData = {};
      new FormData(form).forEach(function (value, key) { formData[key] = value; });
      formData.variant = variant;

      try {
        var response = await fetch('https://formspree.io/f/mblopyvn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        form.classList.add("sent");
        console.log("[Aurivara] Inquiry submitted (variant " + variant + ")");

        // Track successful form conversion with variant
        trackEvent("form_submit", {
          form_location: "contact_section"
        });
      } catch (err) {
        console.error("[Aurivara] Submission failed", err);
        if (submitBtn) submitBtn.disabled = false;
        alert("Sorry. Something went wrong sending your message. Please try again or email us directly.");
      }
    });
  }

  /* ---------------- SCROLL DEPTH TRACKING ---------------- */
  (function () {
    var depths = [25, 50, 75, 90];
    var reached = {};

    function trackScrollDepth() {
      var scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
      );

      depths.forEach(function (d) {
        if (scrollPercent >= d && !reached[d]) {
          reached[d] = true;
          trackEvent("scroll_depth", { percent: d });
        }
      });
    }

    var scrollHandler = function () {
      trackScrollDepth();
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    // Fire once on load in case user lands deep
    setTimeout(trackScrollDepth, 1500);
  })();

  /* ---------------- SCROLL REVEAL ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------------- YEAR ---------------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- FREE WEBSITE PREVIEW WIDGET (bottom right) ---------------- */
  (function initPreviewWidget() {
    var widget = document.getElementById("previewWidget");
    if (!widget) return;

    var closeBtn = widget.querySelector(".widget-close");
    var ctaBtn = widget.querySelector(".widget-cta");

    // TESTING MODE: LocalStorage "show once per user" is temporarily disabled.
    // The widget will appear on every page load/refresh while testing.
    var DISMISSED_KEY = "aurivara_preview_widget_dismissed";

    // Clear any previous dismissal so it always shows during testing
    try { localStorage.removeItem(DISMISSED_KEY); } catch (e) {}

    function isDismissed() {
      // Always return false so the widget can keep showing during testing
      return false;
    }

    function markDismissed() {
      // Disabled during testing — do nothing
      // (Uncomment below if you want to restore normal behavior later)
      // try { localStorage.setItem(DISMISSED_KEY, "true"); } catch (e) {}
    }

    function showWidget() {
      if (isDismissed()) return;
      widget.setAttribute("aria-hidden", "false");
      widget.classList.add("is-visible");
    }

    function hideWidget() {
      widget.classList.remove("is-visible");
      // Remove from flow after animation
      setTimeout(function () {
        widget.setAttribute("aria-hidden", "true");
      }, 300);
    }

    function handleRequest() {
      // markDismissed();   // Disabled in testing mode
      hideWidget();

      var contact = document.getElementById("contact");
      var checkbox = document.getElementById("wants_preview");
      var wrapper = document.getElementById("inspirationWrapper");
      var inspiration = document.getElementById("website_inspiration");

      // Activate the preview request in the form
      if (checkbox) checkbox.checked = true;
      if (wrapper) wrapper.classList.add("is-visible");

      if (contact) {
        // Scroll 40px further down than the top of the contact section
        const yOffset = 40;
        const y = contact.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      // Focus the inspiration field after the scroll has had time to settle.
      // No additional scrollIntoView here — that was causing the snap
      // where "What's slowing you down?" jumped to the top.
      setTimeout(function () {
        if (inspiration) {
          inspiration.focus();
          // .select() removed to avoid extra browser-driven scrolling
        }
      }, 1350);
    }

    function handleClose() {
      // markDismissed();   // Disabled in testing mode
      hideWidget();
    }

    // Event listeners
    if (closeBtn) closeBtn.addEventListener("click", handleClose);
    if (ctaBtn) ctaBtn.addEventListener("click", handleRequest);

    // Gentle appearance — less aggressive than the old modal
    if (!isDismissed()) {
      setTimeout(function () {
        // Only show if user isn't already deep into the contact area
        var scrollY = window.scrollY || 0;
        var contactSection = document.getElementById("contact");
        var nearContact = contactSection && (contactSection.getBoundingClientRect().top < 200);

        if (!nearContact && scrollY < 1800) {
          showWidget();
        }
      }, 1000); // 1 second
    }

    /* ---------------- PREVIEW CHECKBOX TOGGLE (form) ---------------- */
    var wantsPreview = document.getElementById("wants_preview");
    var inspirationWrapper = document.getElementById("inspirationWrapper");

    if (wantsPreview && inspirationWrapper) {
      wantsPreview.addEventListener("change", function () {
        if (wantsPreview.checked) {
          inspirationWrapper.classList.add("is-visible");
        } else {
          inspirationWrapper.classList.remove("is-visible");
          var ta = document.getElementById("website_inspiration");
          if (ta) ta.value = "";
        }
      });
    }
  })();
})();
