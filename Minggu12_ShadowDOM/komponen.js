"use strict";

// menampilkan salam dengan nama dari atribut
class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama") || "Tamu";
    this.textContent = `Halo, ${nama}! Selamat datang di blog.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);


// Template <kartu-artikel>: judul dan isi dikirim lewat slot, gaya terisolasi di shadow tree
const templateKartu = document.createElement("template");
templateKartu.innerHTML = `
  <style>
    :host { display: block; }
    .kartu {
      border: 1px solid var(--kartu-garis, #ddd);
      border-radius: var(--kartu-radius, 8px);
      padding: 16px;
      background: var(--kartu-latar, transparent);
      color: var(--kartu-teks, #333);
    }
    ::slotted(h3) { margin: 0 0 8px; }
    .btn-like { cursor: pointer; }
  </style>
  <article class="kartu">
    <slot name="judul">Tanpa judul</slot>
    <slot>Tanpa isi</slot>
    <button type="button" class="btn-like" part="tombol-like">Like (0)</button>
  </article>`;

// Komponen <kartu-artikel>: menampilkan kartu artikel dengan Shadow DOM, slot, dan event "suka"
class KartuArtikel extends HTMLElement {
  // Menyimpan jumlah like milik tiap kartu
  #like = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKartu.content.cloneNode(true));

    // Listener dipasang di constructor agar tidak terpasang ganda
    const tombol = this.shadowRoot.querySelector(".btn-like");
    tombol.addEventListener("click", () => {
      this.#like++;
      tombol.textContent = `Like (${this.#like})`;

      // Mengirim event "suka" ke halaman (events up)
      this.dispatchEvent(new CustomEvent("suka", {
        detail: { jumlah: this.#like },
        bubbles: true, composed: true,
      }));
    });
  }

  // Memulihkan jumlah like dari halaman (props down)
  set like(jumlah) {
    this.#like = jumlah;
    this.shadowRoot.querySelector(".btn-like").textContent = `Like (${this.#like})`;
  }

  get like() {
    return this.#like;
  }
}
customElements.define("kartu-artikel", KartuArtikel);


// Membuat satu <kartu-artikel> dari data artikel API
function buatKartu(post) {
  const kartu = document.createElement("kartu-artikel");

  const judul = document.createElement("h3");
  judul.slot = "judul";
  judul.textContent = post.title;

  const isi = document.createElement("p");
  isi.textContent = post.body;

  kartu.append(judul, isi);

  // Memulihkan jumlah like dari localStorage berdasarkan judul artikel
  const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
  kartu.like = semuaLike[post.title] || 0;

  return kartu;
}


// Komponen <daftar-artikel>: mengambil artikel dari API lalu menyusun banyak <kartu-artikel>
class DaftarArtikel extends HTMLElement {
  async connectedCallback() {
    this.textContent = "Memuat artikel...";
    const batas = Number(this.getAttribute("batas")) || 5;

    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${batas}`);
      //const res = await fetch(`https://jsonplaceholder.typicode.com/postsxyz?_limit=${batas}`);
      if (!res.ok) throw new Error("Status: " + res.status);

      const data = await res.json();
      this.replaceChildren(...data.map(buatKartu));
    } catch (error) {
      this.textContent = "Gagal memuat artikel, silakan coba lagi.";
      console.error(error);
    }
  }
}
customElements.define("daftar-artikel", DaftarArtikel);


// Template <kartu-komentar>: nama dan pesan dikirim lewat named slot
const templateKomentar = document.createElement("template");
templateKomentar.innerHTML = `
  <style>
    :host { display: block; }
    .kartu-komentar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
      padding: 12px 16px;
      border: 1px solid var(--kartu-garis, #ddd);
      border-radius: var(--kartu-radius, 8px);
      background: var(--kartu-latar, white);
    }
    span { margin-right: auto; }
    button {
      padding: 4px 12px;
      border: none;
      border-radius: 6px;
      background-color: #dc3545;
      color: white;
      cursor: pointer;
    }
    button:hover { background-color: #b02a37; }
    .tombol-edit-komentar { background-color: #1f4e78; }
    .tombol-edit-komentar:hover { background-color: #163a59; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
  </style>
  <div class="kartu-komentar">
    <span><slot name="nama">Tanpa nama</slot>: <slot name="pesan">Tanpa pesan</slot></span>
    <button type="button" class="tombol-edit-komentar">Edit</button>
    <button type="button" class="tombol-hapus-komentar">Hapus</button>
  </div>`;

// menampilkan satu komentar dengan Shadow DOM dan slot nama & pesan
class KartuKomentar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateKomentar.content.cloneNode(true));

    // Tombol Edit: mengirim event "edit-komentar" ke halaman
    this.shadowRoot.querySelector(".tombol-edit-komentar").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("edit-komentar", {
        bubbles: true, composed: true,
      }));
    });

    // Tombol Hapus: mengirim event "hapus-komentar" ke halaman
    this.shadowRoot.querySelector(".tombol-hapus-komentar").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("hapus-komentar", {
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define("kartu-komentar", KartuKomentar);


// tombol mode gelap beserta penyimpanan preferensi ke localStorage
class TombolTema extends HTMLElement {
  // Dipanggil saat elemen masuk ke dokumen
  connectedCallback() {
    this.render();

    // Memuat kembali preferensi tema saat halaman dibuka
    const tema = localStorage.getItem("tema");
    if (tema === "dark") {
      document.body.classList.add("dark-mode");
    }
  }

  // Mengganti tema dan menyimpan status tema terkini ke localStorage
  toggleTema() {
    document.body.classList.toggle("dark-mode");

    const temaSekarang = document.body.classList.contains("dark-mode")
      ? "dark" : "light";
    localStorage.setItem("tema", temaSekarang);
  }

  render() {
    this.innerHTML = `<button type="button" class="btn-tema">Mode Gelap</button>`;
    this.querySelector(".btn-tema").addEventListener("click", () => this.toggleTema());
  }
}
customElements.define("tombol-tema", TombolTema);
