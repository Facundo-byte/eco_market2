const STORAGE_KEYS = {
  users: "eco_market_users",
  currentUser: "eco_market_current_user",
  cart: "eco_market_cart",
};

const GOOGLE_CLIENT_ID = "";
const MERCADOPAGO_CHECKOUT_URL = "";

const products = [
  {
    id: 1,
    name: "Botella reutilizable de acero",
    price: 14999,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Cepillo de bambú",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1616627457270-41e7d43f9f66?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Bolsa compostable x30",
    price: 6999,
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Set de cubiertos reutilizables",
    price: 9999,
    image:
      "https://images.unsplash.com/photo-1606788075761-41e9a5f42cd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Shampoo sólido natural",
    price: 8499,
    image:
      "https://images.unsplash.com/photo-1607006483153-51e89f76df7d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Kit de limpieza ecológica",
    price: 17999,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
];

const authScreen = document.getElementById("auth-screen");
const appShell = document.getElementById("app-shell");
const authMessage = document.getElementById("auth-message");
const welcomeUser = document.getElementById("welcome-user");
const googleHelp = document.getElementById("google-help");
const productGrid = document.getElementById("product-grid");
const cartBadge = document.getElementById("cart-badge");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function parseStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#b74a4a" : "#147044";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCurrentUser() {
  return parseStorage(STORAGE_KEYS.currentUser, null);
}

function setCurrentUser(user) {
  saveStorage(STORAGE_KEYS.currentUser, user);
}

function getUsers() {
  return parseStorage(STORAGE_KEYS.users, {});
}

function getCart() {
  return parseStorage(STORAGE_KEYS.cart, []);
}

function setCart(cart) {
  saveStorage(STORAGE_KEYS.cart, cart);
  updateCartBadge();
}

function updateCartBadge() {
  const totalItems = getCart().reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = String(totalItems);
}

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <h4>${product.name}</h4>
      <p class="muted">Producto sustentable certificado.</p>
      <div class="product-footer">
        <strong>${formatCurrency(product.price)}</strong>
        <button class="primary-btn" data-add-id="${product.id}">Agregar</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const cart = getCart();
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  setCart(cart);
  renderCart();
}

function updateItemQty(productId, delta) {
  const cart = getCart()
    .map((item) =>
      item.id === productId ? { ...item, qty: Math.max(0, item.qty + delta) } : item,
    )
    .filter((item) => item.qty > 0);

  setCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="muted">Tu carrito está vacío. Agregá productos desde la sección Comprar.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("article");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h4>${item.name}</h4>
        <p class="muted">${formatCurrency(item.price)} c/u</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" data-qty-id="${item.id}" data-delta="-1">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-qty-id="${item.id}" data-delta="1">+</button>
      </div>
      <button class="remove-btn" data-remove-id="${item.id}">Eliminar</button>
    `;
    cartItemsContainer.appendChild(row);
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  cartTotal.textContent = formatCurrency(total);
}

function switchView(sectionId) {
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === sectionId);
  });

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === sectionId);
  });
}

function showAppForUser(user) {
  authScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  welcomeUser.textContent = `Hola, ${user.name}`;
  renderProducts();
  renderCart();
  updateCartBadge();
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
  showAuthMessage("Sesión cerrada correctamente.");
}

function initGoogleLogin() {
  const container = document.getElementById("google-login-container");
  if (!GOOGLE_CLIENT_ID.trim()) {
    googleHelp.classList.remove("hidden");
    container.innerHTML =
      '<button class="ghost-btn" type="button" disabled>Google Sign-In no configurado</button>';
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredentialResponse,
  });

  window.google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    width: 300,
    text: "continue_with",
  });
}

function parseJwtCredential(token) {
  const payload = token.split(".")[1];
  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decoded);
}

function handleGoogleCredentialResponse(response) {
  const profile = parseJwtCredential(response.credential);
  const user = {
    name: profile.name || "Usuario Google",
    email: profile.email,
  };

  setCurrentUser(user);
  showAppForUser(user);
}

window.handleGoogleCredentialResponse = handleGoogleCredentialResponse;

document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    const isLogin = btn.dataset.authTab === "login";
    document.getElementById("login-form").classList.toggle("active", isLogin);
    document.getElementById("register-form").classList.toggle("active", !isLogin);
    showAuthMessage("");
  });
});

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim().toLowerCase();
  const password = document.getElementById("register-password").value;

  const users = getUsers();
  if (users[email]) {
    showAuthMessage("Ya existe una cuenta con ese email.", true);
    return;
  }

  users[email] = { name, password };
  saveStorage(STORAGE_KEYS.users, users);
  showAuthMessage("Cuenta creada correctamente. Ya podés iniciar sesión.");
  event.target.reset();
});

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  const users = getUsers();
  const account = users[email];

  if (!account || account.password !== password) {
    showAuthMessage("Credenciales incorrectas.", true);
    return;
  }

  const user = { name: account.name, email };
  setCurrentUser(user);
  showAppForUser(user);
});

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchView(btn.dataset.section);
  });
});

document.getElementById("logout-btn").addEventListener("click", logout);

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("contact-message").textContent =
    "¡Gracias por tu mensaje! El equipo de eco_market te contactará dentro de las próximas 24 hs.";
  event.target.reset();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = getCart();
  if (!cart.length) {
    alert("Tu carrito está vacío. Agregá productos antes de pagar.");
    return;
  }

  if (!MERCADOPAGO_CHECKOUT_URL.trim()) {
    alert(
      "Falta configurar Mercado Pago. Cargá tu URL de checkout en app.js para habilitar pagos reales.",
    );
    return;
  }

  window.open(MERCADOPAGO_CHECKOUT_URL, "_blank", "noopener,noreferrer");
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-id]");
  if (addButton) {
    addToCart(Number(addButton.dataset.addId));
    return;
  }

  const qtyButton = event.target.closest("[data-qty-id]");
  if (qtyButton) {
    updateItemQty(Number(qtyButton.dataset.qtyId), Number(qtyButton.dataset.delta));
    return;
  }

  const removeButton = event.target.closest("[data-remove-id]");
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.removeId));
  }
});

(function initApp() {
  initGoogleLogin();
  const user = getCurrentUser();
  if (user) {
    showAppForUser(user);
  }
})();
