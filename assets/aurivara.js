/* ============================================================
   AURIVARA — shared behavior
   Reads window.AURIVARA_AB = { key, variants:{A:{...},B:{...}} }
   Applies variant text to [data-ab="<field>"] elements.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- A/B TESTING ---------------- */
  var cfg = window.AURIVARA_AB || null;
  var variant = "A";

  if (cfg && cfg.variants) {
    var KEY = cfg.key || "aurivara_ab_variant";
    variant = localStorage.getItem(KEY);
    if (variant !== "A" && variant !== "B") {
      variant = Math.random() < 0.5 ? "A" : "B";
      localStorage.setItem(KEY, variant);
    }

    var applyVariant = function (v) {
      var data = cfg.variants[v];
      if (!data) return;
      Object.keys(data).forEach(function (field) {
        document.querySelectorAll('[data-ab="' + field + '"]').forEach(function (el) {
          el.textContent = data[field];
        });
      });
      var label = document.getElementById("variantLabel");
      if (label) label.textContent = v;

      console.log(
        "%c[Aurivara A/B] %c" + (cfg.page || "page") + " — active variant: %c" + v,
        "color:#c8a24c;font-weight:bold", "color:#a39b8c", "color:#f4e3a4;font-weight:bold"
      );
      Object.keys(data).forEach(function (field) {
        console.log("  • " + field + ":", data[field]);
      });
    };

    applyVariant(variant);

    var reroll = document.getElementById("variantReroll");
    if (reroll) {
      reroll.addEventListener("click", function () {
        variant = variant === "A" ? "B" : "A";
        localStorage.setItem(KEY, variant);
        applyVariant(variant);
      });
    }
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

  /* ---------------- FAQ ACCORDION ---------------- */
  var items = document.querySelectorAll("#faqList .faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (other) {
        other.classList.remove("open");
        var oa = other.querySelector(".faq-a");
        if (oa) oa.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
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
      } catch (err) {
        console.error("[Aurivara] Submission failed", err);
        if (submitBtn) submitBtn.disabled = false;
        alert("Sorry — something went wrong sending your message. Please try again or email us directly.");
      }
    });
  }

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
