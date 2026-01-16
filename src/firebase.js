import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC3_44rzuSrnnQ3g2FdRhpt-mAEkvVvYes",
    authDomain: "mynews-78b49.firebaseapp.com",
    projectId: "mynews-78b49",
    storageBucket: "mynews-78b49.firebasestorage.app",
    messagingSenderId: "174202480228",
    appId: "1:174202480228:web:e43d61926125111d58e171",
    measurementId: "G-86S1X4B0X5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GithubAuthProvider();