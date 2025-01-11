import { db } from '@/app/service/firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';

export const getTripsData = async (tripid: string) => {
  if (!tripid) {
    throw new Error("Trip ID is required.");
  }

  const docRef = doc(db, 'Trips', tripid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Trip not found.");
  }
};
