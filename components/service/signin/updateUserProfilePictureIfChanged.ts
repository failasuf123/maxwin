import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/service/firebaseConfig"; // Sesuaikan dengan path Anda

export const updateUserProfilePictureIfChanged = async (userId: string, newPictureUrl: string) => {
  const userRef = doc(db, "Users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentPictureUrl = userDoc.data().userPicture;

    // Periksa apakah URL foto profil baru berbeda dengan yang lama
    if (currentPictureUrl !== newPictureUrl) {
      await updateDoc(userRef, {
        userPicture: newPictureUrl,
      });
      console.log("Profile picture updated in Firestore!");
    } else {
      console.log("Profile picture is the same, no update needed.");
    }
  } else {
    console.log("User not found in Firestore.");
  }
};