import { openDB } from "idb";
// Function to initialize the IndexedDB
export async function initDB() {
  if (!("indexedDB" in window)) {
    throw new Error("IndexedDB support is required");
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDatabase", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }
    };
    request.onerror = (event) => {
      reject("IndexedDB error: " + event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}
// Function to store images in IndexedDB
async function storeImages(images, formDataKeys) {
  const db = await initDB();

  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");

  images.forEach((image, index) => {
    const formDataKey = formDataKeys[index]; // Get the corresponding key
    store.put({ id: formDataKey, blob: image.file }); // Store the File object
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log("All files have been stored in IndexedDB.");
      resolve();
    };

    transaction.onerror = (event) => {
      reject("IndexedDB transaction error: " + event.target.errorCode);
    };
  });
}
// function to retrieve images from indexDB database
async function getImages() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDatabase");

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");
      const getAllRequest = store.getAll();

      getAllRequest.onerror = (event) => {
        console.error("Error getting data from store:", event.target.error);
        reject(event.target.error);
      };

      getAllRequest.onsuccess = (event) => {
        const images = event.target.result;
        const imageUrls = images.map((img) => ({
          id: img.id,
          url: URL.createObjectURL(img.blob),
        }));
        console.log("Retrieved images:", imageUrls);
        resolve(imageUrls);
      };
    };
  });
}
// Function to clear images from IndexedDB
async function clearImages() {
  const db = await initDB(); // Initialize the IndexedDB

  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");

  const clearRequest = store.clear(); // Request to clear all entries in the store

  return new Promise((resolve, reject) => {
    clearRequest.onsuccess = () => {
      console.log("All images have been cleared from IndexedDB.");
      resolve();
    };

    clearRequest.onerror = (event) => {
      console.error("Error clearing images store:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Function to save an outfit to the favorites store in IndexedDB
async function saveFavoriteOutfit(outfit) {
  const db = await initDB();

  const transaction = db.transaction("favorites", "readwrite");
  const store = transaction.objectStore("favorites");

  return new Promise((resolve, reject) => {
    const request = store.put(outfit); // Assuming outfit has an 'id' property

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject("IndexedDB error: " + event.target.errorCode);
    };
  });
}
// Function to remove an outfit from the favorites store in IndexedDB
async function removeFavoriteOutfit(outfitId) {
  const db = await initDB();

  const transaction = db.transaction("favorites", "readwrite");
  const store = transaction.objectStore("favorites");

  return new Promise((resolve, reject) => {
    const request = store.delete(outfitId);

    request.onsuccess = () => {
      console.log(`Outfit with id ${outfitId} removed from favorites`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        "Error removing outfit from favorites:",
        event.target.error
      );
      reject(event.target.error);
    };
  });
}

export {
  openDB,
  storeImages,
  getImages,
  clearImages,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
};
