const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);


const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");

  // Menyimpan status tema terkini ke localStorage
  const temaSekarang = document.body.classList.contains("dark-mode")
    ? "dark" : "light";
  localStorage.setItem("tema", temaSekarang);
}

// Memuat kembali preferensi tema saat halaman dibuka
function muatPreferensiTema() {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") {
    document.body.classList.add("dark-mode");
  }
}

muatPreferensiTema();

tombolTema.addEventListener("click", toggleTema);


const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
  kotakAside.classList.toggle("tersembunyi");

  // Menyimpan status tampil/sembunyi aside ke localStorage
  localStorage.setItem("asideTersembunyi",
    kotakAside.classList.contains("tersembunyi"));
});

// Memuat kembali status tampil/sembunyi aside saat halaman dibuka
function muatPreferensiAside() {
  if (localStorage.getItem("asideTersembunyi") === "true") {
    kotakAside.classList.add("tersembunyi");
  }
}

muatPreferensiAside();


const daftarPortofolio = [
  { judul: "Ketua Desain Komsos", tanggal: "02-05-2022",
    isi: "Koordinator divisi desain komsos paroki" },
  { judul: "Praktik Kerja Lapangan di sekolah", tanggal: "01-08-2024",
    isi: "Memiliki pengalaman kerja di sebuah sekolah bagian desain" },
];

const containerPortofolio = document.querySelector(".daftar-portofolio");

// Memuat daftar portofolio dari localStorage, memakai data awal jika belum pernah disimpan
let dataPortofolio = JSON.parse(localStorage.getItem("portofolio")) || daftarPortofolio;

// Menyimpan seluruh daftar portofolio ke localStorage sebagai JSON
function simpanPortofolio() {
  localStorage.setItem("portofolio", JSON.stringify(dataPortofolio));
}

function tampilkanPortofolio(data) {
  const article = document.createElement("article");

  const judul = document.createElement("h3");
  judul.textContent = data.judul;

  const waktu = document.createElement("time");
  waktu.textContent = data.tanggal;

  const isi = document.createElement("p");
  isi.textContent = data.isi;

  const tombolLike = document.createElement("button");
  // Memuat kembali jumlah like dari localStorage berdasarkan judul artikel
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  let jumlahLike = semuaLike[data.judul] || 0;
  tombolLike.dataset.like = jumlahLike;
  tombolLike.textContent = `Like (${jumlahLike})`;
  tombolLike.classList.add("tombol-like");

  const tombolHapus = document.createElement("button");
  tombolHapus.textContent = "Hapus";
  tombolHapus.classList.add("tombol-hapus");

  article.appendChild(judul);
  article.appendChild(waktu);
  article.appendChild(isi);
  article.appendChild(tombolLike);
  article.appendChild(tombolHapus);
  containerPortofolio.appendChild(article);
}

dataPortofolio.forEach((data) => {
  tampilkanPortofolio(data);
});


const tombolTambah = document.querySelector("#btn-tambah");

tombolTambah.addEventListener("click", () => {
  const judulBaru = prompt("Masukkan judul portofolio:");

  if (judulBaru === null || judulBaru === "") {
    return;
  }

  const isiBaru = prompt("Masukkan deskripsi singkat:");
  const hariIni = new Date().toISOString().slice(0, 10);

  const dataBaru = {
    judul: judulBaru,
    tanggal: hariIni,
    isi: isiBaru || "Tidak ada deskripsi.",
  };

  tampilkanPortofolio(dataBaru);

  // Menyimpan portofolio baru ke localStorage
  dataPortofolio.push(dataBaru);
  simpanPortofolio();
});


containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-hapus")) {
    const article = e.target.closest("article");
    const index = Array.from(containerPortofolio.children).indexOf(article);

    // Menghapus portofolio dari localStorage berdasarkan urutannya
    dataPortofolio.splice(index, 1);
    simpanPortofolio();

    article.remove();
  }
});


containerPortofolio.addEventListener("mouseover", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.add("artikel-hover");
});

containerPortofolio.addEventListener("mouseout", (e) => {
  const article = e.target.closest("article");
  if (article) article.classList.remove("artikel-hover");
});


// Menyimpan jumlah like semua artikel dalam satu objek JSON
function simpanLike(judulArtikel, jumlah) {
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  semuaLike[judulArtikel] = jumlah;
  localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-like")) {
    let jumlah = parseInt(e.target.dataset.like || 0);
    jumlah++;
    e.target.dataset.like = jumlah;
    e.target.textContent = `Like (${jumlah})`;

    // Menyimpan jumlah like dengan judul artikel sebagai kunci
    const judul = e.target.closest("article").querySelector("h3").textContent;
    simpanLike(judul, jumlah);
  }
});


const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanError = document.querySelector("#pesan-error");

formKomentar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.querySelector("#input-nama").value.trim();
  const pesan = document.querySelector("#input-pesan").value.trim();

  if (nama === "" || pesan === "") {
    pesanError.textContent = "Nama dan komentar wajib diisi!";
    return;
  }

  if (pesan.length < 5) {
    pesanError.textContent = "Komentar minimal 5 karakter!";
    return;
  }

  pesanError.textContent = "";

  tampilkanKomentar(nama, pesan);
  simpanKomentar(nama, pesan);

  formKomentar.reset(); 

  // Draft form tidak diperlukan lagi setelah komentar terkirim
  sessionStorage.removeItem("draftKomentar");
});


// Menampilkan satu komentar ke dalam daftar komentar
function tampilkanKomentar(nama, pesan) {
  const itemKomentar = document.createElement("li");

  const teksKomentar = document.createElement("span");
  teksKomentar.textContent = `${nama}: ${pesan}`;

  const tombolHapusKomentar = document.createElement("button");
  tombolHapusKomentar.textContent = "Hapus";
  tombolHapusKomentar.classList.add("tombol-hapus-komentar");

  itemKomentar.appendChild(teksKomentar);
  itemKomentar.appendChild(tombolHapusKomentar);
  daftarKomentar.appendChild(itemKomentar);
}

// Menyimpan komentar baru ke array di localStorage
function simpanKomentar(nama, pesan) {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.push({ nama, pesan });
  localStorage.setItem("komentar", JSON.stringify(daftar));
}

// Memuat dan merender seluruh komentar tersimpan saat halaman dibuka
function muatKomentar() {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.forEach((k) => {
    tampilkanKomentar(k.nama, k.pesan);
  });
}

muatKomentar();

// Menghapus satu komentar dari localStorage berdasarkan urutannya
function hapusKomentarTersimpan(index) {
  const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
  daftar.splice(index, 1);
  localStorage.setItem("komentar", JSON.stringify(daftar));
}


daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-hapus-komentar")) {
    const itemKomentar = e.target.closest("li");
    const index = Array.from(daftarKomentar.children).indexOf(itemKomentar);

    hapusKomentarTersimpan(index);
    itemKomentar.remove();
  }
});


const tombolHapusSemua = document.querySelector("#btn-hapus-semua");

tombolHapusSemua.addEventListener("click", () => {
  daftarKomentar.innerHTML = "";
  localStorage.removeItem("komentar");
});


document.addEventListener("keydown", (e) => {
  // Abaikan jika pengguna sedang mengetik di form
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    return;
  }

  if (e.key.toLowerCase() === "d") {
    toggleTema();
  }
});

const tombolAtas = document.querySelector("#btn-atas");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    tombolAtas.classList.remove("tersembunyi");
  } else {
    tombolAtas.classList.add("tersembunyi");
  }
});

tombolAtas.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// Menyimpan sementara isi form yang sedang diketik ke sessionStorage
formKomentar.addEventListener("input", () => {
  const draft = {
    nama: document.querySelector("#input-nama").value,
    pesan: document.querySelector("#input-pesan").value,
  };
  sessionStorage.setItem("draftKomentar", JSON.stringify(draft));
});

// Memuat kembali draft form saat halaman dimuat ulang
function muatDraftKomentar() {
  const draft = JSON.parse(sessionStorage.getItem("draftKomentar"));
  if (draft) {
    document.querySelector("#input-nama").value = draft.nama;
    document.querySelector("#input-pesan").value = draft.pesan;
  }
}

muatDraftKomentar();


// Menghapus seluruh data tersimpan dengan tombol Reset
const tombolReset = document.querySelector("#btn-reset");

tombolReset.addEventListener("click", () => {
  const konfirmasi = confirm(
    "Hapus semua data tersimpan (tema, like, komentar, portofolio)?");
  if (konfirmasi) {
    localStorage.clear();
    sessionStorage.clear();
    location.reload(); // tampilan kembali ke kondisi awal
  }
});
