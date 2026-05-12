const API_BASE = 'http://localhost:5000/api';
let products = [];
let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) cart = JSON.parse(savedCart);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function fetchProducts() {
    try {
        const res = await fetch(API_BASE + '/products');
        products = await res.json();
    } catch {
        products = [];
    }
}

function addToCart(productId) {
    const product = products.find(p => p._id === productId || p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item._id === productId || item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, id: product._id || product.id });
    }
    saveCart();
    showToast('success', 'Added!', `${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => (item._id || item.id) != productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => (item._id || item.id) == productId);
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart();
        renderCart();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

async function renderProducts() {
    if (!products.length) await fetchProducts();
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;
    productsContainer.innerHTML = products.map(product => `
        <div class="product reveal-scale">
            <div class="product-image">
                <img src="https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(product.name)}" alt="${product.name}" />
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">&#9733; ${product.rating} / 5</div>
                <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
                <button class="btn" onclick='viewProductDetail("${product._id}")'>View Details</button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-state"><p>Your cart is empty</p></div>';
        if (cartSummary) {
            cartSummary.innerHTML = '<h3>Cart Summary</h3><div class="summary-row total">Total: $0.00</div>';
        }
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const itemId = item._id || item.id;
        return `
        <div class="cart-item">
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="btn" onclick="updateQuantity('${itemId}', ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" onchange="updateQuantity('${itemId}', this.value)" />
                <button class="btn" onclick="updateQuantity('${itemId}', ${item.quantity + 1})">+</button>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${itemId}')" style="margin-top: 8px;">Remove</button>
            </div>
        </div>`;
    }).join('');

    if (cartSummary) {
        const total = getCartTotal();
        const tax = (total * 0.1).toFixed(2);
        const shipping = cart.length > 0 ? 10 : 0;
        const grandTotal = (total + parseFloat(tax) + shipping).toFixed(2);
        cartSummary.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-row">Subtotal: $${total.toFixed(2)}</div>
            <div class="summary-row">Tax (10%): $${tax}</div>
            <div class="summary-row">Shipping: $${shipping.toFixed(2)}</div>
            <div class="summary-row total">Total: $${grandTotal}</div>
            <button class="btn btn-primary" onclick="checkout()" style="margin-top: 20px;">Proceed to Checkout</button>
        `;
    }
}

function viewProductDetail(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'product-detail.html';
}

function checkout() {
    if (cart.length === 0) {
        showToast('warning', 'Empty Cart', 'Add some items first!');
        return;
    }
    window.location.href = 'checkout.html';
}

async function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
    };
    if (data.password !== data.confirmPassword) {
        showToast('error', 'Error', 'Passwords do not match!');
        return;
    }
    try {
        const res = await fetch(API_BASE + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
        });
        const result = await res.json();
        if (!res.ok) { showToast('error', 'Error', result.msg || 'Registration failed'); return; }
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        showToast('success', 'Welcome!', 'Account created successfully!');
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
    } catch {
        showToast('error', 'Error', 'Server not running');
    }
}

async function handleSignin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const res = await fetch(API_BASE + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await res.json();
        if (!res.ok) { showToast('error', 'Error', result.msg || 'Invalid credentials'); return; }
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        showToast('success', 'Welcome back!', 'Signed in successfully!');
        if (result.user.isAdmin) {
            setTimeout(() => { window.location.href = 'admin.html'; }, 600);
        } else {
            setTimeout(() => { window.location.href = 'account.html'; }, 600);
        }
    } catch {
        showToast('error', 'Error', 'Server not running');
    }
}

async function handleContact(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };
    try {
        const res = await fetch(API_BASE + '/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showToast('success', 'Sent!', 'We will get back to you soon.');
            event.target.reset();
        } else {
            showToast('error', 'Error', 'Failed to send message');
        }
    } catch {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push({ ...data, date: new Date().toLocaleString() });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        showToast('success', 'Sent!', 'We will get back to you soon.');
        event.target.reset();
    }
}

async function handleCheckout(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('warning', 'Sign In Required', 'Please sign in to place an order');
        setTimeout(() => { window.location.href = 'signin.html'; }, 800);
        return;
    }
    const formData = new FormData(event.target);
    const order = {
        items: cart.map(item => ({
            productId: item._id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: getCartTotal(),
        shippingAddress: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            country: formData.get('country'),
        },
    };
    try {
        const res = await fetch(API_BASE + '/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(order)
        });
        const result = await res.json();
        if (!res.ok) { showToast('error', 'Error', result.msg || 'Order failed'); return; }
        localStorage.removeItem('cart');
        showToast('success', 'Order Placed!', `Order ID: ${result._id.slice(-8).toUpperCase()}`);
        cart = [];
        setTimeout(() => { window.location.href = 'account.html'; }, 800);
    } catch {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const fallbackOrder = { id: 'ORD-' + Date.now(), date: new Date().toLocaleString(), items: cart, total: getCartTotal(), shippingAddress: order.shippingAddress };
        orders.push(fallbackOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.removeItem('cart');
        showToast('success', 'Order Placed!', `Order ID: ${fallbackOrder.id}`);
        cart = [];
        setTimeout(() => { window.location.href = 'account.html'; }, 800);
    }
}

/* ============================================
   CUSTOM TOAST NOTIFICATIONS
   ============================================ */
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
        success: { bg: 'linear-gradient(135deg, #10b981, #059669)', icon: '&#10003;' },
        error: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '&#10007;' },
        warning: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '&#9888;' },
        info: { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', icon: '&#8505;' },
    };

    const config = colors[type] || colors.info;
    const id = 'toast-' + Date.now();

    const toast = document.createElement('div');
    toast.id = id;
    toast.style.cssText = `
        display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px;
        border-radius: 14px; min-width: 280px; max-width: 380px;
        background: ${config.bg}; box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        color: white; font-size: 14px; transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: auto;
    `;
    toast.innerHTML = `
        <span style="font-size:18px;flex-shrink:0;line-height:1">${config.icon}</span>
        <div style="flex:1;min-width:0">
            <p style="margin:0;font-weight:600;font-size:14px">${title}</p>
            <p style="margin:4px 0 0;opacity:0.85;font-size:13px">${message}</p>
        </div>
        <button onclick="dismissToast('${id}')" style="background:none;border:none;color:white;cursor:pointer;opacity:0.7;padding:2px;font-size:16px;flex-shrink:0">&#10005;</button>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => dismissToast(id), 3500);
}

function dismissToast(id) {
    const toast = document.getElementById(id);
    if (!toast) return;
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
}

/* ============================================
   THEME MANAGEMENT
   ============================================ */
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isAdmin) {
        document.querySelectorAll('.admin-nav-item').forEach(el => el.style.display = '');
    }

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    loadCart();
    await fetchProducts();
    renderProducts();
    renderCart();
    initScrollReveal();
});
