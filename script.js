document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");
    const messageDiv = document.getElementById("message") || document.createElement("div");
    
    if (!messageDiv.id) {
        messageDiv.id = "message";
        contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
    }
    
    // Google Script URL
    const scriptURL ="https://script.google.com/macros/s/AKfycbwYKck2rSDe_vA8I-cVQy6VC4N_ObuHCgadzR4kywNCuOznG8cwT5-CwAQb428ZiL8R/exec";
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        messageDiv.innerText = "Submitting...";
        
        // Collect form data
        const formData = new FormData(contactForm);
        const userData = {};
        
        // Convert FormData to URL search params
        const urlParams = new URLSearchParams();
        for (const pair of formData.entries()) {
            urlParams.append(pair[0], pair[1]);
            userData[pair[0]] = pair[1]; // Store for WhatsApp
            console.log(pair[0] + ": " + pair[1]); // Debug log
        }
        
        // Send data using fetch
        fetch(scriptURL, {
            method: 'POST',
            body: urlParams,
            mode: 'no-cors' // Important for cross-origin requests
        })
        .then(response => {
            messageDiv.innerText = "✅ Submitted Successfully!";
            contactForm.reset();
            
            // Send WhatsApp message
            const phoneNumber = "9037846438";
            let whatsappMessage = `Name: ${userData.name}\nEmail: ${userData.email}\nPhone: ${userData.phone}`;
            
            // Add subject and message if available
            if (userData.subject) whatsappMessage += `\nSubject: ${userData.subject}`;
            if (userData.message) whatsappMessage += `\nMessage: ${userData.message}`;
            
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappURL, "_blank");
        })
        .catch(error => {
            messageDiv.innerText = "⚠️ Error submitting form";
            console.error('Error:', error);
        });
    });
});