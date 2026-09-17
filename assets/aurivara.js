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
        console.log("  - " + field + ":", data[field]);
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
    // "How the call goes" band
    else if (target.closest(".call-band")) {
      location = "call_band";
    }
    // Final call section
    else if (target.closest(".call-final")) {
      location = "call_final";
    }
    // Sticky mobile call bar
    else if (target.closest(".callbar")) {
      location = "sticky_bar";
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

    // Phone calls are THE conversion on this site, so they get their own event.
    if (href.indexOf("tel:") === 0) {
      trackEvent("call_click", {
        cta_location: target.getAttribute("data-call") || location,
        cta_text: text,
        destination: href
      });
      return;
    }

    // Everything else that still points at the funnel
    var isConversionCTA = href.includes("#call") ||
                          href.includes("#callback") ||
                          text.toLowerCase().includes("callback") ||
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
      var phone = form.querySelector("#phone");
      var valid = true;
      [name, phone].forEach(function (f) {
        if (!f) return;
        // A usable phone number is any entry with at least 10 digits in it.
        var digits = (f.value || "").replace(/\D/g, "");
        var bad = !f.value.trim() || (f.type === "tel" && digits.length < 10);
        if (bad) {
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
        console.log("[Aurivara] Callback requested (variant " + variant + ")");

        // Track successful callback request with variant
        trackEvent("callback_request", {
          form_location: "call_section",
          best_time: formData.best_time || "anytime"
        });
      } catch (err) {
        console.error("[Aurivara] Submission failed", err);
        if (submitBtn) submitBtn.disabled = false;
        alert("Sorry, something went wrong sending your request. Please try again, or just call (615) 988-0408.");
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

  /* ---------------- STICKY CALL BAR (mobile) ---------------- */
  (function initCallBar() {
    var bar = document.getElementById("callbar");
    if (!bar) return;

    var hero = document.getElementById("hero");
    var finalCall = document.getElementById("call");
    var shown = false;

    function update() {
      // Show once the visitor has scrolled past the hero, hide again over the
      // final call section where the big number is already on screen.
      var pastHero = hero ? (hero.getBoundingClientRect().bottom < 0) : (window.scrollY > 600);
      var atFinal = finalCall && (finalCall.getBoundingClientRect().top < window.innerHeight * 0.8);
      var shouldShow = pastHero && !atFinal;

      if (shouldShow && !shown) {
        bar.classList.add("is-visible");
        bar.setAttribute("aria-hidden", "false");
        shown = true;
        trackEvent("callbar_shown");
      } else if (!shouldShow && shown) {
        bar.classList.remove("is-visible");
        bar.setAttribute("aria-hidden", "true");
        shown = false;
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  })();

  /* ---------------- CALLBACK FALLBACK OPEN TRACKING ---------------- */
  (function initCallbackDetails() {
    var details = document.getElementById("callback");
    if (!details) return;

    details.addEventListener("toggle", function () {
      if (details.open) {
        trackEvent("callback_form_open");
        var phone = document.getElementById("phone");
        setTimeout(function () { if (phone) phone.focus({ preventScroll: true }); }, 250);
      }
    });

    // Deep links (#callback) should open the fallback rather than land on a closed row.
    function openFromHash() {
      if (window.location.hash === "#callback" && !details.open) {
        details.open = true;
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    document.querySelectorAll('a[href="#callback"]').forEach(function (a) {
      a.addEventListener("click", function () {
        details.open = true;
      });
    });
  })();
})();
