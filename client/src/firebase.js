// client/src/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult 
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBagblSGTuJ_zt444smlvn-W3I2bZRKm6w",
    authDomain: "protrack-32598.firebaseapp.com",
    projectId: "protrack-32598",
    storageBucket: "protrack-32598.firebasestorage.app",
    messagingSenderId: "582578437245",
    appId: "1:582578437245:web:1583f1a1fc373cc20d0514"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithRedirect(auth, googleProvider);
};

const checkRedirectResult = () => {
  return getRedirectResult(auth);
};

export { auth, googleProvider, signInWithGoogle, checkRedirectResult };