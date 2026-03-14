# Gramedia-Style E-Commerce Bookstore

Sebuah sistem informasi toko buku online terpadu (E-Commerce Web Application) berskala penuh yang dibangun dengan **Spring Boot (Java 21)** sebagai Backend API dan **React Vite (TypeScript)** sebagai Frontend Single-Page Application (SPA).

Aplikasi ini mendukung operasional role-based (RBAC) dengan pemisahan hak akses antara Pelanggan (User), Staff Operasional, dan Pemilik/Administrator.

---

## 🚀 Fitur Utama Sistem

- **Role-Based Access Control (RBAC):** Memiliki 3 Hak Akses yang terpisah: `ADMIN`, `STAFF`, dan `USER` (Pelanggan).
- **Sistem Autentikasi Modern:** Login dan Registrasi aman menggunakan **JWT (JSON Web Token)** dan proteksi Spring Security berlapis.
- **E-Commerce Fungsional:** Menjelajah Katalog Buku, Filter Kategori, Data Penerbit, Keranjang Belanja (Cart), Kalkulasi Ongkir (berbasis berat spesifik gram/kilogram), hingga Proses Checkout Order.
- **Dynamic Site Branding & SEO (Global Settings):** Menyesuaikan identitas warna tema, logo website, favicon, open graph image, label mata uang (IDR, USD, dll) secara instan melalui dasbor, tanpa mengedit source code.
- **User Access Management:** Proteksi untuk kelola akses akun (Add, Edit akun & Role, Disable sesi, dan Hard Delete) secara antarmuka aman oleh Admin.
- **Real-Time Operations Dashboard:** Panel Data pesanan secara live (berbasis Auto-Polling) bagi Admin untuk memantau trafik revenue pesanan.

---

## 💻 Tech Stack

**Frontend (FE):**
- React 18 & TypeScript (via Vite)
- React Router DOM
- TailwindCSS & HeroIcons
- Axios (HTTP Client Interceptors)
- React Hot Toast & React Helmet Async

**Backend (BE):**
- JDK 21 & Spring Boot 3.3.x
- Spring Security (JWT Integration)
- Spring Data JPA (Hibernate)
- MySQL Database
- Maven

---

## 🛠️ Panduan Instalasi

### 1. Persiapan Database (MySQL)
Pastikan lingkungan *localhost* Anda sudah menjalankan *MySQL Server*. Aplikasi ini akan terhubung secara otomatis ke database dan menginisiasi data contoh (*seeding*) dari file `init.sql` jika diatur *mode always*. Konfigurasi ini berada pada file `BE/src/main/resources/application.properties` (sesuaikan port jika diperlukan):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Menjalankan Backend (Spring Boot)
1. Buka terminal Anda dan ubah direktori menuju folder **Backend**: 
   ```bash
   cd BE
   ```
2. Kompilasi dan jalankan dengan Maven:
   ```bash
   mvn spring-boot:run
   ```
3. Backend API secara stabil akan beroperasi dengan *entrypoint*: `http://localhost:8086`.

### 3. Menjalankan Frontend (React)
1. Pada jendela terminal baru, navigasi ke folder **Frontend**:
   ```bash
   cd FE
   ```
2. Instal semua module Node.js:
   ```bash
   npm install
   ```
3. Jalankan server lokal Vite:
   ```bash
   npm run dev
   ```
4. Akses *User-Interface* di Browser kesayangan Anda pada port: `http://localhost:5173`.

---

## 🛡️ Panduan Mengaktifkan Sistem Admin

Untuk memastikan faktor keamanan awal dari sembarang tamu/publik, sistem mendaftarkan peserta ke dalam posisi dasar `"USER"`. Untuk membuat akun/session *Master Administrator* pertama Anda, ikuti alur trik aman berikut:

1. Kunjungi halaman utama Publik Aplikasi Web (FE), lalu klik menu **Register**.
2. Buat akun biasa layaknya pembeli, daftarkan dengan nama & email Anda (Misal: `admin@contoh.com`).
3. Buka *Database Management / SQL Client* Anda (seperti **phpMyAdmin**, **DBeaver**, **HeidiSQL**, dll).
4. Masuk ke tabel **`users`** di dalam *database* `bookstore_db`.
5. Temukan baris (*row*) tempat data anggota yang baru saja Anda buat bersemayam.
6. Ubah manual kolom **`role`** yang awalnya `"USER"` menjadi **`"ADMIN"`**.
7. Silakan **Logout** / muat ulang di browser web Anda, lalu masuk kembali (**Login**). 
8. Pada menu Sidebar sebelah kiri, tombol *Dashboard Admin* akan muncul. Klik tautan itu dan Anda secara otonom memegang kunci penuh ke aplikasi web ini!