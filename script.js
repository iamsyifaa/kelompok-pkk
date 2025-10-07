const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation(); // biar klik tombol nggak langsung nutup
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("active"); // kasih animasi rotasi icon
});

document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("show") &&
    !navMenu.contains(e.target) &&
    e.target !== hamburger
  ) {
    navMenu.classList.remove("show");
  }
});

// otomatis nutup kalau link diklik
document.querySelectorAll("#navMenu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// klik di luar menu → tutup
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("show") &&
    !navMenu.contains(e.target) &&
    e.target !== hamburger
  ) {
    navMenu.classList.remove("show");
  }
});

// ===== DATA MENU =====
const menuData = [
  {
    id: 1,
    name: "Sando",
    desc: "Roti lembut isi krim segar dan potongan buah manis yang segar dan nikmat di setiap gigitan.",
    price: 6000,
    rating: 5.0,
    img: "sando.jpeg",
  },
  {
    id: 2,
    name: "Es Kuwut Melon",
    desc: "Minuman dingin dengan Melon segar.",
    price: 5000,
    rating: 5.0,
    img: "es kuwut.jpg",
  },
];

const menuGrid = document.getElementById("menuGrid");

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function starHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 0; i < full; i++) s += "★";
  if (half) s += "½";
  return s + " (" + rating.toFixed(1) + ")";
}

menuData.forEach((item) => {
  const el = document.createElement("article");
  el.className = "menu-item";
  el.innerHTML = `
    <div class="menu-thumb">
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="icon-eye" data-id="${item.id}" title="Lihat detail">👁️</div>
    </div>
    <div class="menu-body">
      <div class="menu-title">${item.name}</div>
      <div class="rating">${starHTML(item.rating)}</div>
      <div class="price">${formatRupiah(item.price)}</div>
      <button class="buy-btn btn-primary" data-id="${
        item.id
      }">Beli Sekarang</button>
    </div>
  `;
  menuGrid.appendChild(el);
});

// ===== MODAL =====
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const waBtn = document.getElementById("waBtn");

function openModalFor(id, fromBuy = false) {
  const item = menuData.find((m) => m.id === Number(id));
  if (!item) return;

  modalTitle.textContent = item.name;
  modalSub.textContent = (fromBuy ? "Pesanan • " : "Detail • ") + item.name;
  modalDesc.textContent = item.desc;
  modalPrice.textContent = formatRupiah(item.price);

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  // Tampilkan/hidden bagian buy
  const buySection = document.getElementById("buySection");
  const qtyInput = document.getElementById("qtyInput");
  const modalTotal = document.getElementById("modalTotal");
  const buyerName = document.getElementById("buyerName");
  const buyerClass = document.getElementById("buyerClass");

  if (fromBuy) {
    buySection.style.display = "block";

    // reset field nama & kelas setiap buka modal
    buyerName.value = "";
    buyerClass.value = "";

    // reset jumlah = 1 setiap buka
    qtyInput.value = 1;
    modalTotal.textContent = formatRupiah(item.price);

    // update total kalau jumlah berubah
    qtyInput.oninput = () => {
      const qty = Math.max(1, parseInt(qtyInput.value) || 1);
      qtyInput.value = qty;
      modalTotal.textContent = formatRupiah(item.price * qty);
    };

    // tombol WA
    waBtn.onclick = () => {
      const buyerName = document.getElementById("buyerName").value.trim();
      const buyerClass = document.getElementById("buyerClass").value.trim();
      const pay = document.querySelector('input[name="pay"]:checked').value;
      const qty = parseInt(qtyInput.value) || 1;
      const total = item.price * qty;

      // Validasi wajib isi
      if (!buyerName || !buyerClass) {
        alert("Harap isi Nama dan Kelas terlebih dahulu!");
        return;
      }

      const message = `Nama: ${buyerName || "-"}
Kelas: ${buyerClass || "-"}
${item.name}
Jumlah: ${qty}
Harga satuan: ${formatRupiah(item.price)}
Total: ${formatRupiah(total)}
Metode pembayaran: ${pay}`;
      const waUrl = `https://wa.me/+6289510698297?text=${encodeURIComponent(
        message
      )}`;
      window.open(waUrl, "_blank");
    };
  } else {
    buySection.style.display = "none";
  }
}

function closeModal() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

// Delegation for eye icons and buy buttons
document.addEventListener("click", (e) => {
  const eye = e.target.closest(".icon-eye");
  if (eye) {
    openModalFor(eye.dataset.id, false); // mode lihat detail
  }

  const buy = e.target.closest(".buy-btn");
  if (buy) {
    openModalFor(buy.dataset.id, true); // mode beli
  }
});

// Close modal when clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Accessibility: ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Smooth scroll for nav links
document.querySelectorAll("nav a, .footer-links a").forEach((a) => {
  a.addEventListener("click", function (ev) {
    ev.preventDefault();
    const href = this.getAttribute("href");
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== TESTIMONI =====
let testimonies = JSON.parse(localStorage.getItem("testimonies") || "[]");
let currentIndex = 0;

const testiText = document.getElementById("testiText");
const testiName = document.getElementById("testiName");

// kasih class awal buat animasi
testiText.classList.add("fade", "show");
testiName.classList.add("fade", "show");

function showTesti(index) {
  // hapus dulu efek show (buat fade out)
  testiText.classList.remove("show");
  testiName.classList.remove("show");

  setTimeout(() => {
    if (testimonies.length === 0) {
      testiText.textContent = "Belum ada testimoni.";
      testiName.textContent = "";
    } else {
      const t = testimonies[index];
      testiText.textContent = t.message;
      testiName.textContent = t.name;
    }

    // kasih lagi efek show (buat fade in)
    testiText.classList.add("show");
    testiName.classList.add("show");
  }, 200);
}

function prevTesti() {
  if (testimonies.length === 0) return;
  currentIndex = (currentIndex - 1 + testimonies.length) % testimonies.length;
  showTesti(currentIndex);
}

function nextTesti() {
  if (testimonies.length === 0) return;
  currentIndex = (currentIndex + 1) % testimonies.length;
  showTesti(currentIndex);
}

function addTesti(e) {
  e.preventDefault();
  const name = document.getElementById("inputName").value.trim();
  const message = document.getElementById("inputMessage").value.trim();
  if (!name || !message) return;

  testimonies.push({ name, message });
  localStorage.setItem("testimonies", JSON.stringify(testimonies));
  document.getElementById("inputName").value = "";
  document.getElementById("inputMessage").value = "";
  currentIndex = testimonies.length - 1;
  showTesti(currentIndex);
}

// tampilkan pertama kali
showTesti(currentIndex);

// auto slide setiap 3 detik
setInterval(nextTesti, 3000);
