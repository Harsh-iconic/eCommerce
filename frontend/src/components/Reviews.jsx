import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/Api";

const Stars = ({ value }) => (
  <span className="review-stars" aria-label={`${value} out of 5 stars`}>
    {"★".repeat(value)}<span>{"☆".repeat(5 - value)}</span>
  </span>
);

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${productId}`);
      setReviews(data.reviews || []);
      setSummary(data.summary || { average: 0, count: 0 });
    } catch {
      setMessage("Reviews are temporarily unavailable.");
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem("token")) {
      setMessage("Sign in to share your experience.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await api.post(`/reviews/${productId}`, { rating, comment });
      setComment("");
      setMessage("Thanks! Your review has been saved.");
      await loadReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save your review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-heading">
        <div><span className="eyebrow">CUSTOMER NOTES</span><h2>What people think<span className="period">.</span></h2></div>
        <div className="review-summary"><strong>{summary.average.toFixed(1)}</strong><Stars value={Math.round(summary.average)} /><span>{summary.count} review(s)</span></div>
      </div>
      <form className="review-form" onSubmit={submit}>
        <label className="field">Your rating
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>)}
          </select>
        </label>
        <label className="field">Your review
          <textarea required minLength={3} maxLength={800} rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What did you like about it?" />
        </label>
        <button className="button button-dark" disabled={busy}>{busy ? "Saving..." : "Share review"}</button>
        {!localStorage.getItem("token") && <span className="review-signin">Please <Link to="/login">sign in</Link> to leave a review.</span>}
        {message && <p className="notice" role="status">{message}</p>}
      </form>
      <div className="review-list">
        {reviews.length ? reviews.map((review) => (
          <article className="review-card" key={review._id}>
            <div className="review-card-top"><strong>{review.user?.name || "Shopper"}</strong><Stars value={review.rating} /></div>
            <p>{review.comment}</p>
            <time>{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
          </article>
        )) : <p className="muted">No reviews yet. Be the first to share your thoughts.</p>}
      </div>
    </section>
  );
};

export default Reviews;
