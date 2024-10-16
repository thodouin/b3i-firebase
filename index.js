import { initializeApp } from "firebase/app";
import 'dotenv/config';
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';

console.log('Start du programme v1 !');

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getFactures(db) {
    const facturesCol = collection(db, 'factures');
    const facturesSnapshot = await getDocs(facturesCol);
    const facturesList = facturesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
    return facturesList;
  }

const factures = await getFactures(db)

console.log(factures);