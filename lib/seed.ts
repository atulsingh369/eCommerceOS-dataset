import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { products, categories } from "@/lib/mockData";

export const seedDatabase = async () => {
  try {
    // Seed categories
    for (const category of categories) {
      await addDoc(collection(db, "categories"), category);
      console.log("Category added:", category.name);
    }

    // Seed products
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
      console.log("Product added:", product.name);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};