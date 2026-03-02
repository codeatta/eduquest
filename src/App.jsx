import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  Brain,
  Database,
  Code,
  Trophy,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  User,
  BookOpen,
  Lock,
  Unlock,
  Medal,
  ChevronRight,
  CheckCircle2,
  Award,
  Star,
  Zap,
  Calendar,
  ShieldCheck,
  Home,
  Bell,
  Printer,
  BrainCircuit,
  Code2,
} from "lucide-react";

// ==========================================
// 1. Inisialisasi Firebase
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "eduquest-production"; // Nama bebas untuk folder root di database

// ==========================================
// 2. Data Pertanyaan & Materi (Berlevel)
// ==========================================
const gameData = {
  react: {
    level1: {
      id: "react_level1",
      title: "Dasar React & JSX",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa mampu memahami arsitektur berbasis komponen dan sintaks JSX sebagai pondasi utama React.\n\n### MATERI DETAIL\n1. **Apa itu React?**: Sebuah library JavaScript yang dikembangkan oleh Facebook untuk membangun *User Interface* (UI) yang reaktif dan efisien.\n2. **Komponen**: Memecah UI menjadi bagian-bagian kecil (seperti Lego) yang mandiri. Komponen bisa berupa *Function* atau *Class*.\n3. **JSX (JavaScript XML)**: Memungkinkan kita menulis kode mirip HTML di dalam JavaScript. React akan mengubahnya menjadi elemen DOM yang nyata.\n4. **Props (Properties)**: Mekanisme pengiriman data searah dari Parent ke Child. Props bersifat *Immutable* (tidak bisa diubah oleh komponen yang menerimanya).",
      questions: [
        {
          question: "Apa fungsi utama dari React?",
          options: [
            "Membuat database",
            "Membangun antarmuka pengguna (UI)",
            "Mengelola server",
            "Mengamankan jaringan",
          ],
          answer: 1,
        },
        {
          question: "Apa itu JSX dalam React?",
          options: [
            "Format database",
            "Sintaks ekstensi JavaScript mirip HTML",
            "Sistem routing",
            "Library styling",
          ],
          answer: 1,
        },
        {
          question: "Bagaimana cara mengirim data ke komponen anak?",
          options: [
            "Menggunakan State",
            "Menggunakan Props",
            "Menggunakan Database",
            "Menggunakan URL",
          ],
          answer: 1,
        },
      ],
    },
    level2: {
      id: "react_level2",
      title: "State & Hooks",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami pengelolaan data dinamis dalam komponen menggunakan Hooks standar.\n\n### MATERI DETAIL\n1. **State**: Data privat dalam komponen yang jika nilainya berubah, React akan melakukan 're-render' secara otomatis untuk memperbarui tampilan.\n2. **useState**: Hook yang mengembalikan array berisi nilai state dan fungsi untuk mengubahnya. Contoh: `const [count, setCount] = useState(0)`.\n3. **useEffect**: Menangani *side effects* seperti pengambilan data dari API, berlangganan event, atau manipulasi DOM manual. Dependency array `[]` memastikan efek hanya berjalan sekali saat *mount*.\n4. **Aturan Hooks**: Harus dipanggil di level atas (bukan dalam loop/if) dan hanya boleh dipanggil dari komponen fungsi React.",
      questions: [
        {
          question: "Hook mana yang digunakan untuk menyimpan state lokal?",
          options: ["useEffect", "useContext", "useState", "useReducer"],
          answer: 2,
        },
        {
          question: "Aturan apa yang BENAR tentang Hooks di React?",
          options: [
            "Bisa dipanggil di dalam loop",
            "Hanya bisa dipanggil di level atas komponen",
            "Bisa digunakan di class component",
            "Tidak boleh memiliki nama awalan 'use'",
          ],
          answer: 1,
        },
        {
          question: "Hook apa yang cocok untuk mengambil data dari API?",
          options: ["useState", "useEffect", "useMemo", "useRef"],
          answer: 1,
        },
      ],
    },
    level3: {
      id: "react_level3",
      title: "Handling Events & Lists",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa mampu menangani interaksi pengguna dan merender data dinamis dari array secara efisien.\n\n### MATERI DETAIL\n1. **Event Handling**: Di React, event ditulis dalam *camelCase*. Contoh: `onClick={handleClick}`. Kita mengirim fungsi sebagai handler, bukan string.\n2. **Rendering Lists**: Menggunakan metode `.map()` untuk mengubah array data menjadi elemen JSX.\n3. **Pentingnya 'Key'**: String unik yang diberikan pada elemen dalam list. Key membantu algoritma *Diffing* React mengenali mana item yang berubah, ditambah, atau dihapus guna optimalisasi performa.\n4. **Conditional Rendering**: Teknik menampilkan elemen berdasarkan kondisi tertentu menggunakan operator logic `&&` atau ternary `? :`.",
      questions: [
        {
          question: "Attribute apa yang digunakan untuk menangani klik?",
          options: ["onclick", "onClick", "onPress", "clicked"],
          answer: 1,
        },
        {
          question: "Mengapa 'key' penting saat merender list?",
          options: [
            "Untuk styling",
            "Membantu React mengidentifikasi item yang berubah",
            "Untuk menyimpan data",
            "Menambah kecepatan",
          ],
          answer: 1,
        },
        {
          question: "Cara benar merender item jika kondisi true?",
          options: [
            "{condition && <Component />}",
            "{if condition then Component}",
            "{render Component}",
            "{condition ? null : <Component />}",
          ],
          answer: 0,
        },
      ],
    },
    level4: {
      id: "react_level4",
      title: "Form & Lifting State",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami sinkronisasi input form dengan state dan komunikasi antar komponen yang tidak searah.\n\n### MATERI DETAIL\n1. **Controlled Components**: Teknik di mana nilai input form dikunci oleh state React. Setiap ketikan akan memicu fungsi `onChange` yang memperbarui state.\n2. **Lifting State Up**: Jika dua komponen perlu mengakses data yang sama, kita memindahkan state tersebut ke parent terdekat (Common Ancestor) agar data bisa dikirim ke bawah sebagai props.\n3. **Single Source of Truth**: Konsep di mana data hanya dikelola di satu tempat untuk menghindari ketidaksinkronan tampilan.",
      questions: [
        {
          question: "Apa itu controlled component?",
          options: [
            "Input dikontrol DOM",
            "Input yang nilainya ditentukan state React",
            "Komponen tanpa state",
            "Komponen tidak bisa diklik",
          ],
          answer: 1,
        },
        {
          question: "Kapan kita harus melakukan 'Lifting State Up'?",
          options: [
            "Saat komponen terlalu besar",
            "Saat dua komponen anak perlu berbagi data",
            "Saat ingin menghapus state",
            "Saat menggunakan API",
          ],
          answer: 1,
        },
        {
          question: "Event handler untuk mendeteksi perubahan input?",
          options: ["onHover", "onKeyPress", "onChange", "onInput"],
          answer: 2,
        },
      ],
    },
    level5: {
      id: "react_level5",
      title: "Context API & Optimization",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMampu mengelola state global dan melakukan optimasi render untuk aplikasi skala menengah.\n\n### MATERI DETAIL\n1. **Context API**: Solusi untuk masalah *Prop Drilling* (mengirim props melewati banyak level komponen yang tidak membutuhkannya). Context menyediakan cara membagi data (seperti tema atau info user) secara global.\n2. **Provider & Consumer**: `Provider` membungkus komponen agar data tersedia, dan `useContext` digunakan oleh komponen anak untuk mengambil data tersebut.\n3. **React.memo**: Sebuah *Higher Order Component* yang membungkus komponen fungsional untuk mencegah render ulang jika props yang diterima tidak berubah.\n4. **useCallback & useMemo**: Hooks untuk menyimpan referensi fungsi atau hasil kalkulasi berat agar tidak dibuat ulang di setiap render.",
      questions: [
        {
          question: "Masalah apa yang diselesaikan Context API?",
          options: ["Bug JS", "Prop Drilling", "Database Error", "Koneksi API"],
          answer: 1,
        },
        {
          question: "Hook untuk mengonsumsi data dari Context?",
          options: ["useContext", "useReducer", "useState", "useProvider"],
          answer: 0,
        },
        {
          question: "Fungsi untuk mencegah render ulang jika props tetap?",
          options: [
            "React.stop()",
            "React.memo()",
            "React.fix()",
            "React.hook()",
          ],
          answer: 1,
        },
      ],
    },
  },
  database: {
    level1: {
      id: "database_level1",
      title: "Dasar Relasional (SQL)",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa mampu memahami arsitektur database relasional dan menggunakan perintah dasar SQL untuk manipulasi data sederhana.\n\n### MATERI DETAIL\n1. **Model Relasional**: Data diorganisir ke dalam tabel (relasi) yang terdiri dari baris (tuple) dan kolom (atribut). Setiap tabel memiliki skema yang tetap.\n2. **SQL (Structured Query Language)**: Bahasa deklaratif untuk mengelola RDBMS (Relational Database Management System) seperti MySQL, PostgreSQL, dan SQL Server.\n3. **Identitas Data (Keys)**:\n   - **Primary Key**: Kolom unik untuk mengidentifikasi setiap baris secara spesifik. Tidak boleh ada nilai ganda atau null.\n   - **Foreign Key**: Kolom yang merujuk pada Primary Key di tabel lain untuk menciptakan hubungan antar tabel.\n4. **DQL (Data Query Language)**: Perintah `SELECT` digunakan untuk mengambil data. Contoh: `SELECT nama, email FROM users;`.",
      questions: [
        {
          question: "Apa kepanjangan dari SQL?",
          options: [
            "System Query Logic",
            "Structured Question Language",
            "Structured Query Language",
            "Simple Query Logic",
          ],
          answer: 2,
        },
        {
          question: "Perintah SQL untuk mengambil data dari database?",
          options: ["GET", "SELECT", "FETCH", "PULL"],
          answer: 1,
        },
        {
          question: "Apa itu 'Primary Key'?",
          options: [
            "Kunci enkripsi",
            "Kolom bernilai unik untuk identitas baris",
            "Password admin",
            "Kolom pertama tabel",
          ],
          answer: 1,
        },
      ],
    },

    level2: {
      id: "database_level2",
      title: "NoSQL & Konsep Lanjutan",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami perbedaan paradigma antara SQL dan NoSQL serta kapan harus menggunakan database berbasis dokumen.\n\n### MATERI DETAIL\n1. **NoSQL (Not Only SQL)**: Database yang dirancang untuk data tidak terstruktur, skala besar, dan skema yang fleksibel.\n2. **Tipe NoSQL**:\n   - **Document Store**: Menyimpan data dalam format JSON/BSON (Contoh: MongoDB).\n   - **Key-Value**: Penyimpanan sederhana seperti kamus (Contoh: Redis).\n   - **Column Family & Graph**: Untuk data relasi kompleks atau analisis besar.\n3. **Skalabilitas**: NoSQL mendukung *Horizontal Scaling* (menambah lebih banyak server murah), sementara SQL biasanya menggunakan *Vertical Scaling* (meningkatkan spesifikasi satu server).\n4. **Fleksibilitas Skema**: Dalam NoSQL, setiap dokumen dalam satu koleksi bisa memiliki field yang berbeda (*Schema-less*).",
      questions: [
        {
          question: "Manakah yang merupakan contoh database NoSQL?",
          options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
          answer: 3,
        },
        {
          question: "Format data yang sering digunakan MongoDB?",
          options: [
            "Tabel HTML",
            "File teks murni",
            "Format mirip JSON",
            "Biner Excel",
          ],
          answer: 2,
        },
        {
          question: "Apa keunggulan utama database NoSQL?",
          options: [
            "Skema tabel kaku",
            "Relasi sangat kompleks",
            "Skema dinamis dan mudah diskalakan",
            "Hanya bisa offline",
          ],
          answer: 2,
        },
      ],
    },

    level3: {
      id: "database_level3",
      title: "SQL Joins & Relations",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa mampu merancang relasi antar tabel dan menggabungkan data dari berbagai sumber menggunakan teknik JOIN.\n\n### MATERI DETAIL\n1. **Tipe Relasi**:\n   - **One-to-Many**: Satu baris di tabel A berhubungan dengan banyak baris di tabel B (Contoh: Satu Penulis memiliki banyak Buku).\n   - **Many-to-Many**: Membutuhkan 'Junction Table' di tengahnya (Contoh: Mahasiswa dan Mata Kuliah).\n2. **Teknik JOIN**:\n   - **INNER JOIN**: Mengambil baris yang memiliki kecocokan di kedua tabel.\n   - **LEFT JOIN**: Mengambil semua baris dari tabel kiri dan baris yang cocok dari tabel kanan.\n   - **RIGHT JOIN**: Kebalikan dari LEFT JOIN.\n3. **Normalisasi**: Proses mengorganisir data untuk mengurangi redundansi (pengulangan data) dan meningkatkan integritas data.",
      questions: [
        {
          question:
            "Perintah untuk menggabungkan dua tabel berdasarkan kolom yang cocok?",
          options: ["MERGE", "COMBINE", "JOIN", "CONNECT"],
          answer: 2,
        },
        {
          question:
            "Jenis JOIN yang mengambil semua data tabel kiri meskipun tidak ada kecocokan di kanan?",
          options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"],
          answer: 2,
        },
        {
          question: "Relasi antara 'Penulis' dan 'Buku' biasanya adalah...",
          options: ["One-to-One", "One-to-Many", "Many-to-One", "Semua salah"],
          answer: 1,
        },
      ],
    },

    level4: {
      id: "database_level4",
      title: "Indexing & Performance",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMampu mengoptimalkan kecepatan query pada dataset besar melalui indexing dan fungsi agregasi.\n\n### MATERI DETAIL\n1. **Indexing**: Bekerja seperti indeks pada buku. Tanpa index, database harus melakukan *Full Table Scan* (memeriksa setiap baris). Dengan index, pencarian menjadi jauh lebih cepat namun memakan ruang disk lebih banyak.\n2. **Fungsi Agregasi**: Melakukan perhitungan pada sekumpulan nilai dan mengembalikan satu nilai tunggal.\n   - `COUNT()`: Menghitung jumlah baris.\n   - `SUM()`: Menjumlahkan nilai kolom numerik.\n   - `AVG()`: Menghitung rata-rata.\n3. **Execution Plan**: Cara database menganalisis bagaimana sebuah query akan dijalankan untuk mencari jalur tercepat.",
      questions: [
        {
          question: "Apa fungsi utama dari Index dalam database?",
          options: [
            "Hemat ruang disk",
            "Mempercepat pembacaan data",
            "Menghapus data otomatis",
            "Mengunci database",
          ],
          answer: 1,
        },
        {
          question: "Fungsi SQL untuk menghitung jumlah total baris?",
          options: ["SUM()", "TOTAL()", "COUNT()", "ADD()"],
          answer: 2,
        },
        {
          question: "Fungsi untuk mencari nilai rata-rata?",
          options: ["MEAN()", "AVG()", "MIDDLE()", "SUM()"],
          answer: 1,
        },
      ],
    },

    level5: {
      id: "database_level5",
      title: "Transaction & ACID",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami konsep integritas data tingkat tinggi melalui pengelolaan transaksi yang aman dan konsisten.\n\n### MATERI DETAIL\n1. **Transaksi**: Unit kerja logis yang berisi satu atau lebih perintah SQL. Prinsipnya: 'Berhasil semua atau gagal semua'.\n2. **Prinsip ACID**:\n   - **Atomicity**: Transaksi dilakukan secara utuh atau tidak sama sekali.\n   - **Consistency**: Memastikan data pindah dari satu status valid ke status valid lainnya.\n   - **Isolation**: Transaksi yang berjalan bersamaan tidak saling mengganggu.\n   - **Durability**: Sekali transaksi berhasil (Commit), perubahan akan kekal meski sistem mati.\n3. **Control Commands**:\n   - `COMMIT`: Menyimpan perubahan secara permanen.\n   - `ROLLBACK`: Membatalkan semua perubahan jika terjadi kesalahan di tengah transaksi.",
      questions: [
        {
          question: "Apa itu 'Rollback' dalam transaksi database?",
          options: [
            "Menghapus tabel",
            "Membatalkan perubahan jika terjadi eror",
            "Menyimpan data",
            "Mengupdate data",
          ],
          answer: 1,
        },
        {
          question:
            "Aspek ACID yang menjamin transaksi selesai utuh atau tidak sama sekali?",
          options: ["Atomicity", "Consistency", "Isolation", "Durability"],
          answer: 0,
        },
        {
          question: "Perintah untuk meresmikan perubahan dalam transaksi?",
          options: ["PUSH", "SAVE", "COMMIT", "FINISH"],
          answer: 2,
        },
      ],
    },
  },
  python: {
    level1: {
      id: "python_level1",
      title: "Dasar Sintaks Python",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa memahami filosofi penulisan kode Python, penggunaan variabel dinamis, dan aturan indentasi yang ketat.\n\n### MATERI DETAIL\n1. **Filosofi Python**: Menekankan keterbacaan kode (The Zen of Python). Berbeda dengan bahasa lain, Python menggunakan spasi/tab (Indentasi) untuk menentukan blok kode alih-alih kurung kurawal `{}`.\n2. **Variabel & Tipe Data**: Python adalah bahasa *dynamically typed*, artinya Anda tidak perlu mendeklarasikan tipe data secara eksplisit.\n   - `int` & `float`: Untuk perhitungan numerik.\n   - `str`: Teks yang diapit tanda petik tunggal atau ganda.\n   - `bool`: Nilai logika `True` atau `False`.\n3. **Output**: Fungsi `print()` digunakan untuk menampilkan data ke konsol.",
      questions: [
        {
          question: "Bagaimana cara mencetak teks ke layar di Python?",
          options: ["echo()", "console.log()", "print()", "printf()"],
          answer: 2,
        },
        {
          question: "Apa yang digunakan Python untuk menentukan blok kode?",
          options: [
            "Kurung kurawal {}",
            "Titik koma ;",
            "Indentasi (spasi/tab)",
            "Tanda kurung ()",
          ],
          answer: 2,
        },
        {
          question: "Manakah contoh penulisan variabel yang benar di Python?",
          options: ["var x = 5", "int x = 5", "x = 5", "$x = 5"],
          answer: 2,
        },
      ],
    },

    level2: {
      id: "python_level2",
      title: "Struktur Data & Kontrol",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMampu mengelola koleksi data kompleks dan mengatur alur eksekusi program menggunakan percabangan dan perulangan.\n\n### MATERI DETAIL\n1. **Koleksi Data**:\n   - **List**: Urutan data yang dapat diubah nilainya (*mutable*), didefinisikan dengan `[]`.\n   - **Tuple**: Urutan data yang permanen (*immutable*), didefinisikan dengan `()`.\n   - **Dictionary**: Pasangan kunci-nilai (*key-value*), didefinisikan dengan `{}`.\n2. **Kontrol Alur**:\n   - **If-Elif-Else**: Percabangan logika berdasarkan kondisi.\n   - **For Loops**: Iterasi melalui elemen dalam koleksi.\n   - **While Loops**: Perulangan selama kondisi tertentu bernilai benar.",
      questions: [
        {
          question: "Simbol mana yang digunakan untuk membuat sebuah List?",
          options: ["( )", "[ ]", "{ }", "< >"],
          answer: 1,
        },
        {
          question:
            "Keyword apa yang digunakan untuk membuat fungsi di Python?",
          options: ["function", "func", "def", "define"],
          answer: 2,
        },
        {
          question: "Apa perbedaan utama List dan Tuple?",
          options: [
            "List tidak bisa diubah, Tuple bisa",
            "List bisa diubah (mutable), Tuple tidak bisa (immutable)",
            "List hanya untuk angka",
            "Tidak ada perbedaan",
          ],
          answer: 1,
        },
      ],
    },

    level3: {
      id: "python_level3",
      title: "Functions & Modules",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami modularitas kode melalui pembuatan fungsi yang dapat digunakan kembali dan pemanfaatan library eksternal.\n\n### MATERI DETAIL\n1. **Definisi Fungsi**: Menggunakan keyword `def` diikuti nama fungsi dan parameter dalam kurung.\n2. **Scope**: Variabel yang didefinisikan di dalam fungsi bersifat lokal, sedangkan di luar fungsi bersifat global.\n3. **Return Statement**: Digunakan untuk mengirimkan kembali hasil pemrosesan fungsi ke pemanggilnya.\n4. **Modules**: Python memiliki ekosistem luas. Gunakan `import` untuk memanggil modul standar (seperti `math` untuk fungsi matematika atau `random` untuk angka acak) atau modul buatan sendiri.",
      questions: [
        {
          question: "Keyword untuk mengembalikan nilai dari fungsi?",
          options: ["give", "send", "return", "back"],
          answer: 2,
        },
        {
          question: "Cara mengambil library 'math' di Python?",
          options: [
            "using math",
            "include math",
            "import math",
            "require math",
          ],
          answer: 2,
        },
        {
          question: "Apa output dari: def x(): return 5; print(x())?",
          options: ["None", "5", "x", "Error"],
          answer: 1,
        },
      ],
    },

    level4: {
      id: "python_level4",
      title: "File Handling & Exceptions",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMahasiswa mampu berinteraksi dengan sistem penyimpanan file dan menangani error secara elegan agar program tidak berhenti tiba-tiba.\n\n### MATERI DETAIL\n1. **Operasi File**: Menggunakan fungsi `open()`.\n   - `'r'`: Membaca file.\n   - `'w'`: Menulis file (menghapus isi lama).\n   - `'a'`: Menambahkan data di akhir file (*append*).\n2. **Context Manager**: Penggunaan `with open(...)` sangat disarankan karena otomatis menutup file setelah selesai digunakan.\n3. **Exception Handling**: Menggunakan blok `try...except`. Jika kode di dalam `try` mengalami error, eksekusi akan berpindah ke blok `except` tanpa menghentikan seluruh program.",
      questions: [
        {
          question: "Mode untuk menulis (menimpa) ke dalam file?",
          options: ["'r'", "'w'", "'a'", "'x'"],
          answer: 1,
        },
        {
          question: "Blok kode yang menangkap eror agar program tetap jalan?",
          options: ["catch", "error", "except", "handle"],
          answer: 2,
        },
        {
          question: "Keyword untuk menutup file setelah dibuka?",
          options: ["close()", "stop()", "exit()", "end()"],
          answer: 0,
        },
      ],
    },

    level5: {
      id: "python_level5",
      title: "Object Oriented Programming (OOP)",
      minScoreToPass: 200,
      material:
        "### TUJUAN PEMBELAJARAN\nMemahami paradigma pemrograman berbasis objek untuk membangun aplikasi yang terstruktur, modular, dan mudah dipelihara.\n\n### MATERI DETAIL\n1. **Class vs Object**: *Class* adalah cetakan (blueprint), sedangkan *Object* adalah perwujudan nyata dari cetakan tersebut.\n2. **Constructor (`__init__`)**: Method khusus yang otomatis dipanggil saat objek dibuat untuk menginisialisasi atribut awal.\n3. **Atribut `self`**: Mewakili instance dari objek itu sendiri, digunakan untuk mengakses variabel atau method milik kelas tersebut.\n4. **Pilar OOP**:\n   - **Encapsulation**: Menyembunyikan data sensitif.\n   - **Inheritance**: Sebuah kelas dapat mewarisi properti dan perilaku dari kelas lain (Parent ke Child).",
      questions: [
        {
          question: "Keyword untuk membuat kelas di Python?",
          options: ["object", "Class", "class", "def"],
          answer: 2,
        },
        {
          question: "Apa kegunaan 'self' dalam method kelas?",
          options: [
            "Merujuk pada library",
            "Merujuk pada instance objek itu sendiri",
            "Hanya formalitas",
            "Menghapus data",
          ],
          answer: 1,
        },
        {
          question: "Method yang otomatis dijalankan saat objek dibuat?",
          options: ["__start__", "__init__", "__main__", "__new__"],
          answer: 1,
        },
      ],
    },
  },
  ai_basics: {
  level1: {
    id: "ai_level1",
    title: "Pengenalan Kecerdasan Buatan",
    minScoreToPass: 200,
    material:
      "### TUJUAN PEMBELAJARAN\nMahasiswa mampu mendefinisikan AI secara luas dan memahami peran krusial data serta algoritma dalam membangun sistem cerdas.\n\n### MATERI DETAIL\n1. **Definisi AI**: Simulasi proses kecerdasan manusia oleh sistem komputer. Ini mencakup proses belajar (*learning*), penalaran (*reasoning*), dan koreksi diri.\n2. **Machine Learning (ML)**: Jantung dari AI modern. Alih-alih diprogram dengan aturan kaku 'if-then', ML menggunakan metode statistik untuk membiarkan komputer 'menemukan' pola sendiri dari data.\n3. **Data sebagai Bahan Bakar**: AI membutuhkan dataset yang besar untuk mengenali pola. Semakin banyak dan bersih data yang diberikan, semakin akurat prediksi yang dihasilkan.\n4. **Algoritma**: Instruksi logis dan matematis yang digunakan model untuk memproses input menjadi output (prediksi).",
    questions: [
      { question: "Apa komponen terpenting agar model AI bisa belajar?", options: ["Baterai", "Data", "Monitor", "Casing PC"], answer: 1 },
      { question: "Cabang AI yang fokus pada pembelajaran mesin dari data disebut?", options: ["Cloud Computing", "Machine Learning", "Blockchain", "Cyber Security"], answer: 1 },
      { question: "Apa peran utama algoritma dalam AI?", options: ["Sebagai tempat penyimpanan", "Sebagai instruksi untuk menemukan pola", "Sebagai perangkat keras", "Sebagai koneksi internet"], answer: 1 },
    ],
  },

  level2: {
    id: "ai_level2",
    title: "Tipe Pembelajaran AI",
    minScoreToPass: 200,
    material:
      "### TUJUAN PEMBELAJARAN\nMemahami perbedaan antara metode pembelajaran terarah (Supervised) dan tidak terarah (Unsupervised), serta konsep dasar Deep Learning.\n\n### MATERI DETAIL\n1. **Supervised Learning**: Belajar dengan label. Kita memberikan input beserta jawaban benarnya. Contoh: Memberi ribuan foto kucing yang sudah dilabeli 'Kucing' agar AI mengenali ciri-cirinya.\n2. **Unsupervised Learning**: Belajar tanpa label. AI mencari struktur atau kesamaan tersembunyi dalam data sendiri (Clustering). Contoh: Mengelompokkan pelanggan berdasarkan perilaku belanja.\n3. **Deep Learning**: Subbidang ML yang menggunakan **Neural Networks** bertingkat banyak (multi-layered). Teknologi ini meniru cara kerja neuron di otak manusia untuk memproses data yang sangat kompleks seperti gambar dan suara.",
    questions: [
      { question: "Pembelajaran menggunakan data berlabel disebut?", options: ["Unsupervised Learning", "Supervised Learning", "Manual Learning", "Deep Scanning"], answer: 1 },
      { question: "Teknologi AI yang terinspirasi saraf otak manusia?", options: ["Hard Drive", "Central Processing", "Neural Networks", "Logic Gate"], answer: 2 },
      { question: "Contoh implementasi AI di kehidupan sehari-hari?", options: ["Mengetik di kertas", "Rekomendasi video YouTube", "Lampu manual", "Membaca buku cetak"], answer: 1 },
    ],
  },

  level3: {
    id: "ai_level3",
    title: "Natural Language Processing (NLP)",
    minScoreToPass: 200,
    material:
      "### TUJUAN PEMBELAJARAN\nMemahami bagaimana mesin memproses, menganalisis, dan menghasilkan bahasa manusia yang kompleks.\n\n### MATERI DETAIL\n1. **Konsep NLP**: Teknologi yang memungkinkan komputer berkomunikasi dengan manusia dalam bahasa alami (Inggris, Indonesia, dll).\n2. **Tokenization**: Langkah awal di mana kalimat dipecah menjadi unit terkecil (token), biasanya berupa kata atau sub-kata.\n3. **Sentiment Analysis**: Teknik untuk menentukan sikap emosional di balik teks (apakah review pelanggan bersifat positif, negatif, atau netral).\n4. **Machine Translation**: Penggunaan NLP untuk menerjemahkan teks dari satu bahasa ke bahasa lain secara otomatis (seperti Google Translate).",
    questions: [
      { question: "Bidang AI yang fokus pada teks dan suara?", options: ["Computer Vision", "NLP", "Robotics", "Blockchain"], answer: 1 },
      { question: "Proses memecah kalimat menjadi unit terkecil?", options: ["Breaking", "Splitting", "Tokenization", "Dividing"], answer: 2 },
      { question: "Contoh aplikasi NLP?", options: ["Kalkulator", "Google Translate", "Lampu sensor", "Rem otomatis"], answer: 1 },
    ],
  },

  level4: {
    id: "ai_level4",
    title: "Computer Vision",
    minScoreToPass: 200,
    material:
      "### TUJUAN PEMBELAJARAN\nMemahami cara kerja AI dalam mengekstrak informasi bermakna dari data visual seperti gambar dan video.\n\n### MATERI DETAIL\n1. **Definisi**: Memberikan indra penglihatan pada mesin. Komputer melihat gambar sebagai kumpulan angka (pixel).\n2. **Image Classification**: Menentukan kategori utama dalam sebuah gambar (Contoh: Ini foto 'Anjing').\n3. **Object Detection**: Tidak hanya mengenali, tapi juga menentukan lokasi objek menggunakan *bounding box* (Contoh: Mendeteksi lokasi pejalan kaki di jalan untuk mobil otonom).\n4. **Facial Recognition**: Mengidentifikasi identitas seseorang berdasarkan fitur wajah yang unik.",
    questions: [
      { question: "Kemampuan AI mengenali wajah di foto?", options: ["NLP", "Data Mining", "Computer Vision", "Audio Processing"], answer: 2 },
      { question: "Teknologi mobil otonom untuk deteksi objek?", options: ["Object Detection", "Sentiment Analysis", "Text Generation", "Sorting"], answer: 0 },
      { question: "Input utama dalam sistem Computer Vision?", options: ["Teks", "Data Suara", "Gambar atau Video", "Angka tabel"], answer: 2 },
    ],
  },

  level5: {
    id: "ai_level5",
    title: "Generative AI & Ethics",
    minScoreToPass: 200,
    material:
      "### TUJUAN PEMBELAJARAN\nMemahami revolusi AI generatif, cara kerja model bahasa besar (LLM), dan tanggung jawab etis dalam pengembangannya.\n\n### MATERI DETAIL\n1. **Generative AI**: Berbeda dengan AI tradisional yang hanya menganalisis, Gen-AI mampu **menciptakan** konten baru (teks, gambar realistis, hingga musik).\n2. **LLM (Large Language Model)**: Model yang dilatih dengan hampir seluruh teks di internet untuk memahami konteks dan menjawab pertanyaan secara manusiawi.\n3. **Isu Etika & Bias**: AI belajar dari data buatan manusia. Jika data tersebut mengandung prasangka, AI akan memproduksi jawaban yang tidak adil (**Bias**).\n4. **Hallucination**: Kondisi di mana AI memberikan jawaban yang terdengar meyakinkan tetapi secara faktual salah.",
    questions: [
      { question: "AI yang bisa membuat gambar dari teks?", options: ["Analytical AI", "Generative AI", "Static AI", "Old AI"], answer: 1 },
      { question: "Apa kepanjangan dari LLM?", options: ["Large Language Model", "Long Logic Machine", "Low Level Model", "List Language Mode"], answer: 0 },
      { question: "Risiko utama jika data pelatihan tidak beragam?", options: ["AI terlalu pintar", "AI menghasilkan Bias", "Baterai cepat habis", "Internet melambat"], answer: 1 },
    ],
  },
},
};

// ==========================================
// 3. Komponen Utama Aplikasi
// ==========================================
export default function App() {
  // State Autentikasi
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // State Profil User
  const [userProfile, setUserProfile] = useState(null);
  const [inputName, setInputName] = useState("");

  // State Navigasi
  const [currentView, setCurrentView] = useState("menu");

  // State Gameplay
  const [category, setCategory] = useState(null);
  const [levelKey, setLevelKey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // State Leaderboard Data
  const [leaderboardData, setLeaderboardData] = useState([]);

  // State Notifikasi
  const [unlockNotification, setUnlockNotification] = useState(null);

  // ------------------------------------------
  // Helper: Cek Kelulusan Kategori
  // ------------------------------------------
  const checkCategoryCompletion = (cat) => {
    if (!userProfile?.levelScores || !cat || !gameData[cat]) return false;
    const levels = Object.keys(gameData[cat]);
    // Mengecek apakah semua level di kategori ini sudah melewati batas minimal skor
    return levels.every((lvl) => {
      const levelId = gameData[cat][lvl].id;
      const minScore = gameData[cat][lvl].minScoreToPass;
      return (userProfile.levelScores[levelId] || 0) >= minScore;
    });
  };

  // ------------------------------------------
  // Efek 1: Autentikasi Firebase
  // ------------------------------------------
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // ------------------------------------------
  // Efek 2: Fetch Profil Pribadi & Leaderboard Publik
  // ------------------------------------------
  useEffect(() => {
    if (!user) return;

    // Listener Profil (Private Data) - Perbaikan Path 6 Segmen
    const profileRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      user.uid,
      "profile",
      "data",
    );
    const unsubProfile = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setLoadingAuth(false); // Mematikan loading saat data profil berhasil ditarik

          // Hanya pindah ke menu utama jika posisinya sedang di halaman setup profil
          setCurrentView((prev) => (prev === "profile_setup" ? "menu" : prev));
        } else {
          setCurrentView("profile_setup");
          setLoadingAuth(false);
        }
      },
      (error) => {
        console.error("Error fetching profile:", error);
        setLoadingAuth(false);
      },
    );

    // Listener Leaderboard (Public Data) - Path 5 Segmen (Koleksi)
    const leaderboardRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "global_leaderboard",
    );
    const unsubLeaderboard = onSnapshot(
      leaderboardRef,
      (snapshot) => {
        const lb = [];
        snapshot.forEach((doc) => {
          lb.push({ id: doc.id, ...doc.data() });
        });
        // Sortir secara lokal di memori
        lb.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
        setLeaderboardData(lb);
      },
      (error) => {
        console.error("Error fetching leaderboard:", error);
      },
    );

    return () => {
      unsubProfile();
      unsubLeaderboard();
    };
  }, [user]); // Menghapus currentView dari dependencies agar listener tidak dipanggil berulang kali

  // ------------------------------------------
  // Fungsi: Membuat Profil Baru
  // ------------------------------------------
  const handleSaveProfile = async () => {
    if (!inputName.trim() || !user) return;
    try {
      // Perbaikan Path 6 Segmen
      const profileRef = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "profile",
        "data",
      );
      const newProfile = {
        userName: inputName,
        totalXP: 0,
        unlockedLevels: [
          "react_level1",
          "database_level1",
          "python_level1",
          "ai_level1",
        ], // Buka level pertama dari setiap kategori
        levelScores: {}, // Tambahan: Menyimpan rekor skor tiap level
        createdAt: serverTimestamp(),
      };
      await setDoc(profileRef, newProfile);

      // Simpan ke leaderboard public - Path 6 Segmen
      const publicLbRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "global_leaderboard",
        user.uid,
      );
      await setDoc(publicLbRef, {
        userName: inputName,
        totalXP: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    }
  };

  // ------------------------------------------
  // Fungsi Alur Game
  // ------------------------------------------
  const selectCategory = (cat) => {
    setCategory(cat);
    setCurrentView("levels");
  };

  const selectLevel = (lvlKey) => {
    const levelId = gameData[category][lvlKey].id;
    if (!userProfile?.unlockedLevels?.includes(levelId)) return;

    setLevelKey(lvlKey);
    setCurrentView("material");
  };

  const startQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCurrentView("playing");
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null) return;

    const isCorrect =
      gameData[category][levelKey].questions[currentQuestionIndex].answer ===
      optionIndex;
    setSelectedAnswer(optionIndex);

    const earnedScore = isCorrect ? 100 : 0;
    if (isCorrect) setScore((prev) => prev + 100);

    setTimeout(() => {
      if (
        currentQuestionIndex <
        gameData[category][levelKey].questions.length - 1
      ) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(score + earnedScore);
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore) => {
    setCurrentView("result");
    setScore(finalScore);

    if (!user || !userProfile) return;

    const currentLevelInfo = gameData[category][levelKey];
    const isPassed = finalScore >= currentLevelInfo.minScoreToPass;
    const levelId = currentLevelInfo.id;

    try {
      let updatedUnlocked = [...userProfile.unlockedLevels];
      let newlyUnlocked = false;
      let nextLevelTitle = "";

      if (isPassed) {
        // Mengambil angka dari string "level1", "level2", dst
        const currentLevelNumber = parseInt(levelKey.replace("level", ""));
        const nextLevelKey = `level${currentLevelNumber + 1}`;

        // Cek apakah level selanjutnya memang ada di database gameData
        if (gameData[category][nextLevelKey]) {
          const nextLevelId = gameData[category][nextLevelKey].id;

          if (!updatedUnlocked.includes(nextLevelId)) {
            updatedUnlocked.push(nextLevelId);
            newlyUnlocked = true;
            nextLevelTitle = gameData[category][nextLevelKey].title;
          }
        }
      }

      // Cek status kelulusan kategori SEBELUM update skor
      const levelsInCategory = Object.keys(gameData[category]);
      const wasCategoryComplete = levelsInCategory.every((lvl) => {
        const lId = gameData[category][lvl].id;
        const mScore = gameData[category][lvl].minScoreToPass;
        return (userProfile.levelScores?.[lId] || 0) >= mScore;
      });

      // Perbaikan Bug: Mencegah farming XP dari level yang sama
      const previousScore = userProfile.levelScores?.[levelId] || 0;
      const scoreImprovement =
        finalScore > previousScore ? finalScore - previousScore : 0;
      const newTotalXP = userProfile.totalXP + scoreImprovement;

      let updatedLevelScores = { ...(userProfile.levelScores || {}) };
      if (scoreImprovement > 0) {
        updatedLevelScores[levelId] = finalScore;
      }

      // Perbaikan Path 6 Segmen
      const profileRef = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "profile",
        "data",
      );
      await setDoc(profileRef, {
        ...userProfile,
        totalXP: newTotalXP,
        unlockedLevels: updatedUnlocked,
        levelScores: updatedLevelScores,
      });

      // Update Leaderboard HANYA jika XP bertambah
      if (scoreImprovement > 0) {
        const publicLbRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "global_leaderboard",
          user.uid,
        );
        await setDoc(publicLbRef, {
          userName: userProfile.userName,
          totalXP: newTotalXP,
          updatedAt: serverTimestamp(),
        });
      }

      // Cek status kelulusan kategori SESUDAH update skor
      const isCategoryCompleteNow = levelsInCategory.every((lvl) => {
        const lId = gameData[category][lvl].id;
        const mScore = gameData[category][lvl].minScoreToPass;
        return (updatedLevelScores[lId] || 0) >= mScore;
      });

      const categoryNames = {
        react: "React.js",
        database: "Database",
        python: "Python",
        ai_basics: "Dasar AI", // sesuaikan dengan ID kategori Anda
      };

      // Tampilkan Notifikasi secara dinamis
      let notifMessage = null;
      if (isCategoryCompleteNow && !wasCategoryComplete) {
        // Mengambil nama kategori dari mapping, jika tidak ada pakai ID aslinya
        const displayName = categoryNames[category] || category;
        notifMessage = `Kategori ${displayName} Selesai! Piagam Terbuka.`;
      } else if (newlyUnlocked) {
        notifMessage = `Level Terbuka: ${nextLevelTitle}`;
      }

      if (notifMessage) {
        setUnlockNotification(notifMessage);
        setTimeout(() => {
          setUnlockNotification(null);
        }, 4000); // Hilang setelah 4 detik
      }
    } catch (error) {
      console.error("Gagal menyimpan progress:", error);
    }
  };

  // ==========================================
  // RENDER UI
  // ==========================================
  if (
    loadingAuth ||
    (user && !userProfile && currentView !== "profile_setup")
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg animate-pulse text-slate-300">
          Menyiapkan Petualangan...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center overflow-hidden font-sans text-slate-100 touch-pan-y">
      <div className="w-full max-w-md bg-slate-900 h-[100dvh] flex flex-col relative shadow-2xl overflow-y-auto">
        {/* Notifikasi Overlay */}
        {unlockNotification && (
          <div className="absolute top-20 left-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-slide-down border border-emerald-400/50">
            <div className="bg-white/20 p-2 rounded-full">
              {unlockNotification.includes("Kategori") ? (
                <Award className="w-6 h-6 text-white" />
              ) : (
                <Unlock className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm">
                {unlockNotification.includes("Kategori")
                  ? "Luar Biasa!"
                  : "Pencapaian Baru!"}
              </h4>
              <p className="text-xs text-emerald-100">{unlockNotification}</p>
            </div>
          </div>
        )}

        {currentView !== "profile_setup" && (
          <header className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur z-20 sticky top-0">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView("menu")}
            >
              <Brain className="w-6 h-6 text-emerald-400" />
              <h1 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Sineps
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-slate-200">
                {userProfile?.totalXP || 0} XP
              </span>
            </div>
          </header>
        )}

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {currentView === "profile_setup" && (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/50">
                <BookOpen className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Selamat Datang!</h2>
              <p className="text-slate-400 text-sm mb-8">
                SINEPS – Sistem Interaktif Nalar Algoritma & Pemrograman Siswa
                Siapa nama karaktermu untuk petualangan ini?
              </p>

              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Masukkan Username"
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 transition-colors text-center font-bold text-lg"
                maxLength={12}
              />

              <button
                onClick={handleSaveProfile}
                disabled={!inputName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
              >
                Mulai Bermain
              </button>
            </div>
          )}

          {currentView === "menu" && (
            <div className="p-6 flex flex-col pb-8">
              <div className="bg-gradient-to-br from-indigo-900/80 to-slate-800 p-5 rounded-2xl border border-indigo-500/30 mb-8 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs text-indigo-300 mb-1">
                    Total Pengalaman
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-3xl font-black text-white">
                      {userProfile?.totalXP || 0}{" "}
                      <span className="text-base font-normal text-indigo-200">
                        XP
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-400" /> Pilih Kategori
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => selectCategory("react")}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-blue-900/40 to-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                    <Code className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">
                      React.js
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      UI Framework Dasar
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button
                  onClick={() => selectCategory("database")}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-emerald-900/40 to-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400">
                    <Database className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">
                      Database
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">SQL & NoSQL</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button
                  onClick={() => selectCategory("python")}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-blue-900/40 to-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                    <Code2 className="w-8 h-8" />{" "}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">Python</h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Sintaks & Skrip
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => selectCategory("ai_basics")}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-purple-900/40 to-slate-800 border border-slate-700 hover:border-purple-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">
                      Dasar AI
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Konsep & Machine Learning
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {currentView === "levels" && (
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar pb-24">
              <button
                onClick={() => setCurrentView("menu")}
                className="text-sm text-slate-400 mb-6 flex items-center gap-1 hover:text-white w-fit"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Kembali
              </button>

              <h2 className="text-2xl font-bold mb-6 capitalize">
                Level: {category}
              </h2>

              <div className="space-y-4 mb-8">
                {["level1", "level2", "level3", "level4", "level5"].map(
                  (lvl, index) => {
                    const levelData = gameData[category][lvl];
                    const isUnlocked = userProfile?.unlockedLevels?.includes(
                      levelData.id,
                    );
                    const highScore =
                      userProfile?.levelScores?.[levelData.id] || 0;

                    return (
                      <button
                        key={lvl}
                        onClick={() => selectLevel(lvl)}
                        disabled={!isUnlocked}
                        className={`w-full relative rounded-2xl p-5 border transition-all text-left flex items-center gap-4
                        ${
                          isUnlocked
                            ? "bg-slate-800 border-slate-600 hover:border-slate-400 active:scale-95 cursor-pointer"
                            : "bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${isUnlocked ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-600"}`}
                        >
                          {isUnlocked ? (
                            <Unlock className="w-6 h-6" />
                          ) : (
                            <Lock className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-200">
                            Level {index + 1}
                          </h3>
                          <p
                            className={`text-sm ${isUnlocked ? "text-slate-400" : "text-slate-600"} mt-0.5`}
                          >
                            {levelData.title}
                          </p>
                        </div>
                        {isUnlocked && highScore > 0 && (
                          <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                            Skor: {highScore}
                          </div>
                        )}
                        {isUnlocked && (
                          <ChevronRight className="w-5 h-5 text-slate-500 ml-1" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Tombol Piagam Kelulusan */}
              {checkCategoryCompletion(category) && (
                <div className="mt-auto bg-gradient-to-br from-amber-900/40 to-slate-800 border border-amber-500/30 p-5 rounded-2xl text-center shadow-lg shadow-amber-900/20">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-slate-200 mb-1">
                    Kategori Selesai!
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Kamu telah menguasai semua materi di kategori ini.
                  </p>
                  <button
                    onClick={() => setCurrentView("certificate")}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-5 h-5" /> Lihat & Cetak Piagam
                  </button>
                </div>
              )}
            </div>
          )}

          {currentView === "certificate" && (
            <div className="flex-1 flex flex-col bg-slate-100 text-slate-800 print:bg-white relative z-50">
              {/* Desain Piagam */}
              <div
                id="certificate-area"
                className="flex-1 p-4 md:p-8 flex flex-col justify-center print:p-0 print:block"
              >
                <div className="w-full min-h-[450px] flex flex-col border-[8px] border-slate-300 p-2 relative bg-white shadow-2xl print:shadow-none print:border-[16px] print:border-slate-300 print:w-full print:h-full print:rounded-none">
                  <div className="absolute inset-0 border-[2px] border-amber-600/30 m-1 print:m-3 print:border-[4px]"></div>

                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4 print:p-12">
                    <Award className="w-16 h-16 text-amber-500 mb-4 print:w-28 print:h-28 print:mb-8" />

                    <h1 className="text-2xl md:text-3xl font-black font-serif text-slate-800 mb-2 tracking-widest uppercase print:text-5xl print:mb-4">
                      Piagam Kelulusan
                    </h1>
                    <p className="text-[10px] md:text-xs font-medium text-slate-500 mb-6 uppercase tracking-widest print:text-lg print:mb-12">
                      Sineps Master Class
                    </p>

                    <p className="text-sm md:text-base text-slate-600 mb-2 italic print:text-2xl print:mb-4">
                      Diberikan dengan bangga kepada:
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-600 mb-2 font-serif print:text-6xl print:mb-6">
                      {userProfile?.userName}
                    </h2>
                    <div className="w-48 h-0.5 bg-amber-600/30 mb-6 print:w-96 print:h-1 print:mb-12"></div>

                    <p className="text-xs md:text-sm text-slate-600 mb-3 px-4 print:text-xl print:mb-6 print:px-24">
                      Telah berhasil menyelesaikan seluruh materi dan ujian
                      dengan nilai memuaskan pada kategori:
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 uppercase px-6 py-2 md:py-3 bg-slate-50 rounded-lg border border-slate-200 print:text-4xl print:mb-16 print:py-4 print:px-12">
                      {category === "react"
                        ? "React.js Dasar & Lanjutan"
                        : category === "database"
                          ? "Database SQL & NoSQL"
                          : category === "python"
                            ? "Pemrograman Python Dasar"
                            : category === "ai_basics"
                              ? "Fundamental Kecerdasan Buatan"
                              : "Kategori Tidak Ditemukan"}
                    </h3>

                    <div className="mt-auto flex justify-between w-full px-2 items-end print:px-16 print:pb-8">
                      <div className="text-center">
                        <div className="w-20 md:w-28 h-0.5 bg-slate-400 mb-2 mx-auto print:w-48 print:h-1 print:mb-4"></div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase print:text-base">
                          Instruktur Sineps
                        </p>
                      </div>

                      <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/30 print:w-24 print:h-24 print:border-4">
                        <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-amber-600 print:w-12 print:h-12" />
                      </div>

                      <div className="text-center">
                        <div className="w-20 md:w-28 h-0.5 bg-slate-400 mb-2 mx-auto print:w-48 print:h-1 print:mb-4"></div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase print:text-base">
                          Tanggal Diterbitkan
                        </p>
                        <p className="text-[10px] md:text-xs text-slate-600 font-medium print:text-base">
                          {new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi (Tidak ikut dicetak) */}
              <div className="p-4 md:p-6 flex gap-3 no-print bg-slate-900 shrink-0">
                <button
                  onClick={() => setCurrentView("levels")}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  Kembali
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Cetak Piagam
                </button>
              </div>
            </div>
          )}

          {currentView === "material" && (
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold">Materi Persiapan</h2>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-8 shadow-xl flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold text-blue-200 mb-4 border-b border-slate-700 pb-2">
                  {gameData[category][levelKey].title}
                </h3>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {gameData[category][levelKey].material}
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 shrink-0"
              >
                Saya Paham, Mulai Kuis!
              </button>
            </div>
          )}

          {currentView === "playing" && (
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  Soal {currentQuestionIndex + 1} /{" "}
                  {gameData[category][levelKey].questions.length}
                </div>
                <div className="text-sm font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                  {score} XP
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 shadow-lg min-h-[120px] flex items-center">
                <h2 className="text-lg md:text-xl font-semibold leading-snug">
                  {
                    gameData[category][levelKey].questions[currentQuestionIndex]
                      .question
                  }
                </h2>
              </div>

              <div className="space-y-3 mt-auto mb-4">
                {gameData[category][levelKey].questions[
                  currentQuestionIndex
                ].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect =
                    index ===
                    gameData[category][levelKey].questions[currentQuestionIndex]
                      .answer;

                  let btnStyle =
                    "bg-slate-800 border-slate-700 hover:bg-slate-700";
                  if (selectedAnswer !== null) {
                    if (isCorrect)
                      btnStyle =
                        "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                    else if (isSelected)
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-100";
                    else btnStyle = "bg-slate-800 border-slate-800 opacity-40";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium ${btnStyle} ${selectedAnswer === null ? "active:scale-95 cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer !== null && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                        {selectedAnswer === index && !isCorrect && (
                          <AlertCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === "result" &&
            (() => {
              const minScore = gameData[category][levelKey].minScoreToPass;
              const isPassed = score >= minScore;

              return (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div
                    className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border-4 shadow-2xl ${isPassed ? "bg-emerald-500/20 border-emerald-400 shadow-emerald-500/30" : "bg-rose-500/20 border-rose-400 shadow-rose-500/30"}`}
                  >
                    {isPassed ? (
                      <Trophy className="w-12 h-12 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-12 h-12 text-rose-400" />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold mb-2">
                    {isPassed ? "Level Selesai!" : "Coba Lagi!"}
                  </h2>
                  <p className="text-slate-400 mb-8 max-w-[250px]">
                    {isPassed
                      ? "Luar biasa! Kamu memahami materi ini dengan baik."
                      : `Kamu butuh skor minimal ${minScore} untuk lulus.`}
                  </p>

                  <div className="bg-slate-800 border border-slate-700 w-full rounded-2xl p-6 mb-8 shadow-xl">
                    <p className="text-sm text-slate-400 mb-1">
                      Skor Level Ini
                    </p>
                    <p
                      className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${isPassed ? "from-emerald-400 to-teal-400" : "from-rose-400 to-orange-400"}`}
                    >
                      {score}
                    </p>
                  </div>

                  <div className="flex gap-3 w-full mt-auto mb-4">
                    <button
                      onClick={() => setCurrentView("levels")}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
                    >
                      Daftar Level
                    </button>
                    <button
                      onClick={() => setCurrentView("menu")}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                    >
                      Menu Utama
                    </button>
                  </div>
                </div>
              );
            })()}

          {currentView === "leaderboard" && (
            <div className="p-6 flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <Medal className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold">Global Leaderboard</h2>
                <button
                  onClick={() => setCurrentView("menu")}
                  className="ml-auto text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full hover:text-white"
                >
                  Tutup
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-6 pr-2">
                {leaderboardData.length === 0 ? (
                  <p className="text-center text-slate-500 mt-10">
                    Belum ada data skor.
                  </p>
                ) : (
                  leaderboardData.map((player, index) => {
                    const isMe = player.id === user?.uid;
                    let rankColor = "text-slate-400";
                    let rankBg = "bg-slate-800 border-slate-700";

                    if (index === 0) {
                      rankColor = "text-yellow-400";
                      rankBg = "bg-yellow-500/10 border-yellow-500/30";
                    } else if (index === 1) {
                      rankColor = "text-slate-300";
                      rankBg = "bg-slate-400/10 border-slate-400/30";
                    } else if (index === 2) {
                      rankColor = "text-amber-600";
                      rankBg = "bg-amber-600/10 border-amber-600/30";
                    }

                    if (isMe) rankBg += " ring-2 ring-blue-500/50";

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center p-4 rounded-2xl border ${rankBg} transition-all`}
                      >
                        <div className={`w-8 font-black text-lg ${rankColor}`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1 ml-2">
                          <p className="font-bold text-slate-200 flex items-center gap-2">
                            {player.userName}
                            {isMe && (
                              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-normal">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm">
                          {player.totalXP} XP
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {currentView === "profile_detail" &&
            (() => {
              // Logika Evaluasi Badge Dinamis
              const earnedBadges = [
                {
                  id: "first_step",
                  title: "Pelajar Baru",
                  icon: <Zap className="w-6 h-6" />,
                  desc: "Memulai petualangan Sineps",
                  color: "text-indigo-400",
                  bg: "bg-indigo-500/20",
                  achieved: true,
                },
              ];

              // --- BADGE KATEGORI (DIBERIKAN SAAT LEVEL TERAKHIR TERBUKA/LULUS) ---

              // 1. React Master (Lulus Level 5)
              if (
                userProfile?.unlockedLevels?.includes("react_level5") ||
                userProfile?.levelScores?.["react_level5"] >= 200
              ) {
                earnedBadges.push({
                  id: "react_expert",
                  title: "React Master",
                  icon: <Code className="w-6 h-6" />,
                  desc: "Menguasai ekosistem React.js",
                  color: "text-blue-400",
                  bg: "bg-blue-500/20",
                  achieved: true,
                });
              }

              // 2. Data Architect (Lulus Level 5)
              if (
                userProfile?.unlockedLevels?.includes("database_level5") ||
                userProfile?.levelScores?.["database_level5"] >= 200
              ) {
                earnedBadges.push({
                  id: "db_architect",
                  title: "Data Architect",
                  icon: <Database className="w-6 h-6" />,
                  desc: "Ahli Struktur Data & ACID",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/20",
                  achieved: true,
                });
              }

              // 3. Python Scriptor (Lulus Level 5)
              if (
                userProfile?.unlockedLevels?.includes("python_level5") ||
                userProfile?.levelScores?.["python_level5"] >= 200
              ) {
                earnedBadges.push({
                  id: "python_pro",
                  title: "Python Pro",
                  icon: <Code2 className="w-6 h-6" />,
                  desc: "Menguasai OOP & Logika Python",
                  color: "text-yellow-400", // Python identik dengan Kuning/Biru
                  bg: "bg-yellow-500/20",
                  achieved: true,
                });
              }

              // 4. AI Visionary (Lulus Level 5)
              if (
                userProfile?.unlockedLevels?.includes("ai_level5") ||
                userProfile?.levelScores?.["ai_level5"] >= 200
              ) {
                earnedBadges.push({
                  id: "ai_visionary",
                  title: "AI Visionary",
                  icon: <BrainCircuit className="w-6 h-6" />,
                  desc: "Memahami Masa Depan Generative AI",
                  color: "text-purple-400",
                  bg: "bg-purple-500/20",
                  achieved: true,
                });
              }

              // --- BADGE PENCAPAIAN XP ---

              if (userProfile?.totalXP >= 2500) {
                earnedBadges.push({
                  id: "xp_2500",
                  title: "Rising Star",
                  icon: <Star className="w-6 h-6" />,
                  desc: "Mengumpulkan 2500 XP",
                  color: "text-orange-400",
                  bg: "bg-orange-500/20",
                  achieved: true,
                });
              }

              if (userProfile?.totalXP >= 5500) {
                // Dinaikkan ke 5500 karena sekarang ada 20 level total
                earnedBadges.push({
                  id: "xp_5500",
                  title: "Grand Scholar",
                  icon: <Award className="w-6 h-6" />,
                  desc: "Legenda Sineps: 5500 XP",
                  color: "text-pink-400",
                  bg: "bg-pink-500/20",
                  achieved: true,
                });
              }

              // Perbaikan Bug: Mencegah error 'toDate is not a function' jika status write database sedang pending
              const joinDate =
                userProfile?.createdAt &&
                typeof userProfile.createdAt.toDate === "function"
                  ? userProfile.createdAt.toDate().toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Baru saja";

              return (
                <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setCurrentView("menu")}
                      className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-bold">Profil Pemain</h2>
                  </div>

                  {/* Kartu Identitas */}
                  <div className="flex-shrink-0 min-h-[100px] flex flex-col justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
                    {/* Background Icon - Ditambahkan 'inset-y-0' agar tetap di tengah secara vertikal */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none h-full flex items-center">
                      <ShieldCheck className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                      {/* Icon Profile - Diberi flex-shrink-0 agar lingkaran tidak lonjong saat layar sempit */}
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-500/50 rounded-2xl flex items-center justify-center border border-blue-500/50">
                        <User className="w-8 h-8 text-blue-400" />
                      </div>

                      <div className="min-w-0">
                        {" "}
                        {/* min-w-0 mencegah teks meluap/overflow */}
                        <h3 className="text-2xl font-bold text-white truncate">
                          {userProfile?.userName}
                        </h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> Bergabung {joinDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistik */}
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Statistik
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <Sparkles className="w-6 h-6 text-yellow-400 mb-2" />
                      <span className="text-2xl font-black">
                        {userProfile?.totalXP || 0}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Total XP
                      </span>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <Unlock className="w-6 h-6 text-emerald-400 mb-2" />
                      <span className="text-2xl font-black">
                        {userProfile?.unlockedLevels?.length || 0}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Level Terbuka
                      </span>
                    </div>
                  </div>

                  {/* Badges / Penghargaan */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Koleksi Badge
                    </h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                      {earnedBadges.length} Terkumpul
                    </span>
                  </div>

                  <div className="space-y-3 pb-8">
                    {earnedBadges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 p-4 rounded-2xl"
                      >
                        <div
                          className={`p-3 rounded-xl ${badge.bg} ${badge.color}`}
                        >
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200">
                            {badge.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {badge.desc}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Placeholder Badge yang belum didapat */}
                    {userProfile?.totalXP < 500 && (
                      <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl opacity-60 grayscale">
                        <div className="p-3 rounded-xl bg-slate-800 text-slate-600">
                          <Star className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-500">
                            Rising Star
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Kumpulkan 500 XP untuk membuka
                          </p>
                        </div>
                        <Lock className="w-4 h-4 text-slate-600 ml-auto" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
        </div>

        {/* Bottom Navigation Menu */}
        {["menu", "levels", "leaderboard", "profile_detail"].includes(
          currentView,
        ) && (
          <nav className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between items-center pb-safe z-30 shrink-0">
            <button
              onClick={() => setCurrentView("menu")}
              className={`flex flex-col items-center gap-1 transition-colors ${["menu", "levels"].includes(currentView) ? "text-blue-400" : "text-slate-500 hover:text-slate-400"}`}
            >
              <Home
                className={`w-6 h-6 ${["menu", "levels"].includes(currentView) ? "fill-blue-400/20" : ""}`}
              />
              <span className="text-[10px] font-medium">Beranda</span>
            </button>
            <button
              onClick={() => setCurrentView("leaderboard")}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === "leaderboard" ? "text-yellow-400" : "text-slate-500 hover:text-slate-400"}`}
            >
              <Trophy
                className={`w-6 h-6 ${currentView === "leaderboard" ? "fill-yellow-400/20" : ""}`}
              />
              <span className="text-[10px] font-medium">Peringkat</span>
            </button>
            <button
              onClick={() => setCurrentView("profile_detail")}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === "profile_detail" ? "text-emerald-400" : "text-slate-500 hover:text-slate-400"}`}
            >
              <User
                className={`w-6 h-6 ${currentView === "profile_detail" ? "fill-emerald-400/20" : ""}`}
              />
              <span className="text-[10px] font-medium">Profil</span>
            </button>
          </nav>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }

        /* Pengaturan Khusus untuk Mode Cetak (Print) */
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body, html { 
            background-color: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
          }
          .min-h-screen { background-color: white !important; display: block !important; }
          .max-w-md { max-width: 100% !important; box-shadow: none !important; height: auto !important; }
          .no-print { display: none !important; }
          header, nav { display: none !important; }
          
          #certificate-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            padding: 1.5cm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
          }
          /* Pastikan warna latar belakang ikut tercetak */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
