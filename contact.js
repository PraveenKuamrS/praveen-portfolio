// contact.js
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById('project-contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Details...';
        submitBtn.disabled = true;

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const appType = document.getElementById('contact-type').value;
        const budget = document.getElementById('contact-budget').value;
        const timeline = document.getElementById('contact-timeline').value;
        const details = document.getElementById('contact-details').value;

        try {
            // Because GitHub Pages cannot run Node servers, we use FormSubmit's free headless API!
            // First time you test this, you will receive an "Activate form" email in your inbox. Check it and click 'Activate'!
            const response = await fetch('https://formsubmit.co/ajax/praveenkumarvpgs13@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `[Portfolio Lead] New ${appType} Request`,
                    _replyto: email,  // Lets you hit "Reply" directly in your Gmail!
                    Name: name,
                    Email: email,
                    AppType: appType,
                    Budget: budget,
                    Timeline: timeline,
                    ProjectDetails: details
                })
            });

            const result = await response.json();

            // FormSubmit API natively returns string "true" / "false" in addition to explicit booleans
            if (result.success === "true" || result.success === true) {
                alert("Awesome! Your project details have been sent successfully. I will reach out to you within 24 hours!");
                contactForm.reset();
            } else if (result.message && result.message.includes("Activation")) {
                alert("Almost there! FormSubmit has sent an 'Activate Form' link to praveenkumarvpgs13@gmail.com. Please click that link in your email to activate the form, and then try sending this again!");
            } else {
                throw new Error(result.message || "Server failed to send email.");
            }
        } catch (error) {
            console.error(error);
            alert("Error sending message! Please email me directly at praveenkumarvpgs13@gmail.com.");
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
