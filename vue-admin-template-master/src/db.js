import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_GkeqdTiDBC-ZcDs-eVmXfjODrd6kB2Q",
    authDomain: "backend-admin-vue.firebaseapp.com",
    projectId: "backend-admin-vue",
    storageBucket: "backend-admin-vue.appspot.com",
    messagingSenderId: "506803955466",
    appId: "1:506803955466:web:bd6a22e2803eea6a2e7cf3",
    measurementId: "G-XV728YW1VZ"
  };

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export {database}