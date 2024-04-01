import { openDB } from "idb";
// Function to initialize the IndexedDB
async function initDB() {
  if (!("indexedDB" in window)) {
    throw new Error("IndexedDB support is required");
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WiseWardro", 1);
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
    const request = indexedDB.open("WiseWardro");

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
  const clearRequest = store.clear(); // Request to clear all entries in the store named

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

  // Modify the outfit object to have an 'id' key instead of 'outfit_id'
  const outfitToSave = {
    ...outfit,
    id: outfit.outfit_id,
  };
  delete outfitToSave.outfit_id; // remove the original outfit_id if necessary

  return new Promise((resolve, reject) => {
    const request = store.put(outfitToSave);

    request.onsuccess = () => {
      console.log(`Outfit ${outfitToSave.id} saved successfully.`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        "Error saving the outfit to IndexedDB:",
        event.target.error
      );
      reject(event.target.error);
    };
  });
}
// Function to remove an outfit from the favorites store in IndexedDB
async function removeFavoriteOutfit(outfitId) {
  const db = await initDB(); // Make sure this function initializes IndexedDB and opens the desired database

  const transaction = db.transaction("favorites", "readwrite");
  const store = transaction.objectStore("favorites");

  return new Promise((resolve, reject) => {
    const request = store.delete(outfitId); // Use the delete method with the outfit's ID

    request.onsuccess = () => {
      console.log(`Outfit with id ${outfitId} removed from favorites.`);
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
async function hasImages() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WiseWardro", 1);

    request.onerror = () => {
      reject(new Error("Could not open the IndexedDB database."));
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const countRequest = store.count(); // count the number of records in the store

      countRequest.onsuccess = () => {
        resolve(countRequest.result > 0); // true if there's one or more records
      };

      countRequest.onerror = () => {
        reject(new Error("Failed to count records in the 'images' store."));
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };
  });
}

// Function to retrieve all outfits from the favorites store in IndexedDB
async function getFavoriteOutfits() {
  const db = await initDB(); // Ensure this function opens the correct IndexedDB

  const transaction = db.transaction("favorites", "readonly");
  const store = transaction.objectStore("favorites");

  return new Promise((resolve, reject) => {
    const request = store.getAll(); // Retrieve all records from the store

    request.onsuccess = (event) => {
      resolve(event.target.result); // Returns an array of outfits
    };

    request.onerror = (event) => {
      console.error(
        "Error fetching favorite outfits from IndexedDB:",
        event.target.error
      );
      reject(event.target.error);
    };
  });
}

export {
  initDB,
  openDB,
  storeImages,
  getImages,
  hasImages,
  clearImages,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
  getFavoriteOutfits,
};
