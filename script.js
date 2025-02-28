// Select the theme toggle button
const themeToggle = document.getElementById("theme-toggle");

// Check for saved user preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️"; // Change icon to sun
}

// Toggle dark mode on click
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save user preference in local storage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️"; // Sun for light mode
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙"; // Moon for dark mode
    }
});
