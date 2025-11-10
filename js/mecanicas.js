// Este archivo contiene la funcionalidad JavaScript para la aplicación, incluyendo 
// manejadores de eventos, gestión de modales y administración del carrito.

const btnToggle = document.getElementById('toggleTheme');
const body = document.body;

btnToggle.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'light') {
    body.setAttribute('data-theme', 'dark');
    btnToggle.textContent = '☀️';
  } else {
    body.setAttribute('data-theme', 'light');
    btnToggle.textContent = '🌙';
  }
});

const $ = s => document.querySelector(s);
const products = [
  { id: "p1", title: "Blusa campesina - Algodón", price: 75000, img: "imagenes/campesino.png", desc: "Blusa fresca de algodón 100%, con bordados artesanales inspirados en la cultura andina.", reviews: [] },
  { id: "p2", title: "Camisa lino stretch", price: 120000, img: "imagenes/lino.png", desc: "Camisa ligera de lino con elasticidad, ideal para climas cálidos. Corte moderno y elegante.", reviews: [] },
  { id: "p3", title: "Vestido verano", price: 95000, img: "imagenes/vestido.png", desc: "Vestido ligero y vaporoso con estampados florales, perfecto para ocasiones casuales o de playa.", reviews: [] },
  { id: "p4", title: "Chaqueta cuero legítimo", price: 320000, img: "imagenes/cuero.png", desc: "Chaqueta clásica de cuero legítimo, resistente y elegante, ideal para un look urbano premium.", reviews: [] },
  { id: "p5", title: "Bolso artesanal en fique", price: 85000, img: "imagenes/bolso.png", desc: "Bolso tejido en fique natural con detalles en cuero, elaborado por artesanos bogotanos.", reviews: [] }
];

const state = {
  cart: {},
  user: { name: "Ana" },
  comments: [
    { user: "Carlos", text: "Excelente página, muy fácil de usar" },
    { user: "Luisa", text: "Los productos son de muy buena calidad" },
    { user: "Andrés", text: "Me encantó la chaqueta de cuero" }
  ],
  current: null
};

function renderReviews() {
  const wrap = $("#reviewsList");
  wrap.innerHTML = "";
  if (state.current.reviews.length === 0) wrap.textContent = "No hay reseñas aún";
  state.current.reviews.forEach(r => {
    const d = document.createElement("div");
    d.className = "review";
    d.textContent = `${r.user}: ${r.text}`;
    wrap.appendChild(d);
  });
}

function submitReview() {
  if (!state.user) { alert("Debes iniciar sesión"); return; }
  const text = $("#reviewText").value.trim();
  if (!text) return;
  state.current.reviews.push({ user: state.user.name, text });
  $("#reviewText").value = "";
  renderReviews();
}

function openProduct(id) {
  const p = products.find(x => x.id === id) || products[0];
  state.current = p;
  $("#modalTitle").textContent = p.title;
  $("#modalImg").src = p.img;
  $("#modalDesc").textContent = p.desc;
  $("#modalPrice").textContent = "$" + p.price + " COP";
  renderReviews();
  $("#addToCart").onclick = () => addToCart(p.id);
  openModal("#productModal");
}

function addToCart(id) {
  const color = $("#modalColor").value;
  const size = $("#modalSize").value;
  if (!state.cart[id]) state.cart[id] = { ...products.find(x => x.id === id), qty: 1, color, size };
  else state.cart[id].qty++;
  renderCart();
  closeModal("#productModal");
}

function renderCart() {
  const wrap = $("#cartItems");
  wrap.innerHTML = "";
  let total = 0, count = 0;
  Object.values(state.cart).forEach(it => {
    total += it.price * it.qty;
    count += it.qty;
    wrap.innerHTML += `<div>${it.title} (${it.color},${it.size}) x${it.qty} = $${it.price * it.qty}</div>`;
  });
  $("#cartTotal").textContent = total;
  $("#cartCount").textContent = count;
}

function submitComment() {
  if (!state.user) { alert("Debes iniciar sesión"); return; }
  const t = $("#commentText").value.trim();
  if (!t) return;
  state.comments.push({ user: state.user.name, text: t });
  $("#commentText").value = "";
  renderComments();
}

function renderComments() {
  const wrap = $("#commentsList");
  wrap.innerHTML = "";
  state.comments.forEach(c => {
    const d = document.createElement("div");
    d.className = "comment-card";
    d.innerHTML = `<div><b>${c.user}</b></div><div>${c.text}</div>`;
    wrap.appendChild(d);
  });
}

function login() {
  const name = $("#loginName").value;
  const pass = $("#loginPass").value;
  if (!name || !pass) { alert("Completa los campos"); return; }
  state.user = { name };
  $("#loginBtn").textContent = "👤 " + name;
  closeModal("#loginModal");
}

function openModal(s) { $(s).classList.add("show"); }
function closeModal(s) { $(s).classList.remove("show"); }

document.addEventListener("DOMContentLoaded", () => {
  $("#loginBtn").onclick = () => openModal("#loginModal");
  $("#loginSubmit").onclick = login;
  $("#submitReview").onclick = submitReview;
  $("#submitComment").onclick = submitComment;
  renderComments(); // mostrar comentarios iniciales
});