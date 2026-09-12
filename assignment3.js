javascript
const form = document.getElementById("contactForm");

const phoneInput = document.getElementById("phone");

// Phone number input mask
phoneInput.addEventListener("input", function () {
    let numbers = this.value.replace(/\D/g, "");

    if (numbers.length > 10) {
        numbers = numbers.substring(0, 10);
    }

    if (numbers.length > 6) {
        this.value = "(" + numbers.substring(0, 3) + ") " +
                     numbers.substring(3, 6) + "-" +
                     numbers.substring(6);
    } else if (numbers.length > 3) {
        this.value = "(" + numbers.substring(0, 3) + ") " +
                     numbers.substring(3);
    } else if (numbers.length > 0) {
        this.value = "(" + numbers;
    } else {
        this.value = "";
    }
});


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const message = document.getElementById("message").value.trim();
    const security = document.getElementById("security").value.trim();


    // Check required fields
    if (
        !firstName || !lastName || !address || !city ||
        !state || !zip || !phone || !email ||
        !birthdate || !message || !security
    ) {
        alert("Please complete all fields.");
        return;
    }


    // Check names
    if (!/^[A-Za-z'-]+$/.test(firstName)) {
        alert("Please enter a valid first name.");
        return;
    }

    if (!/^[A-Za-z'-]+$/.test(lastName)) {
        alert("Please enter a valid last name.");
        return;
    }


    // Check ZIP code
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
        alert("Please enter a valid ZIP code.");
        return;
    }


    // Check phone number
    const phoneNumbers = phone.replace(/\D/g, "");

    if (phoneNumbers.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }


    // Check email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }


    // Check birth date
    const selectedDate = new Date(birthdate + "T00:00:00");
    const today = new Date();

    if (selectedDate > today) {
        alert("Birth date cannot be in the future.");
        return;
    }


    // Check security question
    if (security !== "8") {
        alert("The confirmation answer is incorrect.");
        return;
    }


    // Send information to confirmation page
    const params = new URLSearchParams();

    params.set("firstName", firstName);
    params.set("lastName", lastName);
    params.set("address", address);
    params.set("city", city);
    params.set("state", state);
    params.set("zip", zip);
    params.set("phone", phone);
    params.set("email", email);
    params.set("birthdate", birthdate);
    params.set("message", message);


    window.location.href = "confirmation.html?" + params.toString();
});
