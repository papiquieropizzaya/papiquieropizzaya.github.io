// Importar librerías de Firebase compatibles con CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDhHFpCkHJ5_ddgVUH-_h1hWKcRTn15y0A",
    authDomain: "papiquieropizzaya-9fafa.firebaseapp.com",
    projectId: "papiquieropizzaya-9fafa",
    storageBucket: "papiquieropizzaya-9fafa.firebasestorage.app",
    messagingSenderId: "473488632238",
    appId: "1:473488632238:web:51832e8c81f28436a5403f",
    measurementId: "G-NWEXM5JQKK"
  };
// ---------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Exportamos las funciones para usarlas en otros archivos
export { db, auth, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, signInWithEmailAndPassword, onAuthStateChanged, signOut };
