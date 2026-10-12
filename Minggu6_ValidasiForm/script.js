// Menampilkan pesan error ke elemen <span> di DOM 
function validasiField(input, errorElement) {
  if (!input.checkValidity()) {
    errorElement.textContent = input.validationMessage;
  } else {
    errorElement.textContent = "";
  }
}

// Aturan tambahan/validasi kustom untuk field tertentu.
// Mengembalikan teks pesan error, atau "" jika sudah benar.
const aturanKhusus = {
  // Konfirmasi password harus sama dengan password
  "konfirmasi": (el) => {
    const password = document.querySelector("#password").value;
    return el.value !== password
      ? "Konfirmasi password tidak sama dengan password"
      : "";
  },

  // Jumlah nilai tidak mungkin lebih besar dari 10 x jumlah mata pelajaran
  "jumlah-nilai": (el) => {
    const mapel = Number(document.querySelector("#jumlah-mapel").value);
    if (mapel > 0 && Number(el.value) > mapel * 10) {
      return "Jumlah nilai tidak boleh lebih dari 10 x jumlah mata pelajaran";
    }
    return "";
  },

  // Tanda tangan harus sama dengan nama lengkap
  "tanda-tangan": (el) => {
    const nama = document.querySelector("#nama-lengkap").value.trim().toLowerCase();
    return el.value.trim().toLowerCase() !== nama
      ? "Tanda tangan harus sama dengan nama lengkap yang diisi di bagian A"
      : "";
  }
};

// Pesan error kustom Bahasa Indonesia memakai setCustomValidity()
function setPesan(input) {
  const label = input.dataset.label || "Isian ini";
  const v = input.validity;
  let pesan = "";

  const kosong = input.required && input.type !== "checkbox" && input.value.trim() === "";

  if (v.valueMissing || kosong) {
    pesan = input.dataset.pesan || label + " wajib diisi";
  } else if (v.tooShort) {
    pesan = label + " minimal " + input.minLength + " karakter";
  } else if (v.tooLong) {
    pesan = label + " maksimal " + input.maxLength + " karakter";
  } else if (v.typeMismatch) {
    pesan = "Format " + label + " tidak valid";
  } else if (v.patternMismatch) {
    pesan = input.dataset.pola || "Format " + label + " tidak sesuai";
  } else if (v.badInput) {
    pesan = label + " harus berupa angka";
  } else if (v.rangeUnderflow) {
    pesan = label + " minimal " + input.min;
  } else if (v.rangeOverflow) {
    pesan = label + " maksimal " + input.max;
  } else if (v.stepMismatch) {
    pesan = label + " tidak valid";
  } else if (aturanKhusus[input.id]) {
    pesan = aturanKhusus[input.id](input);
  }

  input.setCustomValidity(pesan);
}

function ambilError(input) {
  return document.getElementById("error-" + input.id);
}

// pasang pesan kustom lalu tampilkan di DOM
function validasiIsian(input) {
  setPesan(input);
  validasiField(input, ambilError(input));
}

// Memasang event pada semua field di dalam sebuah form
function pasangValidasi(form) {
  form.querySelectorAll(".isian, .cek").forEach((input) => {
    const jalankan = () => validasiIsian(input);
    input.addEventListener("input", jalankan);
    input.addEventListener("change", jalankan);
    input.addEventListener("blur", jalankan);
    // Saat browser menandai field tidak valid 
    input.addEventListener("invalid", () => {
      setPesan(input);
      ambilError(input).textContent = input.validationMessage;
    });
  });
}

// Bersihkan semua pesan error dan status custom validity
function bersihkanValidasi(form) {
  form.querySelectorAll(".isian, .cek, input[type='radio'], input[type='checkbox']")
    .forEach((el) => el.setCustomValidity(""));
  form.querySelectorAll(".pesan-error").forEach((span) => {
    span.textContent = "";
  });
}


//Form komentar
const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");

pasangValidasi(formKomentar);

formKomentar.addEventListener("submit", (e) => {
  e.preventDefault();
  const item = document.createElement("li");
  const nama = document.createElement("strong");
  nama.textContent = inputNama.value.trim();
  item.appendChild(nama);
  item.appendChild(document.createTextNode(": " + inputPesan.value.trim()));
  daftarKomentar.prepend(item);
  formKomentar.reset();
  bersihkanValidasi(formKomentar);
});


// Form pendaftaran akun
const formDaftar = document.querySelector("#form-daftar");
const errorKonfirmasi = document.querySelector("#error-konfirmasi");
const suksesDaftar = document.querySelector("#sukses-daftar");

pasangValidasi(formDaftar);

// Jika password diubah, cek ulang konfirmasi password
document.querySelector("#password").addEventListener("input", () => {
  const konfirmasi = document.querySelector("#konfirmasi");
  if (konfirmasi.value !== "") validasiIsian(konfirmasi);
});

formDaftar.addEventListener("submit", (e) => {
  const password = document.querySelector("#password").value;
  const konfirmasi = document.querySelector("#konfirmasi").value;
  if (password !== konfirmasi) {
    e.preventDefault();
    errorKonfirmasi.textContent =
      "Konfirmasi password tidak sama dengan password";
    suksesDaftar.textContent = "";
  } else {
    e.preventDefault(); 
    errorKonfirmasi.textContent = "";
    suksesDaftar.textContent = "Pendaftaran akun berhasil!";
    formDaftar.reset();
    bersihkanValidasi(formDaftar);
  }
});


// Formulir pendaftaran mahasiswa baru
const formMhs = document.querySelector("#form-mahasiswa");
const ringkasanError = document.querySelector("#ringkasan-error");
const suksesMhs = document.querySelector("#sukses-mhs");

// Batas tahun mengikuti tahun saat ini
const tahunIni = new Date().getFullYear();
document.querySelector("#sttb-tahun").max = tahunIni;
document.querySelector("#nem-tahun").max = tahunIni;

pasangValidasi(formMhs);

/* Validasi kelompok radio button  */
const grupRadio = [
  "jenis-kelamin", "status", "agama", "kewarganegaraan",
  "tingkat-pendidikan", "status-transfer", "jurusan-sma",
  "dpp", "beasiswa"
];

function validasiGrup(nama) {
  const radio = formMhs.querySelectorAll('input[name="' + nama + '"]');
  const pertama = radio[0];
  const error = document.getElementById("error-" + nama);

  if (pertama.validity.valueMissing) {
    pertama.setCustomValidity((pertama.dataset.label || "Pilihan") + " wajib dipilih");
  } else {
    pertama.setCustomValidity("");
  }
  validasiField(pertama, error);
}

grupRadio.forEach((nama) => {
  formMhs.querySelectorAll('input[name="' + nama + '"]').forEach((radio) => {
    radio.addEventListener("change", () => validasiGrup(nama));
  });
});

/*  Validasi pilihan program studi */
const errorProdi = document.querySelector("#error-prodi");
const kotakPilihan1 = document.querySelector('input[name="pilihan1"]');

function validasiProdi() {
  const p1 = formMhs.querySelectorAll('input[name="pilihan1"]:checked');
  const p2 = formMhs.querySelectorAll('input[name="pilihan2"]:checked');
  const p3 = formMhs.querySelectorAll('input[name="pilihan3"]:checked');
  let pesan = "";

  if (p1.length === 0) {
    pesan = "Pilihan I wajib diisi (beri tanda silang pada salah satu program studi)";
  } else if (p1.length > 1 || p2.length > 1 || p3.length > 1) {
    pesan = "Setiap kolom pilihan hanya boleh diberi satu tanda silang";
  } else {
    // Satu program studi tidak boleh dipilih di dua kolom berbeda
    const terpilih = [p1, p2, p3]
      .filter((kelompok) => kelompok.length === 1)
      .map((kelompok) => kelompok[0].value);
    if (new Set(terpilih).size !== terpilih.length) {
      pesan = "Satu program studi tidak boleh dipilih lebih dari satu kali";
    }
  }

  kotakPilihan1.setCustomValidity(pesan);
  errorProdi.textContent = pesan;
}

["pilihan1", "pilihan2", "pilihan3"].forEach((nama) => {
  formMhs.querySelectorAll('input[name="' + nama + '"]').forEach((kotak) => {
    kotak.addEventListener("change", validasiProdi);
  });
});

/*  Isian yang bergantung pada isian lain  */
const asalPt = document.querySelector("#asal-pt");
const asalProdi = document.querySelector("#asal-prodi");
const nilaiAkreditasi = document.querySelector("#nilai-akreditasi");
const nominalBeasiswa = document.querySelector("#nominal-beasiswa");
const dokumenDpp = formMhs.querySelectorAll("#dok-a, #dok-b, #dok-c");

function aturDependensi() {
  // 1. Mahasiswa transfer: jika salah satu bagian diisi, semua bagian wajib
  const radioTransfer = formMhs.querySelectorAll('input[name="status-transfer"]');
  const statusDipilih = formMhs.querySelector('input[name="status-transfer"]:checked') !== null;
  const transferAktif =
    asalPt.value.trim() !== "" || asalProdi.value.trim() !== "" || statusDipilih;

  asalPt.required = transferAktif;
  asalProdi.required = transferAktif;
  radioTransfer.forEach((r) => { r.required = transferAktif; });

  // 2. Nilai akreditasi hanya aktif jika memilih "Terakreditasi"
  const akreditasi = document.querySelector("#akreditasi").checked;
  nilaiAkreditasi.disabled = !akreditasi;
  nilaiAkreditasi.required = akreditasi;
  if (!akreditasi) {
    nilaiAkreditasi.value = "";
    nilaiAkreditasi.setCustomValidity("");
    ambilError(nilaiAkreditasi).textContent = "";
  }

  // 3. Dokumen DPP wajib lengkap jika mengajukan keringanan
  const ajukan = document.querySelector("#dpp-ajukan").checked;
  dokumenDpp.forEach((dok) => {
    dok.disabled = !ajukan;
    dok.required = ajukan;
    if (!ajukan) {
      dok.checked = false;
      dok.setCustomValidity("");
      ambilError(dok).textContent = "";
    }
  });

  // 4. Nominal beasiswa wajib diisi jika memilih menyumbang
  const menyumbang = document.querySelector("#beasiswa-ya").checked;
  nominalBeasiswa.disabled = !menyumbang;
  nominalBeasiswa.required = menyumbang;
  if (!menyumbang) {
    nominalBeasiswa.value = "";
    nominalBeasiswa.setCustomValidity("");
    ambilError(nominalBeasiswa).textContent = "";
  }
}

// Setiap ada perubahan isian, perbarui kebergantungan lalu cek ulang
// isian transfer yang sebelumnya sudah menampilkan error
function setelahBerubah() {
  aturDependensi();
  [asalPt, asalProdi].forEach((el) => {
    if (ambilError(el).textContent !== "") validasiIsian(el);
  });
  if (document.getElementById("error-status-transfer").textContent !== "") {
    validasiGrup("status-transfer");
  }
}
formMhs.addEventListener("input", setelahBerubah);
formMhs.addEventListener("change", setelahBerubah);

// Isian yang saling berkaitan, cek ulang jika isian pasangannya berubah
document.querySelector("#nama-lengkap").addEventListener("input", () => {
  const tt = document.querySelector("#tanda-tangan");
  if (tt.value !== "") validasiIsian(tt);
});
document.querySelector("#jumlah-mapel").addEventListener("input", () => {
  const nilai = document.querySelector("#jumlah-nilai");
  if (nilai.value !== "") validasiIsian(nilai);
});

/*  Submit formulir  */
formMhs.addEventListener("submit", (e) => {
  e.preventDefault();
  suksesMhs.textContent = "";
  aturDependensi();

  // Jalankan seluruh validasi agar semua pesan error tampil sekaligus
  formMhs.querySelectorAll(".isian, .cek").forEach(validasiIsian);
  grupRadio.forEach(validasiGrup);
  validasiProdi();

  if (formMhs.checkValidity()) {
    const nama = document.querySelector("#nama-lengkap").value.trim();
    ringkasanError.textContent = "";
    formMhs.reset();
    suksesMhs.textContent =
      "Formulir atas nama " + nama + " berhasil dikirim. Terima kasih!";
    suksesMhs.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    ringkasanError.textContent =
      "Formulir belum dapat dikirim. Periksa isian yang menampilkan pesan berwarna merah.";
    const pertamaSalah = formMhs.querySelector(":invalid");
    if (pertamaSalah) {
      pertamaSalah.scrollIntoView({ behavior: "smooth", block: "center" });
      pertamaSalah.focus();
    }
  }
});

/*  Reset formulir  */
formMhs.addEventListener("reset", () => {
  // setTimeout agar dijalankan setelah browser selesai mengosongkan isian
  setTimeout(() => {
    bersihkanValidasi(formMhs);
    ringkasanError.textContent = "";
    aturDependensi();
  }, 0);
});
document.querySelector("#tombol-reset").addEventListener("click", () => {
  suksesMhs.textContent = "";
});

aturDependensi();