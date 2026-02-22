const revealEls = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentPath = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
const currentHash = window.location.hash;

const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const createScrollProgress = () => {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.innerHTML = '<div class="scroll-progress-fill" id="scrollProgressFill"></div>';
  document.body.appendChild(progress);
  return progress.querySelector("#scrollProgressFill");
};

const createNavBackdrop = () => {
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);
  return backdrop;
};

const createMobileQuickBar = () => {
  const quickBar = document.createElement("div");
  quickBar.className = "mobile-quick-bar";
  const ratesLink = currentPath === "index.html" ? "#rates" : "index.html#rates";
  quickBar.innerHTML = `
    <a href="${ratesLink}" data-en="Today's Rates" data-hi="आज के रेट">Today's Rates</a>
    <a class="primary" href="tel:+919608217401" data-en="Call Now" data-hi="अभी कॉल करें">Call Now</a>
  `;
  document.body.appendChild(quickBar);
};

const createLanguageToggle = () => {
  const toggle = document.createElement("div");
  toggle.className = "page-lang-toggle";
  toggle.setAttribute("role", "group");
  toggle.setAttribute("aria-label", "Language switcher");
  toggle.innerHTML = `
    <button type="button" class="lang-btn is-active" data-lang="hi" aria-pressed="true">हिंदी</button>
    <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">English</button>
  `;
  const main = document.querySelector("main");
  if (main) {
    main.prepend(toggle);
  } else {
    document.body.appendChild(toggle);
  }
  return toggle;
};

const scrollProgressFill = createScrollProgress();
const navBackdrop = createNavBackdrop();
createMobileQuickBar();
const languageToggle = createLanguageToggle();
const languageButtons = Array.from(languageToggle.querySelectorAll(".lang-btn"));

const pageTranslations = {
  "index.html": {
    ".hero-kicker": { en: "Trusted Since 2009", hi: "\u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u0938\u0947\u0935\u093e 2009 \u0938\u0947" },
    "main#home .hero h1": { en: "Reliable poultry supply and integration partner in Jharkhand.", hi: "\u091d\u093e\u0930\u0916\u0902\u0921 \u092e\u0947\u0902 \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u0914\u0930 \u0907\u0902\u091f\u0940\u0917\u094d\u0930\u0947\u0936\u0928 \u092a\u093e\u0930\u094d\u091f\u0928\u0930\u0964" },
    ".hero-copy": { en: "Akela Poultry supplies poultry feed, poultry chicks, ready bird (chota/mota), and hatching egg with dependable office-wise dispatch and contractual poultry integration support across Jharkhand.", hi: "\u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u091d\u093e\u0930\u0916\u0902\u0921 \u092d\u0930 \u092e\u0947\u0902 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u092b\u0940\u0921, \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u091a\u093f\u0915\u094d\u0938, \u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 (\u091b\u094b\u091f\u093e/\u092e\u094b\u091f\u093e) \u0914\u0930 \u0939\u0948\u091a\u093f\u0902\u0917 \u090f\u0917 \u0915\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u0915\u0930\u0924\u093e \u0939\u0948\u0964" },
    ".hero-live-label": { en: "Live Support", hi: "\u0932\u093e\u0907\u0935 \u0938\u092a\u094b\u0930\u094d\u091f" },
    ".hero-live-card h3": { en: "Rate board updates every day", hi: "\u0930\u0947\u091f \u092c\u094b\u0930\u094d\u0921 \u0930\u094b\u091c \u0905\u092a\u0921\u0947\u091f \u0939\u094b\u0924\u093e \u0939\u0948" },
    ".hero-live-card p": { en: "Office-wise rates are managed through our hubs with full Jharkhand coverage.", hi: "\u092b\u0941\u0932 \u091d\u093e\u0930\u0916\u0902\u0921 \u0915\u0935\u0930\u0947\u091c \u0915\u0947 \u0938\u093e\u0925 \u0939\u092e\u093e\u0930\u0947 \u0939\u092c\u094d\u0938 \u0938\u0947 \u0911\u092b\u093f\u0938-\u0935\u093e\u0907\u091c \u0930\u0947\u091f \u092e\u0948\u0928\u0947\u091c \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964" },
    "#trust-strip span:nth-child(1)": { en: "Trusted Trade Network", hi: "\u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u091f\u094d\u0930\u0947\u0921 \u0928\u0947\u091f\u0935\u0930\u094d\u0915" },
    "#trust-strip span:nth-child(2)": { en: "Contractual Broiler farming", hi: "\u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092b\u093e\u0930\u094d\u092e\u093f\u0902\u0917" },
    "#trust-strip span:nth-child(3)": { en: "Office-wise Daily Rate Updates", hi: "\u0911\u092b\u093f\u0938-\u0935\u093e\u0907\u091c \u0930\u094b\u091c\u093e\u0928\u093e \u0930\u0947\u091f \u0905\u092a\u0921\u0947\u091f" },
    "#trust-strip span:nth-child(4)": { en: "Fast Dispatch Across 5 Locations", hi: "5 \u0932\u094b\u0915\u0947\u0936\u0928 \u092a\u0930 \u0924\u0947\u091c \u0921\u093f\u0938\u094d\u092a\u0948\u091a" },
    "#rates .eyebrow": { en: "Daily Rates", hi: "\u0926\u0948\u0928\u093f\u0915 \u0930\u0947\u091f" },
    "#rates h2": { en: "Today's Live Rate Board", hi: "\u0906\u091c \u0915\u093e \u0932\u093e\u0907\u0935 \u0930\u0947\u091f \u092c\u094b\u0930\u094d\u0921" },
    "#rates .rate-note": { en: "Ready bird (Chota and Mota, per kg) and broiler chicks (per piece) rates are office-wise and updated daily.", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 (\u091b\u094b\u091f\u093e/\u092e\u094b\u091f\u093e \u092a\u094d\u0930\u0924\u093f \u0915\u093f\u0932\u094b) \u0914\u0930 \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u091a\u093f\u0915\u094d\u0938 (\u092a\u094d\u0930\u0924\u093f \u092a\u0940\u0938) \u0915\u0947 \u0930\u0947\u091f \u0911\u092b\u093f\u0938-\u0935\u093e\u0907\u091c \u0930\u094b\u091c \u0905\u092a\u0921\u0947\u091f \u0939\u094b\u0924\u0947 \u0939\u0948\u0902\u0964" },
    "#rates .rate-alert": { en: "Office-wise rates change daily. Confirm before dispatch.", hi: "\u0911\u092b\u093f\u0938-\u0935\u093e\u0907\u091c \u0930\u0947\u091f \u0930\u094b\u091c \u092c\u0926\u0932\u0924\u0947 \u0939\u0948\u0902\u0964 \u0921\u093f\u0938\u094d\u092a\u0948\u091a \u0938\u0947 \u092a\u0939\u0932\u0947 \u0915\u0928\u094d\u092b\u0930\u094d\u092e \u0915\u0930\u0947\u0902\u0964" },
    ".rate-tab[data-rate-filter='all']": { en: "All", hi: "\u0938\u092d\u0940" },
    ".rate-tab[data-rate-filter='chota']": { en: "Ready Bird Chota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u091b\u094b\u091f\u093e" },
    ".rate-tab[data-rate-filter='mota']": { en: "Ready Bird Mota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u092e\u094b\u091f\u093e" },
    ".rate-tab[data-rate-filter='chicks']": { en: "Broiler Chicks", hi: "\u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u091a\u093f\u0915\u094d\u0938" },
    "#contact .eyebrow": { en: "Contact", hi: "\u0938\u0902\u092a\u0930\u094d\u0915" },
    "#contact h2": { en: "Contact Our Registered Office", hi: "\u0939\u092e\u093e\u0930\u0947 \u0930\u091c\u093f\u0938\u094d\u091f\u0930\u094d\u0921 \u0911\u092b\u093f\u0938 \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902" },
    "#contact .rate-note": { en: "For daily rates and urgent supply, connect directly with our Giridih office.", hi: "\u0926\u0948\u0928\u093f\u0915 \u0930\u0947\u091f \u0914\u0930 \u0907\u092e\u0930\u094d\u091c\u0947\u0902\u0938\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u0915\u0947 \u0932\u093f\u090f \u0939\u092e\u093e\u0930\u0947 \u0917\u093f\u0930\u093f\u0921\u0940\u0939 \u0911\u092b\u093f\u0938 \u0938\u0947 \u0938\u0940\u0927\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964" },
    ".contact-switch-btn[data-contact-tab='info']": { en: "Office Info", hi: "\u0911\u092b\u093f\u0938 \u091c\u093e\u0928\u0915\u093e\u0930\u0940" },
    ".contact-switch-btn[data-contact-tab='map']": { en: "Map", hi: "\u092e\u0948\u092a" },
    ".contact-switch-btn[data-contact-tab='form']": { en: "Inquiry", hi: "\u0907\u0928\u094d\u0915\u094d\u0935\u093e\u092f\u0930\u0940" },
    ".contact-info h3": { en: "Akela Poultry (Registered Office)", hi: "\u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 (\u0930\u091c\u093f\u0938\u094d\u091f\u0930\u094d\u0921 \u0911\u092b\u093f\u0938)" },
    ".registered-map h3": { en: "Giridih Office Map", hi: "\u0917\u093f\u0930\u093f\u0921\u0940\u0939 \u0911\u092b\u093f\u0938 \u092e\u0948\u092a" },
    ".registered-map p": { en: "Registered office location", hi: "\u0930\u091c\u093f\u0938\u094d\u091f\u0930\u094d\u0921 \u0911\u092b\u093f\u0938 \u0932\u094b\u0915\u0947\u0936\u0928" },
    "#story .eyebrow": { en: "Akela Story", hi: "\u0905\u0915\u0947\u0932\u093e \u0915\u0939\u093e\u0928\u0940" },
    "#story h2": { en: "Visual-first supply operations and market readiness", hi: "\u0935\u093f\u091c\u0941\u0905\u0932-\u092b\u0930\u094d\u0938\u094d\u091f \u0938\u092a\u094d\u0932\u093e\u0908 \u0911\u092a\u0930\u0947\u0936\u0928 \u0914\u0930 \u092e\u093e\u0930\u094d\u0915\u0947\u091f \u0924\u0948\u092f\u093e\u0930\u0940" },
    "#story .rate-note": { en: "Akela Poultry runs coordinated procurement, broiler growth cycles, and dispatch support through office-level execution.", hi: "\u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0911\u092b\u093f\u0938-\u0932\u0947\u0935\u0932 \u0938\u092e\u0928\u094d\u0935\u092f \u0915\u0947 \u0938\u093e\u0925 \u092a\u094d\u0930\u094b\u0915\u094d\u092f\u094b\u0930\u092e\u0947\u0902\u091f, \u0917\u094d\u0930\u094b\u0925 \u0938\u093e\u0907\u0915\u0932 \u0914\u0930 \u0921\u093f\u0938\u094d\u092a\u0948\u091a \u0938\u092a\u094b\u0930\u094d\u091f \u091a\u0932\u093e\u0924\u093e \u0939\u0948\u0964" },
    "#story .story-card:nth-child(1) .story-kicker": { en: "Supply Network", hi: "\u0938\u092a\u094d\u0932\u093e\u0908 \u0928\u0947\u091f\u0935\u0930\u094d\u0915" },
    "#story .story-card:nth-child(1) h3": { en: "Built for quality control, route planning, and scalable output", hi: "\u0915\u094d\u0935\u093e\u0932\u093f\u091f\u0940 \u0915\u0902\u091f\u094d\u0930\u094b\u0932, \u0930\u0942\u091f \u092a\u094d\u0932\u093e\u0928\u093f\u0902\u0917 \u0914\u0930 \u0938\u094d\u0915\u0947\u0932\u0947\u092c\u0932 \u0906\u0909\u091f\u092a\u0941\u091f \u0915\u0947 \u0932\u093f\u090f \u0924\u0948\u092f\u093e\u0930" },
    "#story .story-card:nth-child(2) .story-kicker": { en: "Operational Video", hi: "\u0911\u092a\u0930\u0947\u0936\u0928 \u0935\u0940\u0921\u093f\u092f\u094b" },
    "#story .story-card:nth-child(2) h3": { en: "Real poultry operations and quality standards in motion", hi: "\u0930\u093f\u092f\u0932 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0911\u092a\u0930\u0947\u0936\u0928 \u0914\u0930 \u0915\u094d\u0935\u093e\u0932\u093f\u091f\u0940 \u0938\u094d\u091f\u0948\u0902\u0921\u0930\u094d\u0921 \u0915\u094d\u0930\u093f\u092f\u093e\u0936\u0940\u0932 \u0930\u0942\u092a \u092e\u0947\u0902" },
    "#story .story-card:nth-child(3) .story-kicker": { en: "Bird Health", hi: "\u092c\u0930\u094d\u0921 \u0939\u0947\u0932\u094d\u0925" },
    "#story .story-card:nth-child(3) h3": { en: "Daily monitoring and performance-focused bird management", hi: "\u0930\u094b\u091c\u093e\u0928\u093e \u092e\u0949\u0928\u093f\u091f\u0930\u093f\u0902\u0917 \u0914\u0930 \u092a\u0930\u092b\u0949\u0930\u094d\u092e\u0947\u0902\u0938-\u092b\u094b\u0915\u0938\u094d\u0921 \u092c\u0930\u094d\u0921 \u092e\u0948\u0928\u0947\u091c\u092e\u0947\u0902\u091f" },
    "#why-akela .eyebrow": { en: "Why Choose Akela", hi: "\u0905\u0915\u0947\u0932\u093e \u0915\u094d\u092f\u094b\u0902 \u091a\u0941\u0928\u0947\u0902" },
    "#why-akela h2": { en: "Where confidence in poultry supply begins", hi: "\u091c\u0939\u093e\u0902 \u0938\u0947 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u092e\u0947\u0902 \u0935\u093f\u0936\u094d\u0935\u093e\u0938 \u0936\u0941\u0930\u0942 \u0939\u094b\u0924\u093e \u0939\u0948" },
    "#why-akela .healing-point:nth-child(1) h3": { en: "Contractual Broiler farming", hi: "\u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092b\u093e\u0930\u094d\u092e\u093f\u0902\u0917" },
    "#why-akela .healing-point:nth-child(2) h3": { en: "Transparent Daily Rate System", hi: "\u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0940 \u0930\u094b\u091c\u093e\u0928\u093e \u0930\u0947\u091f \u0938\u093f\u0938\u094d\u091f\u092e" },
    "#why-akela .healing-point:nth-child(3) h3": { en: "Performance-Linked Grower Payout", hi: "\u092a\u0930\u092b\u0949\u0930\u094d\u092e\u0947\u0902\u0938-\u0932\u093f\u0902\u0915\u094d\u0921 \u0917\u094d\u0930\u094b\u0935\u0930 \u092a\u0947\u0906\u0909\u091f" },
    "#impact .impact-title": { en: "Our Impact", hi: "\u0939\u092e\u093e\u0930\u093e \u092a\u094d\u0930\u092d\u093e\u0935" },
    "#impact .metric-card:nth-child(1) .metric-label": { en: "Partner Farmers", hi: "\u092a\u093e\u0930\u094d\u091f\u0928\u0930 \u092b\u093e\u0930\u094d\u092e\u0930\u094d\u0938" },
    "#impact .metric-card:nth-child(2) .metric-label": { en: "Chicks Grown Annually", hi: "\u0938\u093e\u0932\u093e\u0928\u093e \u092a\u093e\u0932\u0947 \u0917\u090f \u091a\u093f\u0915\u094d\u0938" },
    "#impact .metric-card:nth-child(3) .metric-label": { en: "Years of Excellence", hi: "\u0938\u093e\u0932\u094b\u0902 \u0915\u093e \u0905\u0928\u0941\u092d\u0935" },
    "#impact .metric-card:nth-child(4) .metric-label": { en: "Support", hi: "\u0938\u092a\u094b\u0930\u094d\u091f" },
    "#contract-model .eyebrow": { en: "Contractual Broiler Model", hi: "\u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092e\u0949\u0921\u0932" },
    "#contract-model h2": { en: "How our integration cycle works", hi: "\u0939\u092e\u093e\u0930\u093e \u0907\u0902\u091f\u0940\u0917\u094d\u0930\u0947\u0936\u0928 \u0938\u093e\u0907\u0915\u0932 \u0915\u0948\u0938\u0947 \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948" },
    "#quick-order .eyebrow": { en: "Quick Order Process", hi: "\u0915\u094d\u0935\u093f\u0915 \u0911\u0930\u094d\u0921\u0930 \u092a\u094d\u0930\u094b\u0938\u0947\u0938" },
    "#quick-order h2": { en: "Book your requirement in 3 quick steps", hi: "3 \u0906\u0938\u093e\u0928 \u0938\u094d\u091f\u0947\u092a \u092e\u0947\u0902 \u0905\u092a\u0928\u093e \u0911\u0930\u094d\u0921\u0930 \u092c\u0941\u0915 \u0915\u0930\u0947\u0902" },
    "#coverage-network .eyebrow": { en: "Coverage And Dispatch", hi: "\u0915\u0935\u0930\u0947\u091c \u0914\u0930 \u0921\u093f\u0938\u094d\u092a\u0948\u091a" },
    "#coverage-network h2": { en: "Active operational presence across Jharkhand", hi: "\u091d\u093e\u0930\u0916\u0902\u0921 \u092d\u0930 \u092e\u0947\u0902 \u0938\u0915\u094d\u0930\u093f\u092f \u0911\u092a\u0930\u0947\u0936\u0928\u0932 \u092a\u094d\u0930\u0947\u091c\u0947\u0902\u0938" },
    ".site-footer p": { en: "\u00a9 2026 Akela Poultry, Giridih, Jharkhand. Poultry products, Contractual Broiler farming, and supply support.", hi: "\u00a9 2026 \u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940, \u0917\u093f\u0930\u093f\u0921\u0940\u0939, \u091d\u093e\u0930\u0916\u0902\u0921\u0964 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f, \u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092b\u093e\u0930\u094d\u092e\u093f\u0902\u0917 \u0914\u0930 \u0938\u092a\u094d\u0932\u093e\u0908 \u0938\u092a\u094b\u0930\u094d\u091f\u0964" }
  },
  "about.html": {
    ".about-hero .eyebrow": { en: "About Us", hi: "\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902" },
    ".about-hero h1": { en: "Built to deliver dependable poultry supply across Jharkhand.", hi: "\u091d\u093e\u0930\u0916\u0902\u0921 \u092d\u0930 \u092e\u0947\u0902 \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u0915\u0947 \u0932\u093f\u090f \u0924\u0948\u092f\u093e\u0930\u0964" },
    ".about-story-card .eyebrow": { en: "Our Story", hi: "\u0939\u092e\u093e\u0930\u0940 \u0915\u0939\u093e\u0928\u0940" },
    ".about-story-card h2": { en: "Structured operations, transparent pricing, and reliable support", hi: "\u0938\u0902\u0917\u0920\u093f\u0924 \u0911\u092a\u0930\u0947\u0936\u0928, \u092a\u093e\u0930\u0926\u0930\u094d\u0936\u0940 \u092a\u094d\u0930\u093e\u0907\u0938\u093f\u0902\u0917 \u0914\u0930 \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u0938\u092a\u094b\u0930\u094d\u091f" },
    "#faq .eyebrow": { en: "Quick Answers", hi: "\u0924\u0947\u091c \u091c\u0935\u093e\u092c" },
    "#faq h2": { en: "Before You Place Your Next Order", hi: "\u0905\u0917\u0932\u093e \u0911\u0930\u094d\u0921\u0930 \u0926\u0947\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947" },
    "#faq .faq-card:nth-child(1) h3": { en: "How can I book an order?", hi: "\u092e\u0948\u0902 \u0911\u0930\u094d\u0921\u0930 \u0915\u0948\u0938\u0947 \u092c\u0941\u0915 \u0915\u0930\u0942\u0901?" },
    "#faq .faq-card:nth-child(2) h3": { en: "Are rates fixed for the whole week?", hi: "\u0915\u094d\u092f\u093e \u0930\u0947\u091f \u092a\u0942\u0930\u0947 \u0939\u092b\u094d\u0924\u0947 \u0915\u0947 \u0932\u093f\u090f \u092b\u093f\u0915\u094d\u0938 \u0939\u094b\u0924\u0947 \u0939\u0948\u0902?" },
    "#faq .faq-card:nth-child(3) h3": { en: "Can you handle urgent bulk requirements?", hi: "\u0915\u094d\u092f\u093e \u0906\u092a \u0905\u0930\u094d\u091c\u0947\u0902\u091f \u092c\u0932\u094d\u0915 \u0911\u0930\u094d\u0921\u0930 \u0938\u0902\u092d\u093e\u0932 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902?" },
    "#faq .faq-card:nth-child(4) h3": { en: "Which contact should I use for purchase?", hi: "\u0916\u0930\u0940\u0926 \u0915\u0947 \u0932\u093f\u090f \u0915\u094c\u0928 \u0938\u093e \u0915\u0949\u0928\u094d\u091f\u0948\u0915\u094d\u091f \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0942\u0901?" },
    ".about-cta-strong .btn-primary": { en: "Call For Purchase", hi: "\u0916\u0930\u0940\u0926 \u0915\u0947 \u0932\u093f\u090f \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    ".about-cta-strong .btn-ghost": { en: "Chat On WhatsApp", hi: "\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a \u092a\u0930 \u091a\u0948\u091f \u0915\u0930\u0947\u0902" }
  },
  "products.html": {
    ".shop-hero .eyebrow": { en: "Akela Product Store", hi: "\u0905\u0915\u0947\u0932\u093e \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f \u0938\u094d\u091f\u094b\u0930" },
    ".shop-hero h1": { en: "Shop-style product catalog for daily poultry requirements", hi: "\u0926\u0948\u0928\u093f\u0915 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u091c\u0930\u0942\u0930\u0924\u094b\u0902 \u0915\u0947 \u0932\u093f\u090f \u0936\u0949\u092a-\u0938\u094d\u091f\u093e\u0907\u0932 \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f \u0915\u0948\u091f\u093e\u0932\u0949\u0917" },
    ".shop-hero .hero-copy": { en: "Explore our product ecosystem with visual highlights and quick ordering options.", hi: "\u0939\u092e\u093e\u0930\u0947 \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f \u0935\u093f\u0915\u0932\u094d\u092a \u0915\u094b \u0935\u093f\u091c\u0941\u0905\u0932 \u0939\u093e\u0907\u0932\u093e\u0907\u091f \u0914\u0930 \u0915\u094d\u0935\u093f\u0915 \u0911\u0930\u094d\u0921\u0930 \u0911\u092a\u094d\u0936\u0928 \u0915\u0947 \u0938\u093e\u0925 \u0926\u0947\u0916\u0947\u0902\u0964" },
    ".shop-card:nth-child(1) .btn-primary, .shop-card:nth-child(2) .btn-primary, .shop-card:nth-child(3) .btn-primary, .shop-card:nth-child(4) .btn-primary, .shop-card:nth-child(5) .btn-primary, .shop-card:nth-child(6) .btn-primary": { en: "Call To Order", hi: "\u0911\u0930\u094d\u0921\u0930 \u0915\u0947 \u0932\u093f\u090f \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    "#product-showcase .eyebrow": { en: "Product Showcase", hi: "\u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f \u0936\u094b\u0915\u0947\u0938" },
    "#product-showcase h2": { en: "Visual catalog for quick comparison", hi: "\u0924\u0947\u091c \u0924\u0941\u0932\u0928\u093e \u0915\u0947 \u0932\u093f\u090f \u0935\u093f\u091c\u0941\u0905\u0932 \u0915\u0948\u091f\u093e\u0932\u0949\u0917" }
  },
  "gallery.html": {
    "#gallery-coming-soon .eyebrow": { en: "Gallery", hi: "\u0917\u0948\u0932\u0930\u0940" },
    "#gallery-coming-soon h1": { en: "Coming Soon", hi: "\u091c\u0932\u094d\u0926 \u0906 \u0930\u0939\u093e \u0939\u0948" },
    "#gallery-coming-soon .rate-note": { en: "We are preparing real Akela Poultry photos and videos. Please check back shortly.", hi: "\u0939\u092e \u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0915\u0940 \u0930\u093f\u092f\u0932 \u092b\u094b\u091f\u094b \u0914\u0930 \u0935\u0940\u0921\u093f\u092f\u094b \u0924\u0948\u092f\u093e\u0930 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 \u0915\u0943\u092a\u092f\u093e \u0915\u0941\u091b \u0938\u092e\u092f \u092c\u093e\u0926 \u0926\u0947\u0916\u0947\u0902\u0964" }
  }
};

const extraPageTranslations = {
  "index.html": {
    ".hero-trust li:nth-child(1)": { en: "17+ Years In Business", hi: "17+ \u0938\u093e\u0932\u094b\u0902 \u0915\u093e \u0905\u0928\u0941\u092d\u0935" },
    ".hero-trust li:nth-child(2)": { en: "200+ Partner Farms", hi: "200+ \u092a\u093e\u0930\u094d\u091f\u0928\u0930 \u092b\u093e\u0930\u094d\u092e\u094d\u0938" },
    ".rate-live-call": { en: "Call Now", hi: "\u0905\u092d\u0940 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    ".rate-badge": { en: "Updated Daily", hi: "\u0930\u094b\u091c \u0905\u092a\u0921\u0947\u091f" },
    ".rate-mobile-book": { en: "Call For Booking", hi: "\u092c\u0941\u0915\u093f\u0902\u0917 \u0915\u0947 \u0932\u093f\u090f \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    ".rate-card[data-office='giridih'] h3": { en: "Giridih Office", hi: "\u0917\u093f\u0930\u093f\u0921\u0940\u0939 \u0911\u092b\u093f\u0938" },
    ".rate-card[data-office='deoghar'] h3": { en: "Deoghar Office", hi: "\u0926\u0947\u0918\u0930 \u0911\u092b\u093f\u0938" },
    ".rate-card[data-office='barhi'] h3": { en: "Barhi Office", hi: "\u092c\u0930\u0939\u0940 \u0911\u092b\u093f\u0938" },
    ".rate-card[data-office='chatra'] h3": { en: "Chatra Office", hi: "\u091a\u0924\u0930\u093e \u0911\u092b\u093f\u0938" },
    ".rate-card[data-office='jamua'] h3": { en: "Jamua Office", hi: "\u091c\u092e\u0941\u0906 \u0911\u092b\u093f\u0938" },
    ".rate-line[data-rate-type='chota'] .rate-label strong": { en: "Ready Bird Chota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u091b\u094b\u091f\u093e" },
    ".rate-line[data-rate-type='mota'] .rate-label strong": { en: "Ready Bird Mota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u092e\u094b\u091f\u093e" },
    ".rate-line[data-rate-type='chicks'] .rate-label strong": { en: "Broiler Chicks", hi: "\u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u091a\u093f\u0915\u094d\u0938" },
    ".rate-line[data-rate-type='chota'] .rate-label small": { en: "per kg", hi: "\u092a\u094d\u0930\u0924\u093f \u0915\u093f\u0932\u094b" },
    ".rate-line[data-rate-type='mota'] .rate-label small": { en: "per kg", hi: "\u092a\u094d\u0930\u0924\u093f \u0915\u093f\u0932\u094b" },
    ".rate-line[data-rate-type='chicks'] .rate-label small": { en: "per piece", hi: "\u092a\u094d\u0930\u0924\u093f \u092a\u0940\u0938" },
    ".presence-map-link": { en: "\ud83d\udccd View on Google Maps", hi: "\ud83d\udccd \u0917\u0942\u0917\u0932 \u092e\u0948\u092a \u092a\u0930 \u0926\u0947\u0916\u0947\u0902" },
    ".contact-info p:nth-of-type(1)": { en: "<strong>Address:</strong><br />Sitalupur, Giridih, Jharkhand, India", hi: "<strong>\u092a\u0924\u093e:</strong><br />\u0938\u093f\u0924\u0932\u0941\u092a\u0941\u0930, \u0917\u093f\u0930\u093f\u0921\u0940\u0939, \u091d\u093e\u0930\u0916\u0902\u0921, \u092d\u093e\u0930\u0924", html: true },
    ".contact-info p:nth-of-type(2)": { en: "<strong>Phone / WhatsApp:</strong> <a href=\"tel:+919608217401\">+91 9608217401</a>", hi: "<strong>\u092b\u094b\u0928 / \u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a:</strong> <a href=\"tel:+919608217401\">+91 9608217401</a>", html: true },
    ".contact-info p:nth-of-type(3)": { en: "<strong>Email:</strong> <a href=\"mailto:akelapoultry@gmail.com\">akelapoultry@gmail.com</a>", hi: "<strong>\u0908\u092e\u0947\u0932:</strong> <a href=\"mailto:akelapoultry@gmail.com\">akelapoultry@gmail.com</a>", html: true },
    ".contact-info p:nth-of-type(4)": { en: "<strong>Coverage:</strong> Full Jharkhand coverage (via Giridih, Deoghar, Barhi, Chatra, and Jamua hubs)", hi: "<strong>\u0915\u0935\u0930\u0947\u091c:</strong> \u092a\u0942\u0930\u093e \u091d\u093e\u0930\u0916\u0902\u0921 (\u0917\u093f\u0930\u093f\u0921\u0940\u0939, \u0926\u0947\u0918\u0930, \u092c\u0930\u0939\u0940, \u091a\u0924\u0930\u093e \u0914\u0930 \u091c\u092e\u0941\u0906 \u0939\u092c \u0915\u0947 \u092e\u093e\u0927\u094d\u092f\u092e \u0938\u0947)", html: true },
    ".contact-info p:nth-of-type(5)": { en: "<strong>Working Hours:</strong><br />Monday - Saturday: 8:00 AM - 7:00 PM<br />Sunday: Open for urgent supply and enquiry", hi: "<strong>\u0915\u093e\u0930\u094d\u092f \u0938\u092e\u092f:</strong><br />\u0938\u094b\u092e\u0935\u093e\u0930 - \u0936\u0928\u093f\u0935\u093e\u0930: 8:00 AM - 7:00 PM<br />\u0930\u0935\u093f\u0935\u093e\u0930: \u0905\u0930\u094d\u091c\u0947\u0902\u091f \u0938\u092a\u094d\u0932\u093e\u0908 \u0914\u0930 \u0907\u0928\u094d\u0915\u094d\u0935\u093e\u092f\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f \u0916\u0941\u0932\u093e", html: true },
    ".contact-cta-row .btn-primary": { en: "Call Now", hi: "\u0905\u092d\u0940 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    ".contact-cta-row .btn-ghost": { en: "WhatsApp", hi: "\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a" },
    ".form-label-text:nth-of-type(1)": { en: "Full Name", hi: "\u092a\u0942\u0930\u093e \u0928\u093e\u092e" },
    ".form-label-text:nth-of-type(2)": { en: "Phone Number", hi: "\u092b\u094b\u0928 \u0928\u0902\u092c\u0930" },
    ".form-label-text:nth-of-type(3)": { en: "Requirement", hi: "\u091c\u0930\u0942\u0930\u0924" }
  },
  "about.html": {
    ".about-hero .hero-copy": { en: "Akela Poultry is a poultry company based in Giridih, supplying broiler chicks, feed, grown broilers, hatching eggs, and required poultry items with coordinated dispatch support through five operating hubs.", hi: "\u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0917\u093f\u0930\u093f\u0921\u0940\u0939 \u0938\u094d\u0925\u093f\u0924 \u090f\u0915 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0915\u0902\u092a\u0928\u0940 \u0939\u0948 \u091c\u094b \u092a\u093e\u0902\u091a \u0911\u092a\u0930\u0947\u091f\u093f\u0902\u0917 \u0939\u092c \u0915\u0947 \u092e\u093e\u0927\u094d\u092f\u092e \u0938\u0947 \u091c\u0930\u0942\u0930\u0940 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u0938\u092a\u094d\u0932\u093e\u0908 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964" },
    ".about-story-card > p:nth-of-type(2)": { en: "Our model is built around daily execution quality. We support growers with input supply and supervision, coordinate market dispatch, and maintain a transparent office-wise rate board for buyers and partners.", hi: "\u0939\u092e\u093e\u0930\u093e \u092e\u0949\u0921\u0932 \u0926\u0948\u0928\u093f\u0915 \u0911\u092a\u0930\u0947\u0936\u0928 \u0915\u094d\u0935\u093e\u0932\u093f\u091f\u0940 \u092a\u0930 \u0906\u0927\u093e\u0930\u093f\u0924 \u0939\u0948\u0964 \u0939\u092e \u0917\u094d\u0930\u094b\u0935\u0930\u094d\u0938 \u0915\u094b \u0907\u0928\u092a\u0941\u091f \u0938\u092a\u094d\u0932\u093e\u0908 \u0914\u0930 \u0938\u0941\u092a\u0930\u0935\u093f\u091c\u0928 \u0926\u0947\u0924\u0947 \u0939\u0948\u0902 \u0914\u0930 \u0911\u092b\u093f\u0938-\u0935\u093e\u0907\u091c \u0930\u0947\u091f \u092c\u094b\u0930\u094d\u0921 \u092c\u0928\u093e\u090f \u0930\u0916\u0924\u0947 \u0939\u0948\u0902\u0964" },
    "#journey .eyebrow": { en: "Timeline", hi: "\u091f\u093e\u0907\u092e\u0932\u093e\u0907\u0928" },
    "#journey h2": { en: "Founded, expanded, and scaled with consistency", hi: "\u0936\u0941\u0930\u0941\u0906\u0924 \u0938\u0947 \u0935\u093f\u0938\u094d\u0924\u093e\u0930 \u0924\u0915 \u0938\u094d\u0925\u093f\u0930 \u0935\u093f\u0915\u093e\u0938" },
    "#segments .eyebrow": { en: "Operational Strength", hi: "\u0911\u092a\u0930\u0947\u0936\u0928\u0932 \u0938\u094d\u091f\u094d\u0930\u0947\u0902\u0925" },
    "#segments h2": { en: "Fast-scan service cards", hi: "\u0924\u0947\u091c \u0938\u094d\u0915\u0948\u0928 \u0938\u0930\u094d\u0935\u093f\u0938 \u0915\u093e\u0930\u094d\u0921" },
    "#about-visuals .eyebrow": { en: "In Motion", hi: "\u0907\u0928 \u092e\u094b\u0936\u0928" },
    "#about-visuals h2": { en: "Supply readiness and field execution", hi: "\u0938\u092a\u094d\u0932\u093e\u0908 \u0930\u0947\u0921\u093f\u0928\u0947\u0938 \u0914\u0930 \u092b\u0940\u0932\u094d\u0921 \u090f\u0915\u094d\u0938\u0940\u0915\u094d\u092f\u0942\u0936\u0928" },
    "#about-social .eyebrow": { en: "Social Proof", hi: "\u0935\u093f\u0936\u094d\u0935\u093e\u0938 \u0915\u0947 \u0906\u0902\u0915\u0921\u0947" },
    "#about-social h2": { en: "Numbers trusted by growers and buyers", hi: "\u0917\u094d\u0930\u094b\u0935\u0930 \u0914\u0930 \u092c\u093e\u092f\u0930 \u0915\u093e \u0935\u093f\u0936\u094d\u0935\u0938" },
    "#faq .faq-card:nth-child(1) .faq-text-wrap": { en: "Call or WhatsApp <a href=\"tel:+919608217401\">+91&nbsp;9608217401</a> and share quantity, location, and preferred time.", hi: "\u0915\u0949\u0932 \u092f\u093e \u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a <a href=\"tel:+919608217401\">+91&nbsp;9608217401</a> \u092a\u0930 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0915\u094d\u0935\u093e\u0902\u091f\u093f\u091f\u0940, \u0932\u094b\u0915\u0947\u0936\u0928 \u0914\u0930 \u0938\u092e\u092f \u0926\u0947\u0902\u0964", html: true },
    "#faq .faq-card:nth-child(4) .faq-text-wrap": { en: "Use the same direct line for call and WhatsApp: <a href=\"tel:+919608217401\">+91&nbsp;9608217401</a>.", hi: "\u0915\u0949\u0932 \u0914\u0930 \u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0939\u0940 \u0928\u0902\u092c\u0930 \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902: <a href=\"tel:+919608217401\">+91&nbsp;9608217401</a>\u0964", html: true },
    "#presence .eyebrow": { en: "Our Presence", hi: "\u0939\u092e\u093e\u0930\u0940 \u0909\u092a\u0938\u094d\u0925\u093f\u0924\u093f" },
    "#presence h2": { en: "Serving all of Jharkhand", hi: "\u092a\u0942\u0930\u0947 \u091d\u093e\u0930\u0916\u0902\u0921 \u092e\u0947\u0902 \u0938\u0947\u0935\u093e" },
    "#presence .rate-note": { en: "Jharkhand is fully covered through major office hubs for faster response and supply movement.", hi: "\u091d\u093e\u0930\u0916\u0902\u0921 \u092e\u0947\u0902 \u092e\u0947\u091c\u0930 \u0911\u092b\u093f\u0938 \u0939\u092c \u0915\u0947 \u092e\u093e\u0927\u094d\u092f\u092e \u0938\u0947 \u092a\u0942\u0930\u093e \u0915\u0935\u0930\u0947\u091c \u0939\u0948\u0964" },
    ".presence-map-link": { en: "\ud83d\udccd View on Google Maps", hi: "\ud83d\udccd \u0917\u0942\u0917\u0932 \u092e\u0948\u092a \u092a\u0930 \u0926\u0947\u0916\u0947\u0902" }
  },
  "products.html": {
    ".media-story-grid-tight .media-story-card:nth-child(1) .media-chip": { en: "Ready Bird", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921" },
    ".media-story-grid-tight .media-story-card:nth-child(2) .media-chip": { en: "Core Input", hi: "\u0915\u094b\u0930 \u0907\u0928\u092a\u0941\u091f" },
    ".media-story-grid-tight .media-story-card:nth-child(1) h3": { en: "High-demand daily supply", hi: "\u0939\u093e\u0908-\u0921\u093f\u092e\u093e\u0902\u0921 \u0930\u094b\u091c\u093e\u0928\u093e \u0938\u092a\u094d\u0932\u093e\u0908" },
    ".media-story-grid-tight .media-story-card:nth-child(2) h3": { en: "Chicks and feed in motion", hi: "\u091a\u093f\u0915\u094d\u0938 \u0914\u0930 \u092b\u0940\u0921 \u0907\u0928 \u092e\u094b\u0936\u0928" },
    ".shop-card:nth-child(1) .shop-badge": { en: "Top Seller", hi: "\u091f\u0949\u092a \u0938\u0947\u0932\u0930" },
    ".shop-card:nth-child(2) .shop-badge": { en: "Top Seller", hi: "\u091f\u0949\u092a \u0938\u0947\u0932\u0930" },
    ".shop-card:nth-child(3) .shop-badge": { en: "Core Input", hi: "\u0915\u094b\u0930 \u0907\u0928\u092a\u0941\u091f" },
    ".shop-card:nth-child(4) .shop-badge": { en: "Hatchery", hi: "\u0939\u0948\u091a\u0930\u0940" },
    ".shop-card:nth-child(5) .shop-badge": { en: "Feed", hi: "\u092b\u0940\u0921" },
    ".shop-card:nth-child(6) .shop-badge": { en: "Equipment", hi: "\u0909\u092a\u0915\u0930\u0923" },
    ".shop-card:nth-child(1) h3": { en: "Ready Bird Chota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u091b\u094b\u091f\u093e" },
    ".shop-card:nth-child(2) h3": { en: "Ready Bird Mota", hi: "\u0930\u0947\u0921\u0940 \u092c\u0930\u094d\u0921 \u092e\u094b\u091f\u093e" },
    ".shop-card:nth-child(3) h3": { en: "Broiler Chicks", hi: "\u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u091a\u093f\u0915\u094d\u0938" },
    ".shop-card:nth-child(4) h3": { en: "Hatching Eggs", hi: "\u0939\u0948\u091a\u093f\u0902\u0917 \u090f\u0917\u094d\u0938" },
    ".shop-card:nth-child(5) h3": { en: "Poultry Feed", hi: "\u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u092b\u0940\u0921" },
    ".shop-card:nth-child(6) h3": { en: "Feeding Utensils", hi: "\u092b\u0940\u0921\u093f\u0902\u0917 \u0909\u0924\u0947\u0902\u0938\u093f\u0932\u094d\u0938" },
    ".shop-card .btn-primary": { en: "Call To Order", hi: "\u0911\u0930\u094d\u0921\u0930 \u0915\u0947 \u0932\u093f\u090f \u0915\u0949\u0932 \u0915\u0930\u0947\u0902" },
    ".shop-card:nth-child(4) .shop-price": { en: "Rate on request", hi: "\u0930\u0947\u091f \u0905\u0928\u0941\u0930\u094b\u0927 \u092a\u0930" },
    ".shop-card:nth-child(5) .shop-price": { en: "Rate on request", hi: "\u0930\u0947\u091f \u0905\u0928\u0941\u0930\u094b\u0927 \u092a\u0930" },
    ".shop-card:nth-child(6) .shop-price": { en: "Rate on request", hi: "\u0930\u0947\u091f \u0905\u0928\u0941\u0930\u094b\u0927 \u092a\u0930" },
    ".site-footer p": { en: "\u00a9 2026 Akela Poultry, Giridih, Jharkhand. Poultry products, Contractual Broiler farming, and supply support.", hi: "\u00a9 2026 \u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940, \u0917\u093f\u0930\u093f\u0921\u0940\u0939, \u091d\u093e\u0930\u0916\u0902\u0921\u0964 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f, \u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092b\u093e\u0930\u094d\u092e\u093f\u0902\u0917 \u0914\u0930 \u0938\u092a\u094d\u0932\u093e\u0908 \u0938\u092a\u094b\u0930\u094d\u091f\u0964" }
  },
  "gallery.html": {
    ".site-footer p": { en: "\u00a9 2026 Akela Poultry, Giridih, Jharkhand. Poultry products, Contractual Broiler farming, and supply support.", hi: "\u00a9 2026 \u0905\u0915\u0947\u0932\u093e \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940, \u0917\u093f\u0930\u093f\u0921\u0940\u0939, \u091d\u093e\u0930\u0916\u0902\u0921\u0964 \u092a\u094b\u0932\u094d\u091f\u094d\u0930\u0940 \u092a\u094d\u0930\u094b\u0921\u0915\u094d\u091f, \u0915\u093e\u0902\u091f\u094d\u0930\u0948\u0915\u094d\u091f \u092c\u094d\u0930\u0949\u092f\u0932\u0930 \u092b\u093e\u0930\u094d\u092e\u093f\u0902\u0917 \u0914\u0930 \u0938\u092a\u094d\u0932\u093e\u0908 \u0938\u092a\u094b\u0930\u094d\u091f\u0964" }
  }
};

Object.entries(extraPageTranslations).forEach(([page, values]) => {
  pageTranslations[page] = { ...(pageTranslations[page] || {}), ...values };
});

const applyPageTranslations = (lang) => {
  const entries = pageTranslations[currentPath];
  if (!entries) return;
  Object.entries(entries).forEach(([selector, textObj]) => {
    document.querySelectorAll(selector).forEach((el) => {
      const value = lang === "hi" ? textObj.hi : textObj.en;
      if (textObj.html) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
  });
};

const applyLanguage = (lang) => {
  const selected = lang === "hi" ? "hi" : "en";
  document.documentElement.lang = selected;
  document.querySelectorAll("[data-en][data-hi]").forEach((el) => {
    el.textContent = selected === "hi" ? el.getAttribute("data-hi") : el.getAttribute("data-en");
  });
  languageButtons.forEach((btn) => {
    const isActive = btn.dataset.lang === selected;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  applyPageTranslations(selected);
  try {
    localStorage.setItem("akela_lang", selected);
  } catch {
    // Ignore storage errors.
  }
};

const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem("akela_lang");
    return saved === "en" ? "en" : "hi";
  } catch {
    return "hi";
  }
};

if (languageButtons.length) {
  applyLanguage(getSavedLanguage());
  languageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang || "en");
    });
  });
}

revealEls.forEach((el, index) => {
  if (
    el.classList.contains("story-card") ||
    el.classList.contains("process-card") ||
    el.classList.contains("card") ||
    el.classList.contains("timeline-card") ||
    el.classList.contains("faq-card") ||
    el.classList.contains("presence-card") ||
    el.classList.contains("shop-card") ||
    el.classList.contains("gallery-demo-image") ||
    el.classList.contains("media-story-card")
  ) {
    el.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const heroVideo = document.querySelector(".hero-video");
const parallaxEls = Array.from(document.querySelectorAll(".story-card img, .media-story-card img, .presence-image, .gallery-demo-image, .shop-image, .card-image"));
let ticking = false;
let updateHeaderVisibility = () => {};

const runScrollFx = () => {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min((window.scrollY / maxScroll) * 100, 100);
  if (scrollProgressFill) {
    scrollProgressFill.style.width = `${progress}%`;
  }

  if (prefersReducedMotion) return;
  if (heroVideo) {
    const y = Math.min(window.scrollY, 380);
    const scale = 1.06 + y / 5000;
    heroVideo.style.transform = `translateY(${y * 0.08}px) scale(${scale})`;
  }

  parallaxEls.forEach((el, idx) => {
    const depth = ((idx % 3) + 1) * 0.7;
    const offset = Math.max(-10, Math.min(10, (window.scrollY * 0.015) * depth));
    el.style.setProperty("--parallax-y", `${offset}px`);
  });
};

window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      runScrollFx();
      updateHeaderVisibility();
      ticking = false;
    });
  }
});

runScrollFx();

const healingPoints = Array.from(document.querySelectorAll(".healing-point"));
if (healingPoints.length > 1 && !prefersReducedMotion) {
  let activeHealingIndex = healingPoints.findIndex((point) => point.classList.contains("is-active"));
  if (activeHealingIndex < 0) activeHealingIndex = 0;

  window.setInterval(() => {
    healingPoints[activeHealingIndex]?.classList.remove("is-active");
    activeHealingIndex = (activeHealingIndex + 1) % healingPoints.length;
    healingPoints[activeHealingIndex]?.classList.add("is-active");
  }, 3200);
}

const menuBtn = document.querySelector(".menu-toggle");
const nav = document.getElementById("navMenu");
const siteHeader = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
let headerHidden = false;

updateHeaderVisibility = () => {
  if (!siteHeader) return;

  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  const isMenuOpen = menuBtn?.getAttribute("aria-expanded") === "true";

  if (isMenuOpen || currentY < 80) {
    headerHidden = false;
    siteHeader.classList.remove("is-hidden");
    lastScrollY = currentY;
    return;
  }

  if (delta > 8 && !headerHidden) {
    headerHidden = true;
    siteHeader.classList.add("is-hidden");
  } else if (delta < -4 && headerHidden) {
    headerHidden = false;
    siteHeader.classList.remove("is-hidden");
  }

  lastScrollY = currentY;
};

const closeMobileNav = () => {
  menuBtn?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("open");
  navBackdrop?.classList.remove("open");
  headerHidden = false;
  siteHeader?.classList.remove("is-hidden");
};

document.querySelectorAll(".site-header .nav a").forEach((link) => {
  const rawHref = (link.getAttribute("href") || "").toLowerCase();
  if (!rawHref) return;
  if (rawHref.startsWith("#")) {
    if (currentPath === "index.html" && rawHref === currentHash.toLowerCase()) {
      link.setAttribute("aria-current", "page");
    }
    return;
  }
  const [hrefPath, hrefHash] = rawHref.split("#");
  if (hrefPath === currentPath && (!hrefHash || (`#${hrefHash}` === currentHash.toLowerCase()))) {
    link.setAttribute("aria-current", "page");
  }
});

menuBtn?.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  nav?.classList.toggle("open");
  navBackdrop?.classList.toggle("open", !expanded);
  if (!expanded) {
    headerHidden = false;
    siteHeader?.classList.remove("is-hidden");
  }
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav();
  });
});

navBackdrop?.addEventListener("click", closeMobileNav);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

document.addEventListener("click", (event) => {
  if (!nav || !menuBtn) return;
  const isClickInside = nav.contains(event.target) || menuBtn.contains(event.target);
  if (!isClickInside) {
    closeMobileNav();
  }
});

updateHeaderVisibility();

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const rateDate = document.getElementById("rateDate");
const ratesSection = document.getElementById("rates");
const ratesGridEl = document.getElementById("ratesGrid");
const rateFilterButtons = Array.from(document.querySelectorAll(".rate-tab"));

const formatDateForDisplay = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear());
  return `${day}-${month}-${year}`;
};

const setFallbackRateDate = () => {
  const today = new Date();
  rateDate.textContent = formatDateForDisplay(today);
};

if (rateDate) {
  setFallbackRateDate();
}

const rateMap = [
  ["giridih", "chota", "rate-giridih-chota"],
  ["giridih", "mota", "rate-giridih-mota"],
  ["giridih", "chicks", "rate-giridih-chicks"],
  ["deoghar", "chota", "rate-deoghar-chota"],
  ["deoghar", "mota", "rate-deoghar-mota"],
  ["deoghar", "chicks", "rate-deoghar-chicks"],
  ["barhi", "chota", "rate-barhi-chota"],
  ["barhi", "mota", "rate-barhi-mota"],
  ["barhi", "chicks", "rate-barhi-chicks"],
  ["chatra", "chota", "rate-chatra-chota"],
  ["chatra", "mota", "rate-chatra-mota"],
  ["chatra", "chicks", "rate-chatra-chicks"],
  ["jamua", "chota", "rate-jamua-chota"],
  ["jamua", "mota", "rate-jamua-mota"],
  ["jamua", "chicks", "rate-jamua-chicks"]
];

const parseRateNumber = (text) => {
  const match = String(text || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const applyRatesToPage = (data) => {
  if (!data) return;

  if (rateDate && data.rate_board_date) {
    const parsedDate = new Date(data.rate_board_date);
    if (!Number.isNaN(parsedDate.getTime())) {
      rateDate.textContent = formatDateForDisplay(parsedDate);
    }
  }

  const animateRateValue = (el, finalText) => {
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = finalText;
      return;
    }
    const target = parseRateNumber(finalText);
    const unit = String(finalText).replace(/^.*?\d+/, "");
    const startValue = parseRateNumber(el.textContent);
    const duration = 600;
    const startAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(startValue + (target - startValue) * eased);
      el.textContent = `Rs ${value}${unit}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.remove("rate-pulse");
        void el.offsetWidth;
        el.classList.add("rate-pulse");
      }
    };

    requestAnimationFrame(tick);
  };

  rateMap.forEach(([office, type, elementId]) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const officeData = data?.offices?.[office];
    if (!officeData) return;
    const key = type === "chota"
      ? "chota_per_kg"
      : type === "mota"
        ? "mota_per_kg"
        : "chicks_per_piece";
    if (officeData[key]) {
      animateRateValue(el, officeData[key]);
    }
  });

};

const ratesApiUrl = window.AKELA_CONFIG?.ratesApiUrl || "";

const isValidRatesPayload = (data) => {
  if (!data || typeof data !== "object") return false;
  if (!data.offices || typeof data.offices !== "object") return false;
  return ["giridih", "deoghar", "barhi", "chatra", "jamua"]
    .every((office) => typeof data.offices[office] === "object");
};

const fetchJsonWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

const loadRates = async () => {
  ratesSection?.classList.add("is-loading");
  if (ratesApiUrl) {
    try {
      const apiResponse = await fetchJsonWithTimeout(`${ratesApiUrl}?t=${Date.now()}`);
      const apiData = apiResponse?.data || apiResponse;
      if (isValidRatesPayload(apiData)) {
        applyRatesToPage(apiData);
        ratesSection?.classList.remove("is-loading");
        return;
      }
    } catch {
      // Continue to local JSON fallback when API is unavailable.
    }
  }

  try {
    const jsonData = await fetchJsonWithTimeout("rates.json");
    if (isValidRatesPayload(jsonData)) {
      applyRatesToPage(jsonData);
    }
  } catch {
    // Keep hardcoded fallback values when remote and local JSON cannot be loaded.
  } finally {
    ratesSection?.classList.remove("is-loading");
  }
};

loadRates();

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("call_click", {
      page: currentPath,
      label: (link.textContent || "").trim() || "call"
    });
  });
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("whatsapp_click", {
      page: currentPath,
      label: (link.textContent || "").trim() || "whatsapp"
    });
  });
});

document.querySelectorAll('a[href*="maps.google"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("map_click", {
      page: currentPath,
      label: (link.textContent || "").trim() || "map"
    });
  });
});

document.querySelectorAll('a[href="#rates"], a[href="index.html#rates"], a[href$="#rates"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("rates_tab_click", {
      page: currentPath,
      label: (link.textContent || "").trim() || "rates"
    });
  });
});

if (rateFilterButtons.length) {
  rateFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      trackEvent("rates_tab_click", {
        page: currentPath,
        label: btn.dataset.rateFilter || "all"
      });
      const filter = btn.dataset.rateFilter || "all";
      rateFilterButtons.forEach((item) => {
        const isActive = item === btn;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      document.querySelectorAll(".rate-line").forEach((line) => {
        const type = line.getAttribute("data-rate-type");
        const visible = filter === "all" || filter === type;
        line.classList.toggle("is-hidden", !visible);
      });
    });
  });
}

const metricValues = Array.from(document.querySelectorAll(".metric-value"));
const animateCounter = (el) => {
  const raw = (el.textContent || "").trim();
  const digits = raw.match(/\d+/);
  if (!digits) return;
  const target = Number(digits[0]);
  const suffix = raw.replace(/\d+/g, "");
  const duration = 1100;
  const startAt = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (metricValues.length && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  metricValues.forEach((metric) => counterObserver.observe(metric));
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", () => {
    formNote.textContent = "Submitting your enquiry...";
  });
}

const productsToggle = document.getElementById("productsToggle");
const productsCards = document.getElementById("productsCards");

if (productsToggle && productsCards) {
  productsToggle.addEventListener("click", () => {
    const expanded = productsCards.classList.toggle("expanded");
    productsToggle.setAttribute("aria-expanded", String(expanded));
    productsToggle.textContent = expanded ? "View Less" : "View More";
  });
}

const contactSwitchBtns = Array.from(document.querySelectorAll(".contact-switch-btn"));
const contactPanels = Array.from(document.querySelectorAll(".contact-panel"));

if (contactSwitchBtns.length && contactPanels.length) {
  const activateContactPanel = (targetKey) => {
    contactSwitchBtns.forEach((btn) => {
      const active = btn.dataset.contactTab === targetKey;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    contactPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.contactPanel === targetKey);
    });
  };

  contactSwitchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateContactPanel(btn.dataset.contactTab || "info");
    });
  });
}
