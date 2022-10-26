import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ---------- firebase 인증모듈
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUR_ID,
};

// Initialize Firebase.
const app = initializeApp(firebaseConfig);
export const authService = getAuth(); // --- firebase 인증모듈

const auth = getAuth(app); // 파이서베이스 연동하기 위한 함수,
//소셜, 이메일+비번 로그인시 필요,

export { app, auth };

export const dbService = getFirestore(); // cloud firestore

export const storageService = getStorage(); // storage 사용 함수
