# 🚀 Next.js + Prisma Project

Project ini dibangun menggunakan **Next.js** sebagai framework frontend & backend (API Routes / App Router) dan **Prisma ORM** sebagai Object Relational Mapper untuk pengelolaan database.

## 📌 Tech Stack

* **Next.js** (App Router / Pages Router)
* **Prisma ORM**
* **Database**: PostgreSQL / MySQL / SQLite (sesuai konfigurasi)
* **Node.js**
* **TypeScript**

---

## 📂 Struktur Folder

```
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/            # App Router
│   ├── errors/         # custom error
│   ├── lib/
│   └── components/
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Instalasi

1. **Clone repository**

```bash
git clone https://github.com/username/nama-project.git
cd nama-project
```

2. **Install dependencies**

```bash
npm install
# atau
yarn install
```

3. **Konfigurasi environment**

Buat file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
```

---

## 🧩 Prisma Setup

1. **Inisialisasi Prisma**

```bash
npx prisma init
```

2. **Edit schema Prisma** (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

3. **Migrasi database**

```bash
npm run migrate
```

4. **Generate Prisma Client**

```bash
npm run generate
```

---

## ▶️ Menjalankan Project

```bash
npm run dev
```

Akses di browser:

```
http://localhost:3000
```

---

## 🛠️ Prisma Studio

Untuk melihat data secara visual:

```bash
npx prisma studio
```

---

## 📝 Catatan

* Pastikan koneksi database aktif sebelum menjalankan migrasi
* Jangan lupa `.env` **tidak di-commit** ke repository
* Gunakan singleton Prisma Client untuk menghindari error koneksi

---

## 📄 Lisensi

MIT License

---

✨ Dibuat dengan Next.js & Prisma
