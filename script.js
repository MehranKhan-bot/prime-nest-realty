/* =================================
   PrimeNest Realty - script.js
================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------
       1. MOBILE MENU
    --------------------------------- */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    function setMenu(open) {
        navLinks.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.textContent = open ? "✕" : "☰";
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("active"));
        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        // Reset menu when returning to desktop screen size
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                setMenu(false);
            }
        });
    }


    /* ---------------------------------
       2. PROPERTY SEARCH AND FILTER
    --------------------------------- */

    const locationInput = document.getElementById("locationSearch");
    const typeSelect = document.getElementById("propertyType");
    const searchBtn = document.getElementById("searchBtn");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    const cards = document.querySelectorAll(".property-card");

    function filterProperties() {

        const query = locationInput.value.trim().toLowerCase();
        const type = typeSelect.value;

        let visible = 0;

        cards.forEach(function (card) {

            const cardLocation = card.dataset.location.toLowerCase();
            const cardType = card.dataset.type;

            const matchesLocation =
                query === "" || cardLocation.includes(query);

            const matchesType =
                type === "all" || cardType === type;

            const show = matchesLocation && matchesType;

            card.hidden = !show;

            if (show) {
                visible++;
            }

        });

        // Update results counter
        resultsCount.textContent =
            "Showing " + visible +
            (visible === 1 ? " property" : " properties");

        // Display message when no property matches
        noResults.style.display =
            visible === 0 ? "block" : "none";

    }

    if (locationInput && typeSelect && searchBtn && resultsCount && noResults) {

        // Search button
        searchBtn.addEventListener("click", filterProperties);

        // Live location search
        locationInput.addEventListener("input", filterProperties);

        // Property type filter
        typeSelect.addEventListener("change", filterProperties);

        // Search when pressing Enter
        locationInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                filterProperties();
            }

        });

        // Display all properties initially
        filterProperties();

    }


    /* ---------------------------------
       3. CONTACT FORM
    --------------------------------- */

    // Add your Formspree endpoint here when configured.
    // Leave empty for demo mode.

    const FORM_ENDPOINT = "";

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        const message = document.createElement("p");

        message.className = "form-message";
        message.setAttribute("role", "status");
        message.hidden = true;

        contactForm.appendChild(message);


        // Display form status message
        function showMessage(text, type) {

            message.textContent = text;
            message.className = "form-message " + type;
            message.hidden = false;

        }


        // Handle form submission
        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const body = document.getElementById("message").value.trim();


            // Validate required fields
            if (!name || !email || !subject || !body) {

                showMessage(
                    "Please fill in all fields.",
                    "error"
                );

                return;

            }


            // Validate email address
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            const submitBtn =
                contactForm.querySelector("button[type='submit']");

            submitBtn.disabled = true;


            try {

                if (FORM_ENDPOINT) {

                    // Send message to configured endpoint
                    const response = await fetch(FORM_ENDPOINT, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },

                        body: JSON.stringify({
                            name: name,
                            email: email,
                            subject: subject,
                            message: body
                        })

                    });


                    if (!response.ok) {
                        throw new Error("Request failed");
                    }


                    showMessage(
                        "Thank you, " + name + ". Your message has been sent.",
                        "success"
                    );

                    contactForm.reset();


                } else {

                    // Demo mode: No actual message is delivered
                    console.log("Demo mode - form data:", {
                        name: name,
                        email: email,
                        subject: subject,
                        message: body
                    });

                    showMessage(
                        "Demo mode: Your form is working, but message delivery is not configured yet.",
                        "success"
                    );

                }


            } catch (error) {

                showMessage(
                    "Something went wrong. Please try again later.",
                    "error"
                );

            } finally {

                // Re-enable submit button
                submitBtn.disabled = false;

            }

        });

    }

});