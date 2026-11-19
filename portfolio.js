
const projects = [
  {
    title: "Company Website Redesign",
    category: "web",
    description: "A responsive, accessible redesign of an internal department website.",
    tags: ["HTML", "CSS", "JavaScript"],
    emoji: "🌐",
    gradient: "linear-gradient(135deg,#5b4bff,#8f7bff)",
    demo: "#",
    code: "#",
  },
  {
    title: "Sales Insights Dashboard",
    category: "data",
    description: "Cleaned and visualised monthly sales data to highlight trends and top performers.",
    tags: ["Excel", "Power BI", "Analysis"],
    emoji: "📊",
    gradient: "linear-gradient(135deg,#00b894,#00cec9)",
    demo: "#",
    code: "#",
  },
  {
    title: "Product Launch Video",
    category: "media",
    description: "Scripted, shot and edited a 60-second promo with motion text and sound design.",
    tags: ["Video Editing", "Storyboarding"],
    emoji: "🎬",
    gradient: "linear-gradient(135deg,#ff6b9d,#ff9a76)",
    demo: "#",
    code: null,
  },
  {
    title: "Task Tracker App",
    category: "web",
    description: "A lightweight to-do app with local storage, filters and keyboard shortcuts.",
    tags: ["JavaScript", "LocalStorage"],
    emoji: "✅",
    gradient: "linear-gradient(135deg,#fdcb6e,#e17055)",
    demo: "#",
    code: "#",
  },
  {
    title: "Survey Data Analysis",
    category: "data",
    description: "Analysed survey responses, built charts and wrote up actionable recommendations.",
    tags: ["Python", "Pandas", "Charts"],
    emoji: "📈",
    gradient: "linear-gradient(135deg,#0984e3,#74b9ff)",
    demo: "#",
    code: "#",
  },
  {
    title: "Digital Process Automation",
    category: "web",
    description: "Moved a paper-based request workflow into a simple digital form and tracker.",
    tags: ["Digital Transformation", "Forms"],
    emoji: "⚙️",
    gradient: "linear-gradient(135deg,#6c5ce7,#fd79a8)",
    demo: "#",
    code: null,
  },
];

/* ---------- 2. Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- 3. Theme toggle (remembers choice) ---------- */
const themeBtn = $("#theme-toggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (_) {}
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (_) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
})();

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

/* ---------- 4. Mobile menu ---------- */
const burger = $("#burger");
const navLinks = $("#nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  burger.textContent = "☰";
}

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
  burger.textContent = open ? "✕" : "☰";
});
$$("#nav-links a").forEach((a) => a.addEventListener("click", closeMenu));

/* ---------- 5. Header shadow + active link on scroll ---------- */
const header = $("#header");
const sections = $$("main section[id]");
const links = $$("#nav-links a");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);

  const pos = window.scrollY + window.innerHeight / 3;
  let current = "";
  sections.forEach((s) => { if (pos >= s.offsetTop) current = s.id; });
  links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 6. Typing effect ---------- */
const words = ["websites.", "dashboards.", "stories.", "digital solutions."];
const typedEl = $("#typed");
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  typedEl.textContent = word.slice(0, ci);

  if (!deleting && ci < word.length) { ci++; return setTimeout(type, 90); }
  if (!deleting && ci === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && ci > 0) { ci--; return setTimeout(type, 45); }

  deleting = false;
  wi = (wi + 1) % words.length;
  setTimeout(type, 300);
}
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typedEl.textContent = words[0];
} else {
  type();
}

/* ---------- 7. Scroll reveal + skill bars + counters ---------- */
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1200;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      const bar = $(".bar span", el);
      if (bar) bar.style.width = bar.dataset.level + "%";

      $$("[data-count]", el).forEach(animateCount);
      observer.unobserve(el);
    });
  },
  { threshold: 0.2 }
);
$$(".reveal").forEach((el) => observer.observe(el));

/* ---------- 8. Render + filter projects ---------- */
const grid = $("#projects-grid");

function renderProjects(filter = "all") {
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  grid.innerHTML = list
    .map(
      (p) => `
    <article class="card">
      <div class="card__thumb" style="background:${p.gradient}" aria-hidden="true">${p.emoji}</div>
      <div class="card__body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
        <div class="card__links">
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Live demo →</a>` : ""}
          ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Source</a>` : ""}
        </div>
      </div>
    </article>`
    )
    .join("");
}
renderProjects();

$$(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderProjects(btn.dataset.filter);
  })
);

/* ---------- 9. Contact form validation ---------- */
const form = $("#contact-form");
const statusEl = $("#form-status");

function validateField(field) {
  const errorEl = field.parentElement.querySelector(".error");
  let msg = "";

  if (!field.value.trim()) {
    msg = "This field is required.";
  } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    msg = "Please enter a valid email address.";
  } else if (field.name === "message" && field.value.trim().length < 10) {
    msg = "Message should be at least 10 characters.";
  }

  errorEl.textContent = msg;
  field.classList.toggle("invalid", !!msg);
  return !msg;
}

$$("input, textarea", form).forEach((f) => f.addEventListener("blur", () => validateField(f)));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = $$("input, textarea", form).map(validateField).every(Boolean);
  if (!valid) return;

  /* ---- Hook up a real backend here ----
     Easiest options: Formspree, Web3Forms or EmailJS.
     Example with Formspree:
       fetch("https://formspree.io/f/YOUR_ID", {
         method: "POST",
         headers: { Accept: "application/json" },
         body: new FormData(form),
       })
  */
  statusEl.textContent = "Thanks! Your message has been sent (demo).";
  statusEl.classList.add("ok");
  form.reset();
  setTimeout(() => (statusEl.textContent = ""), 5000);
});

/* ---------- 10. Footer year ---------- */
$("#year").textContent = new Date().getFullYear();