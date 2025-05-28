document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  const messageBox = document.getElementById("message");
  const productList = document.getElementById("product-list");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "";

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageUrl = document.getElementById("image-url").value.trim();
    const price = document.getElementById("price").value.trim();
    const brand = document.getElementById("brand").value.trim();

    if (!name || !description || !imageUrl || !price || !brand) {
      messageBox.textContent = "All fields are required.";
      messageBox.classList.add("error");
      return;
    }

    // Create product card
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${imageUrl}" alt="${name}" />
      <h3>${name}</h3>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Price:</strong> $${parseFloat(price).toFixed(2)}</p>
      <p><strong>Brand:</strong> ${brand}</p>
    `;

    productList.appendChild(card);

    // Clear form
    form.reset();

    messageBox.textContent = "Product added successfully!";
    messageBox.classList.add("success");
  });
});
