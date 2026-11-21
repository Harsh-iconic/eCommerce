import { useEffect, useState } from "react";
import api from "../services/Api";

const WishlistButton = ({ productId, compact = false }) => {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    let active = true;
    api.get("/wishlist")
      .then(({ data }) => {
        if (active) setSaved((data.wishlist || []).some((item) => item._id === productId));
      })
      .catch(() => {});
    return () => { active = false; };
  }, [productId]);

  const toggle = async () => {
    if (!localStorage.getItem("token")) {
      window.location.assign("/login");
      return;
    }
    setBusy(true);
    try {
      if (saved) await api.delete(`/wishlist/${productId}`);
      else await api.post("/wishlist", { productId });
      setSaved(!saved);
    } catch {
      // The button stays in its previous state if the API request fails.
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={compact ? "wishlist-icon-button" : "button button-outline"}
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
    >
      {busy ? "…" : saved ? "♥ Saved" : "♡ Save"}
    </button>
  );
};

export default WishlistButton;
