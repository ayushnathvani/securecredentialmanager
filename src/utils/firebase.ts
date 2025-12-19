// Commented out temporarily to fix app crash - uncomment after installing Firebase
// import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// Firebase configuration - extracted from google-services.json
const firebaseConfig = {
  apiKey: 'AIzaSyDoTpkQyefzWd3vrhhEbtNY6LFbGSrjXgs',
  authDomain: 'credentialmanager-75fc3.firebaseapp.com',
  projectId: 'credentialmanager-75fc3',
  storageBucket: 'credentialmanager-75fc3.firebasestorage.app',
  messagingSenderId: '892061141828',
  appId: '1:892061141828:android:199d951556cdcc4dd62511',
};

// Initialize Firebase app (idempotent) - uncomment after installing Firebase
// export const firebaseApp: FirebaseApp =
//   getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Export Firestore and Auth instances for use elsewhere - uncomment after installing Firebase
// export const firestore = getFirestore(firebaseApp);
// export const auth = getAuth(firebaseApp);

// Temporary placeholder exports
export const firebaseApp = null;
export const firestore = null;
export const auth = null;

export default firebaseApp;
