import { openDB } from "idb";
// Function to initialize the IndexedDB
// Function to initialize the IndexedDB
async function initDB() {
  const dbName = "WiseWardro1";
  const dbVersion = 1;
  try {
    const db = await openDB(dbName, dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(
          `Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`
        );
        // Create "images" store if it doesn't exist
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id" });
        }
        // Create "favorites" store if it doesn't exist
        if (!db.objectStoreNames.contains("favorites")) {
          db.createObjectStore("favorites", { keyPath: "id" });
        }
        // Create "favImages" store if it doesn't exist
        if (!db.objectStoreNames.contains("favImages")) {
          db.createObjectStore("favImages", { keyPath: "id" });
        }
      },
    });

    return db;
  } catch (error) {
    throw new Error(`IndexedDB error: ${error}`);
  }
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
// Function to store favImages images in IndexedDB

// Function to store images in the favImages store of IndexedDB
async function storeFavImages(images) {
  const dbName = "WiseWardro1";
  const storeName = "favImages";
  const dbVersion = 1; // Use the current version of your database

  // Open the database
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      // Create the favImages object store if it doesn't exist
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    },
  });

  // Start a transaction and get the store
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  // Iterate through the images and add them to the store
  for (const image of images) {
    await store.put(image); // Assuming each image has an 'id' property
  }

  // Wait for the transaction to complete
  await transaction.done;

  console.log("All favorite images have been stored in IndexedDB.");
}

async function getFavImages() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WiseWardro1", 1); // Specify version 1 for database upgrade

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("favImages")) {
        db.createObjectStore("favImages", { keyPath: "id" }); // Create the object store if it doesn't exist
      }
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["favImages"], "readonly");
      const store = transaction.objectStore("favImages");
      const getAllRequest = store.getAll();

      getAllRequest.onerror = (event) => {
        console.error("Error getting data from store:", event.target.error);
        reject(event.target.error);
      };

      getAllRequest.onsuccess = (event) => {
        const images = event.target.result;
        const imageUrls = images.map((img) => ({
          id: img.id,
          url: URL.createObjectURL(new Blob([img.blob])),
        }));
        console.log("Retrieved images:", imageUrls);
        resolve(imageUrls);
      };
    };
  });
}
// function to retrieve images from indexDB database
async function getImages() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WiseWardro1");

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
    const request = indexedDB.open("WiseWardro1", 1);

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
  storeFavImages,
  getFavImages,
};
