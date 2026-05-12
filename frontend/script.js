// Sample product data
const products = [
    { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop', rating: 4.5, image: 'laptop.jpg' },
    { id: 2, name: 'Smartphone', price: 599, description: 'Latest smartphone', rating: 4.8, image: 'phone.jpg' },
    { id: 3, name: 'Headphones', price: 199, description: 'Wireless headphones', rating: 4.3, image: 'headphones.jpg' },
    { id: 4, name: 'Tablet', price: 449, description: 'Portable tablet', rating: 4.6, image: 'tablet.jpg' },
    { id: 5, name: 'Smartwatch', price: 299, description: 'Smart wearable', rating: 4.2, image: 'watch.jpg' },
    { id: 6, name: 'Camera', price: 799, description: 'Professional camera', rating: 4.7, image: 'camera.jpg' },
];

// Cart management
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Update quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart();
        renderCart();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Render products
function renderProducts() {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;

    productsContainer.innerHTML = products.map(product => `
        <div class="product">
            <div class="product-image">
                <img src="placeholder-${product.id}.jpg" alt="${product.name}" />
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">⭐ ${product.rating} / 5</div>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn btn-secondary" onclick="viewProductDetail(${product.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

// Render cart
function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-state"><p>Your cart is empty</p></div>';
        if (cartSummary) {
            cartSummary.innerHTML = '<div class="summary-row total">Total: $0.00</div>';
        }
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="width: 30px;">-</button>
                <input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" />
                <button class="btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="width: 30px;">+</button>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0;">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    if (cartSummary) {
        const total = getCartTotal();
        const tax = (total * 0.1).toFixed(2);
        const shipping = cart.length > 0 ? 10 : 0;
        const grandTotal = (total + parseFloat(tax) + shipping).toFixed(2);

        cartSummary.innerHTML = `
            <div class="summary-row">Subtotal: $${total.toFixed(2)}</div>
            <div class="summary-row">Tax (10%): $${tax}</div>
            <div class="summary-row">Shipping: $${shipping.toFixed(2)}</div>
            <div class="summary-row total">Total: $${grandTotal}</div>
            <button class="btn" onclick="checkout()" style="margin-top: 20px;">Proceed to Checkout</button>
        `;
    }
}

// View product details
function viewProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'product-detail.html';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// Handle form submissions
function handleSignup(event) {
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
        alert('Passwords do not match!');
        return;
    }

    localStorage.setItem('user', JSON.stringify(data));
    alert('Account created successfully!');
    window.location.href = 'index.html';
}

function handleSignin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === email && user.password === password) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Signed in successfully!');
        window.location.href = 'account.html';
    } else {
        alert('Invalid email or password!');
    }
}

function handleContact(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const contact = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        date: new Date().toLocaleString(),
    };

    let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));

    alert('Thank you for contacting us! We will get back to you soon.');
    event.target.reset();
}

function handleCheckout(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString(),
        items: cart,
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
        cardNumber: formData.get('cardNumber'),
    };

    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');

    alert(`Order placed successfully! Order ID: ${order.id}`);
    cart = [];
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    renderCart();
});
