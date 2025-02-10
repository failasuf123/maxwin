import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig"; // Sesuaikan dengan path Anda

export const saveUserToFirestore = async (user: any) => {
  if (!user) return;

  const userRef = doc(db, "Users", user.id); // Gunakan user.id sebagai document ID
  const userDoc = await getDoc(userRef);

  // Jika pengguna belum ada di Firestore, simpan datanya
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      userId: user.id,
      username: user.name,
      userEmail: user.email,
      userPicture: user.picture,
      milestones: {
        verified: false,
        pioneer: true,
        content_creator: false,
      },
    });
    console.log("User data saved to Firestore!");
  } else {
    console.log("User already exists in Firestore.");
  }
};