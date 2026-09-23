import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const config = {
  apiKey: 'AIzaSyBwV7ASv8Qgq03xx8GvDgLDjm0qeoPULDk',
  authDomain: 'cross-stadium-team-builder.firebaseapp.com',
  projectId: 'cross-stadium-team-builder',
  storageBucket: 'cross-stadium-team-builder.firebasestorage.app',
  messagingSenderId: '937782424268',
  appId: '1:937782424268:web:5fcc079c5f2d1da72bc869'
};

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
let ready;
function ensureAuth() {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  if (!ready) ready = signInAnonymously(auth).then(({ user }) => user).catch(error => { ready = null; throw error; });
  return ready;
}

async function save(collectionName, record) {
  const user = await ensureAuth();
  const ref = await addDoc(collection(db, collectionName), {
    ...record,
    ownerUid: user.uid,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

async function list(collectionName) {
  await ensureAuth();
  const snapshot = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const savePokemon = record => save('pokemon', record);
export const saveTeam = record => save('teams', record);
export const listPokemon = () => list('pokemon');
export const listTeams = () => list('teams');
