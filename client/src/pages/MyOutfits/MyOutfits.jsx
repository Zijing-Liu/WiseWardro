import React, { useState, useEffect } from "react";
import { getFavoriteOutfits } from "../../utils/indexDB";
function MyOutfits() {
  const [outfit, setOutfits] = useState([]);
  useEffect(() => {
    const fetchFavoriteOutfits = async () => {
      try {
        const favoriteOutfits = await getFavoriteOutfits();
        console.log("Retrieved favorite outfits:", favoriteOutfits);
        // Now you can set these favorite outfits to state or use them as needed
      } catch (error) {
        console.error("Failed to fetch favorite outfits:", error);
      }
    };

    fetchFavoriteOutfits();
  }, []); // Empty dependency array to run only once on component mount
  return <div>MyOutfits</div>;
}

export default MyOutfits;
