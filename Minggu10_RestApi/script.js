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

    // Mengirim pembaruan like ke server (id simulasi dari urutan portofolio)
    const article = e.target.closest("article");
    const idPortofolio = Array.from(containerPortofolio.children).indexOf(article) + 1;
    perbaruiLikeKeServer(idPortofolio, jumlah);
  }
});


const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanError = document.querySelector("#pesan-error");
const tombolKirim = document.querySelector("#form-komentar button");

// Menyimpan komentar yang sedang diedit (null jika form dalam mode kirim baru)
let itemKomentarEdit = null;

formKomentar.addEventListener("submit", async (e) => {
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

  // Menonaktifkan tombol kirim selama permintaan berlangsung agar tidak terklik dua kali
  tombolKirim.disabled = true;

  try {
    if (itemKomentarEdit) {
      // Memperbarui komentar yang sedang diedit ke server dengan PATCH
      const hasil = await perbaruiKomentarKeServer(
        itemKomentarEdit.dataset.id, nama, pesan);
      console.log("Komentar diperbarui di server, id:", itemKomentarEdit.dataset.id);

      // Menampilkan data terbaru pada komentar yang diedit
      itemKomentarEdit.dataset.nama = hasil.name;
      itemKomentarEdit.dataset.pesan = hasil.body;
      itemKomentarEdit.querySelector("span").textContent =
        `${hasil.name}: ${hasil.body}`;

      itemKomentarEdit = null;
      tombolKirim.textContent = "Kirim";
    } else {
      // Mengirim komentar baru ke server dengan POST
      const hasil = await kirimKomentarKeServer(nama, pesan);
      console.log("Komentar tersimpan di server, id:", hasil.id);

      // Menampilkan respons server (termasuk id baru) ke dalam daftar komentar
      tampilkanKomentar(hasil.name, hasil.body, hasil.id);
    }

    formKomentar.reset();

    // Draft form tidak diperlukan lagi setelah komentar terkirim
    sessionStorage.removeItem("draftKomentar");
  } catch (error) {
    alert("Gagal menyimpan komentar. " + error.message);
    console.error(error);
  } finally {
    tombolKirim.disabled = false;
  }
});


// Menampilkan satu komentar ke dalam daftar komentar
function tampilkanKomentar(nama, pesan, id) {
  const itemKomentar = document.createElement("li");

  // Menyimpan id dari server untuk operasi update (PATCH) dan hapus (DELETE)
  itemKomentar.dataset.id = id;
  itemKomentar.dataset.nama = nama;
  itemKomentar.dataset.pesan = pesan;

  const teksKomentar = document.createElement("span");
  teksKomentar.textContent = `${nama}: ${pesan}`;

  const tombolEditKomentar = document.createElement("button");
  tombolEditKomentar.textContent = "Edit";
  tombolEditKomentar.classList.add("tombol-edit-komentar");

  const tombolHapusKomentar = document.createElement("button");
  tombolHapusKomentar.textContent = "Hapus";
  tombolHapusKomentar.classList.add("tombol-hapus-komentar");

  itemKomentar.appendChild(teksKomentar);
  itemKomentar.appendChild(tombolEditKomentar);
  itemKomentar.appendChild(tombolHapusKomentar);
  daftarKomentar.appendChild(itemKomentar);
}


daftarKomentar.addEventListener("click", async (e) => {
  // Menampilkan kembali isi komentar pada form untuk diedit
  if (e.target.classList.contains("tombol-edit-komentar")) {
    const itemKomentar = e.target.closest("li");

    document.querySelector("#input-nama").value = itemKomentar.dataset.nama;
    document.querySelector("#input-pesan").value = itemKomentar.dataset.pesan;

    itemKomentarEdit = itemKomentar;
    tombolKirim.textContent = "Simpan Perubahan";
    document.querySelector("#input-pesan").focus();
  }

  // Menghapus komentar dari server dengan DELETE berdasarkan id
  if (e.target.classList.contains("tombol-hapus-komentar")) {
    const itemKomentar = e.target.closest("li");
    const id = itemKomentar.dataset.id;

    // Menonaktifkan tombol hapus selama permintaan berlangsung
    e.target.disabled = true;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: "DELETE",
        });

      if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
      }

      // Membatalkan mode edit jika komentar yang sedang diedit dihapus
      if (itemKomentar === itemKomentarEdit) {
        itemKomentarEdit = null;
        tombolKirim.textContent = "Kirim";
        formKomentar.reset();
      }

      itemKomentar.remove();
    } catch (error) {
      alert("Gagal menghapus komentar dari server. " + error.message);
      console.error(error);
    } finally {
      e.target.disabled = false;
    }
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

// artikel dari API ditambahkan sebagai section baru karena program sebelumnya merupakan portofolio

// Fetch dasar ke console
async function ujiFetch() {
  const response = await
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
  const data = await response.json();
  console.log(data);
}

ujiFetch();


const containerArtikel = document.querySelector("#daftar-artikel-api");

async function muatArtikelDariAPI() {
  const loading = document.querySelector("#loading");
  loading.style.display = "block";

  try {
    const response = await
      fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      //fetch("https://jsonplaceholder.typicode.com/postsxyz?_limit=5");

    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }

    const daftarPost = await response.json();

    daftarPost.forEach((post) => {
      const article = document.createElement("article");

      // Menyimpan id dari server untuk operasi PATCH like
      article.dataset.id = post.id;

      const judul = document.createElement("h3");
      judul.textContent = post.title;

      const isi = document.createElement("p");
      isi.textContent = post.body;

      const tombolLike = document.createElement("button");
      // Memuat kembali jumlah like dari localStorage berdasarkan judul artikel
      const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
      const jumlahLike = semuaLike[post.title] || 0;
      tombolLike.dataset.like = jumlahLike;
      tombolLike.textContent = `Like (${jumlahLike})`;
      tombolLike.classList.add("tombol-like");

      const tombolHapus = document.createElement("button");
      tombolHapus.textContent = "Hapus";
      tombolHapus.classList.add("tombol-hapus");

      article.appendChild(judul);
      article.appendChild(isi);
      article.appendChild(tombolLike);
      article.appendChild(tombolHapus);
      containerArtikel.appendChild(article);
    });
  } catch (error) {
    containerArtikel.innerHTML =
      "<p>Gagal memuat artikel, silakan coba lagi.</p>";
    console.error("Gagal mengambil data:", error);
  } finally {
    loading.style.display = "none";
  }
}

muatArtikelDariAPI();


// Tombol Like dan Hapus pada artikel dari API
containerArtikel.addEventListener("click", (e) => {
  if (e.target.classList.contains("tombol-like")) {
    let jumlah = parseInt(e.target.dataset.like || 0);
    jumlah++;
    e.target.dataset.like = jumlah;
    e.target.textContent = `Like (${jumlah})`;

    // Menyimpan jumlah like dengan judul artikel sebagai kunci
    const judul = e.target.closest("article").querySelector("h3").textContent;
    simpanLike(judul, jumlah);

    // Mengirim pembaruan like ke server berdasarkan id artikel
    perbaruiLikeKeServer(e.target.closest("article").dataset.id, jumlah);
  }

  if (e.target.classList.contains("tombol-hapus")) {
    e.target.closest("article").remove();
  }
});


//  Data pengguna untuk aside 
async function muatProfilPenulis() {
  try {
    const response = await
      fetch("https://jsonplaceholder.typicode.com/users/1");
      //fetch("https://jsonplaceholder.typicode.com/usersxyz/1");
    if (!response.ok) throw new Error("Status: " + response.status);
    const user = await response.json();
    document.querySelector("#nama-penulis").textContent = user.name;
    document.querySelector("#email-penulis").textContent = user.email;
  } catch (error) {
    document.querySelector("#nama-penulis").textContent = "Gagal dimuat";
    document.querySelector("#email-penulis").textContent = "Gagal dimuat";
    console.error("Gagal memuat profil penulis:", error);
  }
}

muatProfilPenulis();


// Komentar awal dari  /posts/1/comments
async function muatKomentarDariAPI() {
  const pesanKomentarAPI = document.querySelector("#pesan-komentar-api");

  try {
    const response = await
      fetch("https://jsonplaceholder.typicode.com/posts/1/comments");
      //fetch("https://jsonplaceholder.typicode.com/posts/1/commentsxyz");

    if (!response.ok) {
      throw new Error("Status: " + response.status);
    }

    const daftarKomentarAPI = await response.json();

    daftarKomentarAPI.forEach((komentar) => {
      tampilkanKomentar(komentar.email, komentar.body, komentar.id);
    });
  } catch (error) {
    pesanKomentarAPI.textContent =
      "Gagal memuat komentar awal, silakan coba lagi nanti.";
    console.error("Gagal memuat komentar:", error);
  }
}

muatKomentarDariAPI();


// Memilih pesan yang sesuai berdasarkan status code dari server
function pesanDariStatus(status) {
  if (status === 404) return "Data tidak ditemukan di server.";
  if (status === 400) return "Data yang dikirim tidak valid.";
  if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
  return "Terjadi kesalahan tidak terduga.";
}


// Mengirim komentar baru ke server (POST)
async function kirimKomentarKeServer(nama, pesan) {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
    });

  if (!response.ok) {
    throw new Error(pesanDariStatus(response.status));
  }

  return await response.json();
}


// Memperbarui komentar di server (PATCH)
async function perbaruiKomentarKeServer(id, nama, pesan) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nama, body: pesan }),
    });

  if (!response.ok) {
    throw new Error(pesanDariStatus(response.status));
  }

  return await response.json();
}


// Memperbarui jumlah like di server (PATCH, endpoint /posts/id sebagai simulasi)
async function perbaruiLikeKeServer(postId, jumlahLike) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: jumlahLike }),
      });

    if (!response.ok) {
      throw new Error(pesanDariStatus(response.status));
    }

    console.log("Like berhasil diperbarui di server");
  } catch (error) {
    alert("Gagal memperbarui like. " + error.message);
    console.error("Gagal memperbarui like:", error);
  }
}
