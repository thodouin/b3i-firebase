import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

console.log('Start du programme simplifié sans champs !');

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
  const facturesList = facturesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  return facturesList;
}

async function deleteFacture(db, id) {
  try {
    await deleteDoc(doc(db, 'factures', id));
    console.log(`Facture avec ID ${id} supprimée.`);
  } catch (error) {
    console.error("Erreur lors de la suppression : ", error);
  }
}

async function addFacture(db) {
  try {
    const docRef = await addDoc(collection(db, 'factures'), {});
    console.log(`Nouveau document ajouté avec ID : ${docRef.id}`);

    const updatedFactures = await getFactures(db);
    affichefactures(updatedFactures);
  } catch (error) {
    console.error("Erreur lors de l'ajout du document : ", error);
  }
}

const affichefactures = (factures) => {
  const listEl = document.querySelector('#factureList');
  listEl.innerHTML = '';

  factures.map(facture => {  
    const liEl = document.createElement('li');
    liEl.innerHTML = `${facture.id} <button class='deleteFacture' data-id='${facture.id}'>x</button>`;
    listEl.appendChild(liEl);
  });

  const buttondelete = document.querySelectorAll('.deleteFacture');
  buttondelete.forEach(button => {
    button.addEventListener('click', async (event) => {
      const factureId = event.target.getAttribute('data-id');
      console.log(`Suppression de la facture avec ID : ${factureId}`);
      
      await deleteFacture(db, factureId);

      const updatedFactures = await getFactures(db);
      affichefactures(updatedFactures);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const addButton = document.createElement('button');
  addButton.textContent = "Ajouter une nouvelle facture";
  addButton.addEventListener('click', async () => {
    await addFacture(db);
  });

  const rootEl = document.querySelector('#root');

  const factureListEl = document.createElement('ul');
  factureListEl.id = 'factureList';
  rootEl.appendChild(factureListEl);

  rootEl.appendChild(addButton);

  const factures = await getFactures(db);
  affichefactures(factures);
});
