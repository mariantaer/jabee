const form = document.getElementById('franchiseForm');
const popup = document.getElementById('confirmation-popup');
const popupMessage = document.getElementById('confirmation-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    full_name: form.full_name.value.trim(),
    email: form.email.value.trim(),
    phone_number: form.phone_number.value.trim(),
    preferred_location: form.preferred_location.value.trim(),
    interest: form.interest.value.trim()
  };

  if (!data.full_name || !data.email || !data.phone_number || !data.preferred_location || !data.interest) {
    popupMessage.textContent = "Please fill out all fields.";
    popup.classList.remove('success');
    popup.classList.add('error');
    popup.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      popupMessage.textContent = `Thank you, ${data.full_name}! Your application was received. We’ll contact you soon.`;
      popup.classList.remove('error');
      popup.classList.add('success');
    } else {
      popupMessage.textContent = result.message || "There was a problem submitting your application.";
      popup.classList.remove('success');
      popup.classList.add('error');
    }
  } catch (err) {
    console.error(err);
    popupMessage.textContent = "Something went wrong. Please try again later.";
    popup.classList.remove('success');
    popup.classList.add('error');
  }

  popup.classList.remove('hidden');

  setTimeout(() => {
    popup.classList.add('hidden');
    form.reset();
  }, 6000);
});
