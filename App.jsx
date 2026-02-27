import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  Brain, Database, Code, Trophy, ArrowRight, Loader2, Sparkles, 
  AlertCircle, User, BookOpen, Lock, Unlock, Medal, ChevronRight, CheckCircle2,
  Award, Star, Zap, Calendar, ShieldCheck, Home, Bell, Printer
} from 'lucide-react';

// ==========================================
// 1. Inisialisasi Firebase
// ==========================================
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'eduquest-v2-app';

// ==========================================
// 2. Data Pertanyaan & Materi (Berlevel)
// ==========================================
const gameData = {
  react: {
    level1: {
      id: 'react_level1',
      title: "Dasar React & JSX",
      minScoreToPass: 200, // Butuh 2 benar untuk lulus
      material: "React adalah library JavaScript untuk membangun antarmuka pengguna (UI). Konsep utamanya meliputi:\n\n1. Komponen: Elemen UI mandiri yang dapat digunakan ulang.\n2. JSX: Sintaks ekstensi JavaScript yang mirip HTML.\n3. Props: Cara mengirim data dari komponen induk (parent) ke komponen anak (child). Props bersifat read-only.",
      questions: [
        { question: "Apa fungsi utama dari React?", options: ["Membuat database", "Membangun antarmuka pengguna (UI)", "Mengelola server", "Mengamankan jaringan"], answer: 1 },
        { question: "Apa itu JSX dalam React?", options: ["Format database", "Sintaks ekstensi JavaScript mirip HTML", "Sistem routing", "Library styling"], answer: 1 },
        { question: "Bagaimana cara mengirim data ke komponen anak?", options: ["Menggunakan State", "Menggunakan Props", "Menggunakan Database", "Menggunakan URL"], answer: 1 }
      ]
    },
    level2: {
      id: 'react_level2',
      title: "State & Hooks",
      minScoreToPass: 200,
      material: "Hooks memungkinkan penggunaan state di Functional Component.\n\n1. useState: Digunakan untuk membuat dan mengelola state lokal (data yang bisa berubah dan memicu render ulang).\n2. useEffect: Digunakan untuk efek samping, seperti mengambil data dari API setelah komponen dimuat.\nAturan penting: Hooks hanya boleh dipanggil di level atas komponen.",
      questions: [
        { question: "Hook mana yang digunakan untuk menyimpan state lokal?", options: ["useEffect", "useContext", "useState", "useReducer"], answer: 2 },
        { question: "Aturan apa yang BENAR tentang Hooks di React?", options: ["Bisa dipanggil di dalam loop", "Hanya bisa dipanggil di level atas komponen", "Bisa digunakan di class component", "Tidak boleh memiliki nama awalan 'use'"], answer: 1 },
        { question: "Hook apa yang cocok untuk mengambil data dari API saat komponen pertama kali dimuat?", options: ["useState", "useEffect", "useMemo", "useRef"], answer: 1 }
      ]
    }
  },
  database: {
    level1: {
      id: 'database_level1',
      title: "Dasar Relasional (SQL)",
      minScoreToPass: 200,
      material: "Database Relasional menyimpan data dalam bentuk tabel.\n\n1. SQL (Structured Query Language): Bahasa standar untuk berinteraksi dengan database relasional.\n2. Primary Key: Kolom yang nilainya unik untuk setiap baris, digunakan sebagai identitas utama.\n3. SELECT: Perintah SQL untuk mengambil data dari tabel.",
      questions: [
        { question: "Apa kepanjangan dari SQL?", options: ["System Query Logic", "Structured Question Language", "Structured Query Language", "Simple Query Logic"], answer: 2 },
        { question: "Perintah SQL apa yang digunakan untuk mengambil data dari database?", options: ["GET", "SELECT", "FETCH", "PULL"], answer: 1 },
        { question: "Apa itu 'Primary Key'?", options: ["Kunci mengenkripsi database", "Kolom bernilai unik untuk identitas baris", "Password admin", "Kolom pertama tabel"], answer: 1 }
      ]
    },
    level2: {
      id: 'database_level2',
      title: "NoSQL & Konsep Lanjutan",
      minScoreToPass: 200,
      material: "NoSQL (Not Only SQL) adalah tipe database yang tidak menggunakan model tabel relasional yang kaku.\n\n1. Dokumen: Data sering disimpan dalam format JSON (misal: MongoDB).\n2. Fleksibilitas: Skema data dinamis, cocok untuk data tidak terstruktur.\n3. Skalabilitas: Lebih mudah diskalakan secara horizontal (menambah server) dibanding SQL tradisional.",
      questions: [
        { question: "Manakah yang merupakan contoh database NoSQL?", options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"], answer: 3 },
        { question: "Dalam format apa database dokumen (seperti MongoDB) sering menyimpan data?", options: ["Tabel HTML", "File teks murni", "Format mirip JSON", "Biner Excel"], answer: 2 },
        { question: "Apa keunggulan utama database NoSQL?", options: ["Skema tabel yang sangat kaku", "Relasi data yang sangat kompleks", "Skema dinamis dan mudah diskalakan", "Hanya bisa dijalankan secara offline"], answer: 2 }
      ]
    }
  }
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
  const [inputName, setInputName] = useState('');
  
  // State Navigasi
  const [currentView, setCurrentView] = useState('menu'); 
  
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
    return levels.every(lvl => {
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
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
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
    const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
        setLoadingAuth(false); // Mematikan loading saat data profil berhasil ditarik
        
        // Hanya pindah ke menu utama jika posisinya sedang di halaman setup profil
        setCurrentView((prev) => prev === 'profile_setup' ? 'menu' : prev);
      } else {
        setCurrentView('profile_setup');
        setLoadingAuth(false);
      }
    }, (error) => {
      console.error("Error fetching profile:", error);
      setLoadingAuth(false);
    });

    // Listener Leaderboard (Public Data) - Path 5 Segmen (Koleksi)
    const leaderboardRef = collection(db, 'artifacts', appId, 'public', 'data', 'global_leaderboard');
    const unsubLeaderboard = onSnapshot(leaderboardRef, (snapshot) => {
      const lb = [];
      snapshot.forEach((doc) => {
        lb.push({ id: doc.id, ...doc.data() });
      });
      // Sortir secara lokal di memori
      lb.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
      setLeaderboardData(lb);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
    });

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
      const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
      const newProfile = {
        userName: inputName,
        totalXP: 0,
        unlockedLevels: ['react_level1', 'database_level1'], 
        levelScores: {}, // Tambahan: Menyimpan rekor skor tiap level
        createdAt: serverTimestamp()
      };
      await setDoc(profileRef, newProfile);
      
      // Simpan ke leaderboard public - Path 6 Segmen
      const publicLbRef = doc(db, 'artifacts', appId, 'public', 'data', 'global_leaderboard', user.uid);
      await setDoc(publicLbRef, {
        userName: inputName,
        totalXP: 0,
        updatedAt: serverTimestamp()
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
    setCurrentView('levels');
  };

  const selectLevel = (lvlKey) => {
    const levelId = gameData[category][lvlKey].id;
    if (!userProfile?.unlockedLevels?.includes(levelId)) return;
    
    setLevelKey(lvlKey);
    setCurrentView('material');
  };

  const startQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCurrentView('playing');
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null) return;
    
    const isCorrect = gameData[category][levelKey].questions[currentQuestionIndex].answer === optionIndex;
    setSelectedAnswer(optionIndex);

    const earnedScore = isCorrect ? 100 : 0;
    if (isCorrect) setScore(prev => prev + 100);

    setTimeout(() => {
      if (currentQuestionIndex < gameData[category][levelKey].questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(score + earnedScore);
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore) => {
    setCurrentView('result');
    setScore(finalScore);

    if (!user || !userProfile) return;

    const currentLevelInfo = gameData[category][levelKey];
    const isPassed = finalScore >= currentLevelInfo.minScoreToPass;
    const levelId = currentLevelInfo.id;
    
    try {
      let updatedUnlocked = [...userProfile.unlockedLevels];
      let newlyUnlocked = false;
      let nextLevelTitle = "";
      
      if (isPassed && levelKey === 'level1') {
        const nextLevelId = gameData[category]['level2'].id;
        if (!updatedUnlocked.includes(nextLevelId)) {
          updatedUnlocked.push(nextLevelId);
          newlyUnlocked = true;
          nextLevelTitle = gameData[category]['level2'].title;
        }
      }

      // Cek status kelulusan kategori SEBELUM update skor
      const levelsInCategory = Object.keys(gameData[category]);
      const wasCategoryComplete = levelsInCategory.every(lvl => {
        const lId = gameData[category][lvl].id;
        const mScore = gameData[category][lvl].minScoreToPass;
        return (userProfile.levelScores?.[lId] || 0) >= mScore;
      });

      // Perbaikan Bug: Mencegah farming XP dari level yang sama
      const previousScore = userProfile.levelScores?.[levelId] || 0;
      const scoreImprovement = finalScore > previousScore ? finalScore - previousScore : 0;
      const newTotalXP = userProfile.totalXP + scoreImprovement;
      
      let updatedLevelScores = { ...(userProfile.levelScores || {}) };
      if (scoreImprovement > 0) {
        updatedLevelScores[levelId] = finalScore;
      }

      // Perbaikan Path 6 Segmen
      const profileRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
      await setDoc(profileRef, {
        ...userProfile,
        totalXP: newTotalXP,
        unlockedLevels: updatedUnlocked,
        levelScores: updatedLevelScores
      });

      // Update Leaderboard HANYA jika XP bertambah
      if (scoreImprovement > 0) {
        const publicLbRef = doc(db, 'artifacts', appId, 'public', 'data', 'global_leaderboard', user.uid);
        await setDoc(publicLbRef, {
          userName: userProfile.userName,
          totalXP: newTotalXP,
          updatedAt: serverTimestamp()
        });
      }

      // Cek status kelulusan kategori SESUDAH update skor
      const isCategoryCompleteNow = levelsInCategory.every(lvl => {
        const lId = gameData[category][lvl].id;
        const mScore = gameData[category][lvl].minScoreToPass;
        return (updatedLevelScores[lId] || 0) >= mScore;
      });

      // Tampilkan Notifikasi secara dinamis
      let notifMessage = null;
      if (isCategoryCompleteNow && !wasCategoryComplete) {
        notifMessage = `Kategori ${category === 'react' ? 'React.js' : 'Database'} Selesai! Piagam Terbuka.`;
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
  if (loadingAuth || (user && !userProfile && currentView !== 'profile_setup')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg animate-pulse text-slate-300">Menyiapkan Petualangan...</p>
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
              {unlockNotification.includes('Kategori') ? (
                <Award className="w-6 h-6 text-white" />
              ) : (
                <Unlock className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm">
                {unlockNotification.includes('Kategori') ? 'Luar Biasa!' : 'Pencapaian Baru!'}
              </h4>
              <p className="text-xs text-emerald-100">{unlockNotification}</p>
            </div>
          </div>
        )}

        {currentView !== 'profile_setup' && (
          <header className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur z-20 sticky top-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('menu')}>
              <Brain className="w-6 h-6 text-emerald-400" />
              <h1 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                EduQuest
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-slate-200">{userProfile?.totalXP || 0} XP</span>
            </div>
          </header>
        )}

        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {currentView === 'profile_setup' && (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/50">
                <User className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Selamat Datang!</h2>
              <p className="text-slate-400 text-sm mb-8">Siapa nama panggilanmu untuk petualangan ini?</p>
              
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

          {currentView === 'menu' && (
            <div className="p-6 flex flex-col pb-8">
              <div className="bg-gradient-to-br from-indigo-900/80 to-slate-800 p-5 rounded-2xl border border-indigo-500/30 mb-8 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs text-indigo-300 mb-1">Total Pengalaman</p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-3xl font-black text-white">{userProfile?.totalXP || 0} <span className="text-base font-normal text-indigo-200">XP</span></span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-400" /> Pilih Kategori
              </h2>

              <div className="space-y-4">
                <button 
                  onClick={() => selectCategory('react')}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-blue-900/40 to-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                    <Code className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">React.js</h3>
                    <p className="text-sm text-slate-400 mt-0.5">UI Framework Dasar</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>

                <button 
                  onClick={() => selectCategory('database')}
                  className="w-full relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-emerald-900/40 to-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all text-left flex items-center gap-4 active:scale-95"
                >
                  <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400">
                    <Database className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-100">Database</h3>
                    <p className="text-sm text-slate-400 mt-0.5">SQL & NoSQL</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {currentView === 'levels' && (
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar pb-24">
              <button onClick={() => setCurrentView('menu')} className="text-sm text-slate-400 mb-6 flex items-center gap-1 hover:text-white w-fit">
                <ArrowRight className="w-4 h-4 rotate-180" /> Kembali
              </button>
              
              <h2 className="text-2xl font-bold mb-6 capitalize">Level: {category}</h2>

              <div className="space-y-4 mb-8">
                {['level1', 'level2'].map((lvl, index) => {
                  const levelData = gameData[category][lvl];
                  const isUnlocked = userProfile?.unlockedLevels?.includes(levelData.id);
                  const highScore = userProfile?.levelScores?.[levelData.id] || 0;
                  
                  return (
                    <button 
                      key={lvl}
                      onClick={() => selectLevel(lvl)}
                      disabled={!isUnlocked}
                      className={`w-full relative rounded-2xl p-5 border transition-all text-left flex items-center gap-4
                        ${isUnlocked 
                          ? 'bg-slate-800 border-slate-600 hover:border-slate-400 active:scale-95 cursor-pointer' 
                          : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}`}
                    >
                      <div className={`p-3 rounded-full ${isUnlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                        {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-200">Level {index + 1}</h3>
                        <p className={`text-sm ${isUnlocked ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>{levelData.title}</p>
                      </div>
                      {isUnlocked && highScore > 0 && (
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                          Skor: {highScore}
                        </div>
                      )}
                      {isUnlocked && <ChevronRight className="w-5 h-5 text-slate-500 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Tombol Piagam Kelulusan */}
              {checkCategoryCompletion(category) && (
                <div className="mt-auto bg-gradient-to-br from-amber-900/40 to-slate-800 border border-amber-500/30 p-5 rounded-2xl text-center shadow-lg shadow-amber-900/20">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-slate-200 mb-1">Kategori Selesai!</h3>
                  <p className="text-xs text-slate-400 mb-4">Kamu telah menguasai semua materi di kategori ini.</p>
                  <button 
                    onClick={() => setCurrentView('certificate')}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-5 h-5" /> Lihat & Cetak Piagam
                  </button>
                </div>
              )}
            </div>
          )}

          {currentView === 'certificate' && (
            <div className="flex-1 flex flex-col bg-slate-100 text-slate-800 print:bg-white relative z-50">
              {/* Desain Piagam */}
              <div id="certificate-area" className="flex-1 p-4 md:p-8 flex flex-col justify-center print:p-0 print:block">
                <div className="w-full min-h-[450px] flex flex-col border-[8px] border-slate-300 p-2 relative bg-white shadow-2xl print:shadow-none print:border-[16px] print:border-slate-300 print:w-full print:h-full print:rounded-none">
                  <div className="absolute inset-0 border-[2px] border-amber-600/30 m-1 print:m-3 print:border-[4px]"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4 print:p-12">
                    <Award className="w-16 h-16 text-amber-500 mb-4 print:w-28 print:h-28 print:mb-8" />
                    
                    <h1 className="text-2xl md:text-3xl font-black font-serif text-slate-800 mb-2 tracking-widest uppercase print:text-5xl print:mb-4">
                      Piagam Kelulusan
                    </h1>
                    <p className="text-[10px] md:text-xs font-medium text-slate-500 mb-6 uppercase tracking-widest print:text-lg print:mb-12">
                      EduQuest Master Class
                    </p>

                    <p className="text-sm md:text-base text-slate-600 mb-2 italic print:text-2xl print:mb-4">Diberikan dengan bangga kepada:</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-600 mb-2 font-serif print:text-6xl print:mb-6">
                      {userProfile?.userName}
                    </h2>
                    <div className="w-48 h-0.5 bg-amber-600/30 mb-6 print:w-96 print:h-1 print:mb-12"></div>

                    <p className="text-xs md:text-sm text-slate-600 mb-3 px-4 print:text-xl print:mb-6 print:px-24">
                      Telah berhasil menyelesaikan seluruh materi dan ujian dengan nilai memuaskan pada kategori:
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-8 uppercase px-6 py-2 md:py-3 bg-slate-50 rounded-lg border border-slate-200 print:text-4xl print:mb-16 print:py-4 print:px-12">
                      {category === 'react' ? 'React.js Dasar & Lanjutan' : 'Database SQL & NoSQL'}
                    </h3>

                    <div className="mt-auto flex justify-between w-full px-2 items-end print:px-16 print:pb-8">
                      <div className="text-center">
                        <div className="w-20 md:w-28 h-0.5 bg-slate-400 mb-2 mx-auto print:w-48 print:h-1 print:mb-4"></div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase print:text-base">Instruktur EduQuest</p>
                      </div>
                      
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/30 print:w-24 print:h-24 print:border-4">
                        <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-amber-600 print:w-12 print:h-12" />
                      </div>
                      
                      <div className="text-center">
                        <div className="w-20 md:w-28 h-0.5 bg-slate-400 mb-2 mx-auto print:w-48 print:h-1 print:mb-4"></div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase print:text-base">Tanggal Diterbitkan</p>
                        <p className="text-[10px] md:text-xs text-slate-600 font-medium print:text-base">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi (Tidak ikut dicetak) */}
              <div className="p-4 md:p-6 flex gap-3 no-print bg-slate-900 shrink-0">
                <button 
                  onClick={() => setCurrentView('levels')} 
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

          {currentView === 'material' && (
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

          {currentView === 'playing' && (
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  Soal {currentQuestionIndex + 1} / {gameData[category][levelKey].questions.length}
                </div>
                <div className="text-sm font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                  {score} XP
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 shadow-lg min-h-[120px] flex items-center">
                <h2 className="text-lg md:text-xl font-semibold leading-snug">
                  {gameData[category][levelKey].questions[currentQuestionIndex].question}
                </h2>
              </div>

              <div className="space-y-3 mt-auto mb-4">
                {gameData[category][levelKey].questions[currentQuestionIndex].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === gameData[category][levelKey].questions[currentQuestionIndex].answer;
                  
                  let btnStyle = "bg-slate-800 border-slate-700 hover:bg-slate-700";
                  if (selectedAnswer !== null) {
                    if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                    else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-100";
                    else btnStyle = "bg-slate-800 border-slate-800 opacity-40";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium ${btnStyle} ${selectedAnswer === null ? 'active:scale-95 cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {selectedAnswer === index && !isCorrect && <AlertCircle className="w-5 h-5 text-rose-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'result' && (() => {
            const minScore = gameData[category][levelKey].minScoreToPass;
            const isPassed = score >= minScore;

            return (
              <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border-4 shadow-2xl ${isPassed ? 'bg-emerald-500/20 border-emerald-400 shadow-emerald-500/30' : 'bg-rose-500/20 border-rose-400 shadow-rose-500/30'}`}>
                  {isPassed ? <Trophy className="w-12 h-12 text-emerald-400" /> : <AlertCircle className="w-12 h-12 text-rose-400" />}
                </div>
                
                <h2 className="text-3xl font-bold mb-2">{isPassed ? 'Level Selesai!' : 'Coba Lagi!'}</h2>
                <p className="text-slate-400 mb-8 max-w-[250px]">
                  {isPassed ? 'Luar biasa! Kamu memahami materi ini dengan baik.' : `Kamu butuh skor minimal ${minScore} untuk lulus.`}
                </p>

                <div className="bg-slate-800 border border-slate-700 w-full rounded-2xl p-6 mb-8 shadow-xl">
                  <p className="text-sm text-slate-400 mb-1">Skor Level Ini</p>
                  <p className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${isPassed ? 'from-emerald-400 to-teal-400' : 'from-rose-400 to-orange-400'}`}>
                    {score}
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-auto mb-4">
                  <button 
                    onClick={() => setCurrentView('levels')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
                  >
                    Daftar Level
                  </button>
                  <button 
                    onClick={() => setCurrentView('menu')}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                  >
                    Menu Utama
                  </button>
                </div>
              </div>
            );
          })()}

          {currentView === 'leaderboard' && (
            <div className="p-6 flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <Medal className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold">Global Leaderboard</h2>
                <button onClick={() => setCurrentView('menu')} className="ml-auto text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full hover:text-white">
                  Tutup
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pb-6 pr-2">
                {leaderboardData.length === 0 ? (
                  <p className="text-center text-slate-500 mt-10">Belum ada data skor.</p>
                ) : (
                  leaderboardData.map((player, index) => {
                    const isMe = player.id === user?.uid;
                    let rankColor = "text-slate-400";
                    let rankBg = "bg-slate-800 border-slate-700";
                    
                    if (index === 0) { rankColor = "text-yellow-400"; rankBg = "bg-yellow-500/10 border-yellow-500/30"; }
                    else if (index === 1) { rankColor = "text-slate-300"; rankBg = "bg-slate-400/10 border-slate-400/30"; }
                    else if (index === 2) { rankColor = "text-amber-600"; rankBg = "bg-amber-600/10 border-amber-600/30"; }

                    if (isMe) rankBg += " ring-2 ring-blue-500/50";

                    return (
                      <div key={player.id} className={`flex items-center p-4 rounded-2xl border ${rankBg} transition-all`}>
                        <div className={`w-8 font-black text-lg ${rankColor}`}>#{index + 1}</div>
                        <div className="flex-1 ml-2">
                          <p className="font-bold text-slate-200 flex items-center gap-2">
                            {player.userName}
                            {isMe && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-normal">You</span>}
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

          {currentView === 'profile_detail' && (() => {
            // Logika Evaluasi Badge Dinamis
            const earnedBadges = [
              { id: 'first_step', title: 'Pelajar Baru', icon: <Zap className="w-6 h-6" />, desc: 'Memulai petualangan EduQuest', color: 'text-indigo-400', bg: 'bg-indigo-500/20', achieved: true }
            ];

            if (userProfile?.unlockedLevels?.includes('react_level2')) {
              earnedBadges.push({ id: 'react_rookie', title: 'React Rookie', icon: <Code className="w-6 h-6" />, desc: 'Lulus Dasar React', color: 'text-blue-400', bg: 'bg-blue-500/20', achieved: true });
            }
            if (userProfile?.unlockedLevels?.includes('database_level2')) {
              earnedBadges.push({ id: 'db_explorer', title: 'Data Explorer', icon: <Database className="w-6 h-6" />, desc: 'Lulus Dasar SQL', color: 'text-emerald-400', bg: 'bg-emerald-500/20', achieved: true });
            }
            if (userProfile?.totalXP >= 500) {
              earnedBadges.push({ id: 'xp_500', title: 'Rising Star', icon: <Star className="w-6 h-6" />, desc: 'Mengumpulkan 500 XP', color: 'text-yellow-400', bg: 'bg-yellow-500/20', achieved: true });
            }
            if (userProfile?.totalXP >= 1000) {
              earnedBadges.push({ id: 'xp_1000', title: 'Scholar', icon: <Award className="w-6 h-6" />, desc: 'Mengumpulkan 1000 XP', color: 'text-purple-400', bg: 'bg-purple-500/20', achieved: true });
            }

            // Perbaikan Bug: Mencegah error 'toDate is not a function' jika status write database sedang pending
            const joinDate = userProfile?.createdAt && typeof userProfile.createdAt.toDate === 'function'
              ? userProfile.createdAt.toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) 
              : 'Baru saja';

            return (
              <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setCurrentView('menu')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition text-slate-400 hover:text-white">
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h2 className="text-xl font-bold">Profil Pemain</h2>
                </div>

                {/* Kartu Identitas */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-blue-500/50 rounded-2xl flex items-center justify-center border border-blue-500/50">
                      <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{userProfile?.userName}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> Bergabung {joinDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statistik */}
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Statistik</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-6 h-6 text-yellow-400 mb-2" />
                    <span className="text-2xl font-black">{userProfile?.totalXP || 0}</span>
                    <span className="text-xs text-slate-400 mt-1">Total XP</span>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <Unlock className="w-6 h-6 text-emerald-400 mb-2" />
                    <span className="text-2xl font-black">{userProfile?.unlockedLevels?.length || 0}</span>
                    <span className="text-xs text-slate-400 mt-1">Level Terbuka</span>
                  </div>
                </div>

                {/* Badges / Penghargaan */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Koleksi Badge</h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                    {earnedBadges.length} Terkumpul
                  </span>
                </div>
                
                <div className="space-y-3 pb-8">
                  {earnedBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
                      <div className={`p-3 rounded-xl ${badge.bg} ${badge.color}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">{badge.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{badge.desc}</p>
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
                        <h4 className="font-bold text-slate-500">Rising Star</h4>
                        <p className="text-xs text-slate-600 mt-0.5">Kumpulkan 500 XP untuk membuka</p>
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
        {['menu', 'levels', 'leaderboard', 'profile_detail'].includes(currentView) && (
          <nav className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between items-center pb-safe z-30 shrink-0">
            <button 
              onClick={() => setCurrentView('menu')} 
              className={`flex flex-col items-center gap-1 transition-colors ${['menu', 'levels'].includes(currentView) ? 'text-blue-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <Home className={`w-6 h-6 ${['menu', 'levels'].includes(currentView) ? 'fill-blue-400/20' : ''}`} />
              <span className="text-[10px] font-medium">Beranda</span>
            </button>
            <button 
              onClick={() => setCurrentView('leaderboard')} 
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'leaderboard' ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <Trophy className={`w-6 h-6 ${currentView === 'leaderboard' ? 'fill-yellow-400/20' : ''}`} />
              <span className="text-[10px] font-medium">Peringkat</span>
            </button>
            <button 
              onClick={() => setCurrentView('profile_detail')} 
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'profile_detail' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <User className={`w-6 h-6 ${currentView === 'profile_detail' ? 'fill-emerald-400/20' : ''}`} />
              <span className="text-[10px] font-medium">Profil</span>
            </button>
          </nav>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />
    </div>
  );
}