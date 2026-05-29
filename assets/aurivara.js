/* ============================================================
   AURIVARA — shared behavior
   Reads window.AURIVARA_AB = { key, variants:{A:{...},B:{...}} }
   Applies variant text to [data-ab="<field>"] elements.
   Includes GA4 event tracking with variant attached.
   ============================================================ */
(function () {
  "use strict";

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
        "%c[Aurivara A/B] %c" + pageName + " — active variant: %c" + v,
        "color:#c8a24c;font-weight:bold", "color:#a39b8c", "color:#f4e3a4;font-weight:bold"
      );
      Object.keys(data).forEach(function (field) {
        console.log("  • " + field + ":", data[field]);
      });
    };

    applyVariant(variant);
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

  // Fire as soon as we know the variant (critical for A/B analysis)
  trackEvent("variant_assigned");

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
        alert("Sorry — something went wrong sending your message. Please try again or email us directly.");
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
})();
