const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const toast = document.getElementById("toast");
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// The roadmap links currently guide users to the preparation section.
// Later, these can be connected to individual career detail pages.
document.querySelectorAll("[data-career]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const career = link.dataset.career;
    showToast(`${career} roadmap page is the next feature to build.`);
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  });
});

// Highlight the current navigation section as the user scrolls.
const sections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => observer.observe(section));
}
