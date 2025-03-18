document.addEventListener("DOMContentLoaded", function () {
    /* ====== ✅ Cache DOM Elements for Performance ====== */
    const DOM = {
        themeToggle: document.getElementById("theme-toggle"),
        nav: document.querySelector("nav"),
        sections: document.querySelectorAll(".section"),
        body: document.documentElement,
        hamburger: document.querySelector(".hamburger"),
        navLinks: document.querySelector(".nav-links"),
        projectSection: document.getElementById("projects"),
        backToProjects: document.getElementById("back-to-projects"),
        skillsSection: document.querySelector(".skills-section"),
        skills: document.querySelectorAll(".skill .progress"),
        aboutElements: document.querySelectorAll(".about-content"),
        projectLinks: document.querySelectorAll(".project-link"),
        contactForm: document.getElementById("contactForm"),
        formMessage: document.getElementById("formMessage"),
        descriptionText: document.getElementById("description-text"),
        seeMoreBtn: document.getElementById("see-more-btn"),
        /* ✅ Select Elements */
        seeMoreImg: document.getElementById("see-more-img"),
        modal: document.getElementById("image-modal"),
        modalImg: document.getElementById("modal-img"),
        modalDesc: document.getElementById("modal-description"),
        closeBtn: document.querySelector(".close"),
        prevBtn: document.getElementById("prev-btn"),
        nextBtn: document.getElementById("next-btn"),
    };

    /* ====== ✅ Expandable Description (See More) ====== */
    function checkOverflow() {
        if (DOM.descriptionText.scrollHeight > DOM.descriptionText.clientHeight) {
            DOM.seeMoreBtn.style.display = "inline-flex";
        } else {
            DOM.seeMoreBtn.style.display = "none";
        }
    }

    if (DOM.seeMoreBtn && DOM.descriptionText) {
        checkOverflow(); // Run on page load

        DOM.seeMoreBtn.addEventListener("click", () => {
            DOM.descriptionText.classList.toggle("expanded");
            DOM.seeMoreBtn.innerHTML = DOM.descriptionText.classList.contains("expanded")
                ? 'See Less <span class="arrow">⬆</span>'
                : 'See More <span class="arrow">⬇</span>';
        });
    }

    /* ====== ✅ Apply & Sync Dark Mode ====== */
    function applyTheme() {
        const isDarkMode = localStorage.getItem("dark-mode") === "enabled";
        DOM.body.classList.toggle("dark-mode", isDarkMode);
        if (DOM.themeToggle) {
            DOM.themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
        }
    }
    applyTheme();

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener("click", function () {
            const isDarkMode = !DOM.body.classList.contains("dark-mode");
            localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
            applyTheme();
            window.dispatchEvent(new StorageEvent("storage", { key: "dark-mode", newValue: isDarkMode ? "enabled" : "disabled" }));
        });
    }

    window.addEventListener("storage", (event) => {
        if (event.key === "dark-mode") applyTheme();
    });

    /* ====== ✅ Navbar Transparency on Scroll (Optimized) ====== */
    let lastScroll = 0;
    function handleNavScroll() {
        let now = Date.now();
        if (now - lastScroll > 50) { // Throttling
            DOM.nav.classList.toggle("scrolled", window.scrollY > 50);
            lastScroll = now;
        }
    }
    window.addEventListener("scroll", handleNavScroll, { passive: true });

    /* ====== ✅ Reveal Sections on Scroll (Optimized with rAF) ====== */
    let ticking = false;
    function revealSections() {
        if (!ticking) {
            requestAnimationFrame(() => {
                DOM.sections.forEach((section) => {
                    if (section.getBoundingClientRect().top < window.innerHeight * 0.8) {
                        section.classList.add("visible");
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener("scroll", revealSections, { passive: true });
    revealSections();

    /* ====== ✅ Intersection Observer for Animations (Prevent Memory Leaks) ====== */
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".animated").forEach((el) => observer.observe(el));

    /* ====== ✅ Preload Background Image ====== */
    const bgImage = new Image();
    bgImage.src = "assets/background.jpg";
    bgImage.onload = () => document.body.classList.add("loaded");

    /* ====== ✅ Reveal About Section on Scroll ====== */
    function revealAbout() {
        DOM.aboutElements.forEach((element) => {
            if (element.getBoundingClientRect().top < window.innerHeight - 50) {
                element.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", revealAbout, { passive: true });
    revealAbout();

    /* ====== ✅ Hamburger Menu Toggle ====== */
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener("click", () => {
            DOM.navLinks.classList.toggle("active");
            DOM.hamburger.classList.toggle("open");
        });

        DOM.navLinks.addEventListener("click", (event) => {
            if (event.target.tagName === "A") {
                DOM.navLinks.classList.remove("active");
                DOM.hamburger.classList.remove("open");
            }
        });
    }

    /* ✅ Animate Skills Section using Intersection Observer (Optimized) */
    if (DOM.skillsSection) {
        let skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    DOM.skillsSection.classList.add("visible");

                    DOM.skills.forEach((skill) => {
                        let progress = skill.getAttribute("data-progress");
                        skill.style.width = progress + "%"; 
                        observer.unobserve(skill);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillsObserver.observe(DOM.skillsSection);
    }

    /* ====== ✅ Save & Restore Scroll Position (Project Page) ====== */
    /*window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("scrollPosition", window.scrollY);
    });*/

    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem("scrollPosition");
    }

    /* ====== ✅ Restore Project Section View ====== */
    if (sessionStorage.getItem("fromProjectPage") === "true") {
        sessionStorage.removeItem("fromProjectPage");
        DOM.projectSection?.scrollIntoView({ behavior: "smooth" });
    }

    DOM.projectLinks.forEach((link) => {
        link.addEventListener("click", () => sessionStorage.setItem("fromProjectPage", "true"));
    });

    /* ====== ✅ Back to Projects Button = Browser Back ====== */
    if (DOM.backToProjects) {
        DOM.backToProjects.addEventListener("click", (event) => {
            event.preventDefault();
            document.referrer.includes(window.location.hostname)
                ? window.history.back()
                : (window.location.href = "index.html");
        });
    }

    /* ✅ Full Image List */
    const images = [
        { src: "assets/projects/flushy/flushy 1.png", desc: "Flushy - Live Scores App" },
        { src: "assets/projects/flushy/flushy 2.png", desc: "Background Design" },
        { src: "assets/projects/flushy/flushy 3.png", desc: "Sawaqni - eCommerce App" },
        { src: "assets/projects/flushy/flushy 4.jpg", desc: "Flushy 4" },
        { src: "assets/projects/flushy/flushy 5.jpg", desc: "Flushy 5" },
        { src: "assets/projects/flushy/flushy 6.jpg", desc: "Flushy 6" }
    ];

    let currentIndex = 0; // Track image index

    /* ✅ Show Image in Modal */
    function showImage() {
        DOM.modalImg.src = images[currentIndex].src;
        DOM.modalDesc.textContent = images[currentIndex].desc;
    
        // Update progress bar
        const progressWidth = ((currentIndex + 1) / images.length) * 100;
        document.querySelector(".progress-bar-gal").style.width = `${progressWidth}%`;
    }

    /* ✅ Open Modal and Show First Image */
    DOM.seeMoreImg.addEventListener("click", () => {
        currentIndex = 0;
        showImage();
        DOM.modal.style.display = "flex";
    });

    /* ✅ Next Image */
    DOM.nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length; // Loop back to first
        showImage();
    });

    /* ✅ Previous Image */
    DOM.prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Loop back to last
        showImage();
    });

    /* ✅ Close Modal */
    DOM.closeBtn.addEventListener("click", () => {
        DOM.modal.style.display = "none";
    });

    /* ✅ Close on Background Click */
    DOM.modal.addEventListener("click", (e) => {
        if (e.target === DOM.modal) {
            DOM.modal.style.display = "none";
        }
    });
});

/* ====== ✅ Ensure EmailJS is Loaded Before Initializing ====== */
window.onload = function () {
    if (emailjs) {
        emailjs.init("zPWbwl2xsCFqofTj1");
    } else {
        console.error("EmailJS failed to load.");
    }
};

/* ====== ✅ Email Form Submission Handling ====== */
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
    };

    emailjs.send("service_mailMG", "template_bmq58do", formData)
        .then(() => {
            DOM.formMessage.textContent = "✅ Email Sent Successfully!";
            DOM.formMessage.style.color = "green";
            setTimeout(() => DOM.formMessage.style.display = "none", 3000);
            DOM.contactForm.reset();
        })
        .catch(() => {
            DOM.formMessage.textContent = "❌ Failed to send email. Please try again.";
            DOM.formMessage.style.color = "red";
        });
});
