import { db } from "./config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function addOrUpdateSubscriber(email: string) {
  if (!email) throw new Error("Email is required");

  const subscribersRef = collection(db, "subscribers");

  // Check if email already exists
  const q = query(subscribersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Email exists → update timestamp
    const docRef = querySnapshot.docs[0].ref;

    await updateDoc(docRef, {
      updatedAt: serverTimestamp(),
    });

    return { status: "updated", message: "Email already subscribed" };
  }

  // Add new subscriber
  await addDoc(subscribersRef, {
    email,
    createdAt: serverTimestamp(),
  });

  return { status: "created", message: "Subscription successful" };
}
