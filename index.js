// const form = document.getElementById("product-form");
// const messageBox = document.getElementById("message");
// const productList = document.getElementById("product-list");

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   messageBox.textContent = "";
//   messageBox.className = "";

//   const name = document.getElementById("name").value.trim();
//   const description = document.getElementById("description").value.trim();
//   const imageUrl = document.getElementById("image-url").value.trim();
//   const price = document.getElementById("price").value.trim();
//   const brand = document.getElementById("brand").value.trim();

//   if (!name || !description || !imageUrl || !price || !brand) {
//     messageBox.textContent = "All fields are required.";
//     messageBox.classList.add("error");
//     return;
//   }

// Create product card
// const card = document.createElement("div");
// card.className = "product-card";

// card.innerHTML = `
//   <img src="${imageUrl}" alt="${name}" />
//   <h3>${name}</h3>
//   <p><strong>Description:</strong> ${description}</p>
//   <p><strong>Price:</strong> $${parseFloat(price).toFixed(2)}</p>
//   <p><strong>Brand:</strong> ${brand}</p>
// `;

// productList.appendChild(card);

// Clear form
//   form.reset();

//   messageBox.textContent = "Product added successfully!";
//   messageBox.classList.add("success");
// });

const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const messageBox = document.getElementById("message");
const resetAllBtn = document.getElementById("reset-all");

const STORAGE_KEY = "products";

// Fetch products from API on page load
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    // Add brand property if missing
    const productsWithBrand = data.map((p) => ({
      title: p.title,
      description: p.description,
      image: p.image,
      price: p.price,
      brand: p.brand || "",
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithBrand));
    renderProducts(productsWithBrand);
  } catch (error) {
    showMessage("Failed to load products from API", "error");
    console.error("Fetch error:", error);
  }
}

// Render products in the product list
function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<p>No products available.</p>`;
    return;
  }

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p><strong>Brand:</strong> ${product.brand || "N/A"}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    productList.appendChild(card);
  });
}

// Load products from localStorage or fetch from API if none
function loadProducts() {
  const storedProducts = localStorage.getItem(STORAGE_KEY);
  if (storedProducts) {
    renderProducts(JSON.parse(storedProducts));
  } else {
    fetchProducts();
  }
}

// Show message (error or success)
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type === "error" ? "error" : "success";

  setTimeout(() => {
    messageBox.textContent = "";
    messageBox.className = "";
  }, 3000);
}

// Validate form inputs
function validateForm(data) {
  if (!data.title.trim()) return "Name is required.";
  if (!data.description.trim()) return "Description is required.";
  if (!data.image.trim()) return "Image URL is required.";
  if (!isValidURL(data.image.trim())) return "Image URL must be valid.";
  if (!data.price || isNaN(data.price) || data.price < 0)
    return "Price must be a non-negative number.";
  return null;
}

// URL validation helper
function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Handle form submit - add new product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    title: productForm.name.value.trim(),
    description: productForm.description.value.trim(),
    image: productForm["image-url"].value.trim(),
    price: parseFloat(productForm.price.value.trim()),
    brand: productForm.brand.value.trim(),
  };

  const error = validateForm(newProduct);
  if (error) {
    showMessage(error, "error");
    return;
  }

  // Append new product to localStorage
  let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  renderProducts(products);

  showMessage("Product added!", "success");

  productForm.reset();
});

// Handle delete button click
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = parseInt(e.target.dataset.index);
    let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (index >= 0 && index < products.length) {
      products.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      renderProducts(products);
      showMessage("Product deleted!", "success");
    }
  }
});

// Reset all products
resetAllBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  productList.innerHTML = "<p>No products available.</p>";
  showMessage("All products cleared.", "success");
});

// Initial load
loadProducts();
