const judulSitus = document.querySelector("header h1");
console.log(judulSitus);
console.log(judulSitus.textContent);


const tombolTema = document.querySelector("#btn-tema");

function toggleTema() {
  document.body.classList.toggle("dark-mode");
}

tombolTema.addEventListener("click", toggleTema);


const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");

tombolInfo.addEventListener("click", () => {
  kotakAside.classList.toggle("tersembunyi");
});


const daftarPortofolio = [
  { judul: "Ketua Desain Komsos", tanggal: "02-05-2022",
    isi: "Koordinator divisi desain komsos paroki" },
  { judul: "Praktik Kerja Lapangan di sekolah", tanggal: "01-08-2024",
    isi: "Memiliki pengalaman kerja di sebuah sekolah bagian desain" },
];

const containerPortofolio = document.querySelector(".daftar-portofolio");

function tampilkanPortofolio(data) {
  const article = document.createElement("article");

  const judul = document.createElement("h3");
  judul.textContent = data.judul;

  const waktu = document.createElement("time");
  waktu.textContent = data.tanggal;

  const isi = document.createElement("p");
  isi.textContent = data.isi;

  const tombolLike = document.createElement("button");
  let jumlahLike = 0;
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

daftarPortofolio.forEach((data) => {
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
});


containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-hapus")) {
    e.target.closest("article").remove();
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


containerPortofolio.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-like")) {
    let jumlah = parseInt(e.target.dataset.like || 0);
    jumlah++;
    e.target.dataset.like = jumlah;
    e.target.textContent = `Like (${jumlah})`;
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

  const itemKomentar = document.createElement("li");

  const teksKomentar = document.createElement("span");
  teksKomentar.textContent = `${nama}: ${pesan}`;

  const tombolHapusKomentar = document.createElement("button");
  tombolHapusKomentar.textContent = "Hapus";
  tombolHapusKomentar.classList.add("tombol-hapus-komentar");

  itemKomentar.appendChild(teksKomentar);
  itemKomentar.appendChild(tombolHapusKomentar);
  daftarKomentar.appendChild(itemKomentar);

  formKomentar.reset(); 
});


daftarKomentar.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-hapus-komentar")) {
    e.target.closest("li").remove();
  }
});


const tombolHapusSemua = document.querySelector("#btn-hapus-semua");

tombolHapusSemua.addEventListener("click", () => {
  daftarKomentar.innerHTML = "";
});


document.addEventListener("keydown", (e) => {
  // Abaikan jika pengguna sedang mengetik di form
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    return;
  }

  if (e.key.toLowerCase() === "d") {
    document.body.classList.toggle("dark-mode");
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
