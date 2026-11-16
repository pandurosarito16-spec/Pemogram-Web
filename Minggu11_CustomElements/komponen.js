"use strict";

// menampilkan salam dengan nama dari atribut
class SalamPengguna extends HTMLElement {
  connectedCallback() {
    const nama = this.getAttribute("nama") || "Tamu";
    this.textContent = `Halo, ${nama}! Selamat datang di blog.`;
  }
}
customElements.define("salam-pengguna", SalamPengguna);


// Komponen <kartu-artikel>: menampilkan kartu artikel dari atribut judul dan isi
class KartuArtikel extends HTMLElement {
  // Menyimpan jumlah like milik tiap kartu
  #like = 0;

  static get observedAttributes() {
    return ["judul", "isi"];
  }

  // Dipanggil saat elemen masuk ke dokumen
  connectedCallback() {
    this.render();
  }

  // Dipanggil saat elemen dilepas dari dokumen
  disconnectedCallback() {
    console.log("kartu-artikel dilepas dari halaman");
  }

  // Merender ulang saat atribut yang diamati berubah
  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `
      <article class="kartu">
        <h3></h3>
        <p></p>
        <button type="button" class="btn-like"></button>
        <button type="button" class="btn-hapus">Hapus</button>
      </article>`;

    this.querySelector("h3").textContent = this.getAttribute("judul") ?? "";
    this.querySelector("p").textContent = this.getAttribute("isi") ?? "";

    // Tombol Like: jumlah like disimpan di #like sehingga tetap bertahan antar render
    const tombolLike = this.querySelector(".btn-like");
    tombolLike.textContent = `Like (${this.#like})`;
    tombolLike.addEventListener("click", () => {
      this.#like++;
      tombolLike.textContent = `Like (${this.#like})`;
    });

    // Tombol Hapus
    this.querySelector(".btn-hapus").addEventListener("click", () => this.remove());
  }
}
customElements.define("kartu-artikel", KartuArtikel);


// menampilkan satu komentar dari atribut nama dan pesan
class KartuKomentar extends HTMLElement {
  // Hanya atribut ini yang memicu attributeChangedCallback
  static get observedAttributes() {
    return ["nama", "pesan"];
  }

  // Dipanggil saat elemen masuk ke dokumen
  connectedCallback() {
    this.render();
  }

  // Merender ulang saat atribut yang diamati berubah
  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `
      <div class="kartu-komentar">
        <span></span>
        <button type="button" class="tombol-edit-komentar">Edit</button>
        <button type="button" class="tombol-hapus-komentar">Hapus</button>
      </div>`;

    const nama = this.getAttribute("nama") ?? "";
    const pesan = this.getAttribute("pesan") ?? "";
    this.querySelector("span").textContent = `${nama}: ${pesan}`;
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
