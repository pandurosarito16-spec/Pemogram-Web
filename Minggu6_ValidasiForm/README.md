# README
## Program Formulir Pendaftaran Mahasiswa Baru Universitas Sanata Dharma

### 1. Deskripsi Program
Program ini merupakan aplikasi web formulir pendaftaran mahasiswa baru Universitas Sanata Dharma yang dibuat menggunakan HTML, CSS, dan JavaScript. Program memiliki fitur pendaftaran akun, pengisian formulir mahasiswa baru, validasi data, serta formulir komentar. Validasi digunakan untuk memastikan data yang dimasukkan sesuai dengan aturan sebelum formulir berhasil dikirim.

### 2. Fitur-Fitur Program

**A. Navigasi Halaman**
- Menyediakan menu untuk berpindah ke bagian Pendaftaran Akun, Formulir Mahasiswa Baru, dan Form Komentar.
- Menggunakan tautan yang mengarah langsung ke bagian halaman terkait.

**B. Pendaftaran Akun**
- Memiliki kolom username, email, password, dan konfirmasi password.
- Username harus terdiri dari 4–20 karakter dan hanya boleh berisi huruf, angka, serta garis bawah (_).
- Password harus memiliki minimal 8 karakter.
- Konfirmasi password harus sama dengan password yang dimasukkan.
- Menampilkan pesan kesalahan jika data tidak sesuai dan pesan keberhasilan jika pendaftaran berhasil.

**C. Formulir Pendaftaran Mahasiswa Baru**
Formulir dibagi menjadi beberapa bagian, yaitu:
- **A. Data Calon Mahasiswa dan Orang Tua/Wali:** nama lengkap, jenis kelamin, status, agama, kewarganegaraan, alamat, nomor telepon, email, pendidikan orang tua, serta data mahasiswa transfer.
- **B. Program Studi yang Dipilih:** pilihan program studi pertama, kedua, dan ketiga dari fakultas yang tersedia.
- **C. Data Sekolah:** nama sekolah, alamat, nomor telepon, tahun ijazah, data nilai, jumlah mata pelajaran, serta jurusan sekolah.
- **D. Permohonan Keringanan DPP:** pilihan mengajukan atau tidak mengajukan keringanan DPP beserta kelengkapan dokumennya.
- **E. Partisipasi Program Beasiswa:** pilihan menyumbang atau tidak menyumbang dana beasiswa.
- **F. Pernyataan:** persetujuan bahwa data yang diisi benar dan tanda tangan berupa nama lengkap.

**D. Validasi Formulir**
- Memeriksa kolom wajib, panjang karakter, format email, pola penulisan, dan batas nilai angka.
- Memeriksa kesamaan password dengan konfirmasi password.
- Memastikan tanda tangan sesuai dengan nama lengkap.
- Memastikan pilihan program studi tidak kosong, tidak lebih dari satu pada setiap kolom, dan tidak memilih program studi yang sama berulang kali.
- Memeriksa kesesuaian jumlah nilai dengan jumlah mata pelajaran.
- Menampilkan pesan kesalahan dalam bahasa Indonesia pada bagian isian yang bermasalah.
- Menggunakan validasi bawaan HTML5 dan JavaScript melalui `checkValidity()`, `validationMessage`, dan `setCustomValidity()`.

**E. Isian yang Bergantung pada Pilihan**
- Data perguruan tinggi asal, program studi asal, dan status akreditasi menjadi wajib jika bagian mahasiswa transfer mulai diisi.
- Kolom nilai akreditasi aktif ketika pilihan terakreditasi dipilih.
- Dokumen keringanan DPP menjadi wajib ketika mahasiswa memilih mengajukan keringanan.
- Nominal sumbangan wajib diisi ketika mahasiswa memilih menyumbang dana beasiswa.
- Kolom yang tidak diperlukan akan dinonaktifkan dan dikosongkan kembali.

**F. Pengiriman dan Reset Formulir**
- Memeriksa kembali seluruh data sebelum formulir dikirim.
- Menampilkan ringkasan kesalahan jika masih terdapat data yang tidak sesuai.
- Mengarahkan pengguna ke bagian isian pertama yang bermasalah.
- Menampilkan pesan keberhasilan jika seluruh data valid.
- Menyediakan tombol reset untuk mengosongkan isian dan membersihkan pesan validasi.

**G. Formulir Komentar**
- Menyediakan kolom nama dan komentar.
- Nama harus terdiri dari 3–30 karakter.
- Komentar harus terdiri dari 5–200 karakter.
- Menampilkan komentar yang berhasil dikirim pada daftar komentar.
- Menampilkan komentar terbaru di bagian paling atas daftar.

**H. Tampilan dan Desain**
- Menggunakan CSS untuk mengatur warna, ukuran tulisan, jarak, tabel, kolom isian, dan tombol.
- Menampilkan warna merah pada isian yang tidak valid dan warna hijau pada isian yang valid.
- Menggunakan desain formulir berbentuk kartu dengan kop Universitas Sanata Dharma.
- Mendukung tampilan layar kecil melalui media query CSS.
- Menggunakan tabel yang dapat digeser secara horizontal ketika ukuran layar tidak mencukupi.

### 3. Teknologi yang Digunakan
- **HTML:** membangun struktur halaman, navigasi, formulir, tabel, dan tombol.
- **CSS:** mengatur tampilan, warna, tata letak, dan responsivitas halaman.
- **JavaScript:** mengatur validasi, pesan kesalahan, ketergantungan antarisian, pengiriman formulir, reset, dan penambahan komentar.
- **Validasi HTML5:** membantu memeriksa kelengkapan, format, panjang karakter, pola, dan rentang nilai input.

### 4. Cara Menjalankan Program
1. Simpan file `index.html`, `style.css`, dan `script.js` dalam satu folder.
2. Buka file `index.html` menggunakan browser.
3. Coba isi formulir pendaftaran akun, formulir mahasiswa baru, atau formulir komentar.
4. Perhatikan pesan validasi yang muncul ketika data belum sesuai.
5. Kirim formulir setelah seluruh persyaratan terpenuhi.

### 5. Catatan Program
Program ini merupakan simulasi formulir pendaftaran berbasis web. Pesan keberhasilan menunjukkan bahwa data telah lolos validasi pada halaman, bukan berarti data sudah tersimpan di database atau terkirim ke server.

---

# JAWABAN EVALUASI MANDIRI

**1. Mengapa validasi client-side tidak boleh menjadi satu-satunya lapisan validasi?**

Karena validasi client-side dapat dilewati atau dimanipulasi oleh pengguna. Validasi server-side tetap diperlukan untuk menjaga keamanan dan memastikan data yang diterima benar.

**2. Sebutkan minimal tiga atribut validasi bawaan HTML5 beserta fungsinya.**

- `required`: mewajibkan kolom diisi.
- `minlength`: menentukan jumlah minimal karakter.
- `maxlength`: menentukan jumlah maksimal karakter.
- `pattern`: menentukan pola penulisan yang diperbolehkan.
- `min` dan `max`: menentukan batas minimal dan maksimal nilai.

**3. Jelaskan perbedaan `input.checkValidity()` dan `input.reportValidity()`.**

`checkValidity()` memeriksa apakah input valid dan mengembalikan nilai `true` atau `false`. `reportValidity()` memeriksa validitas sekaligus meminta browser menampilkan pesan validasi jika input tidak valid.

**4. Apa fungsi `setCustomValidity("")`, dan mengapa perlu dipanggil kembali setelah error diperbaiki?**

`setCustomValidity("")` menghapus pesan kesalahan kustom sehingga input dapat dinyatakan valid kembali jika tidak ada kesalahan lain. Jika tidak dipanggil setelah kesalahan diperbaiki, pesan kesalahan sebelumnya tetap membuat input dianggap tidak valid.

**5. Rancang aturan validasi agar field Tanggal Lahir tidak boleh berada di masa depan.**

Atur atribut `max` pada input tanggal menggunakan tanggal hari ini. Dengan demikian, pengguna tidak dapat memilih tanggal setelah hari ini melalui validasi bawaan browser.

Pseudocode:
```text
tanggalHariIni = tanggal saat ini
inputTanggalLahir.max = tanggalHariIni

JIKA tanggalLahir > tanggalHariIni
    TAMPILKAN pesan "Tanggal lahir tidak boleh di masa depan"
    FORMULIR tidak valid
JIKA TIDAK
    TANGGAL valid
```

Contoh HTML:
```html
<input type="date" id="tanggal-lahir" required>
```

Contoh JavaScript:
```javascript
const tanggalLahir = document.querySelector("#tanggal-lahir");
const hariIni = new Date();
const tahun = hariIni.getFullYear();
const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
const tanggal = String(hariIni.getDate()).padStart(2, "0");

tanggalLahir.max = `${tahun}-${bulan}-${tanggal}`;
```