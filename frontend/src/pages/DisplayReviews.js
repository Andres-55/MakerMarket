import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {Star} from "lucide-react";
import "./DisplayReviews.css";

const USERID = "0";

function DisplayReviews() {

    const {equipmentId} = useParams();
    const [reviews, setReviews] = useState([]);
    const [exists, setStatus] = useState(true);
    const [error, setError] = useState(null);
    const [equipment, setEquipment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadEquipmentReviews();
        loadEquipmentDetails();
    }, [equipmentId]);

    async function loadEquipmentDetails() {
        try {
            const res = await fetch(`http://localhost:3001/equipment/${equipmentId}`);
            if (!res.ok) throw new Error("Failed to load equipment");
            const data = await res.json();
            setEquipment(data);
        } catch (err) {
            console.error('Error fetching equipment:', err);
        }
    }

    async function loadEquipmentReviews() {
    try {
        const res = await fetch(`http://localhost:3001/equipment/${equipmentId}/reviews`);
        if (!res.ok) {
            throw new Error("Failed to load reviews");
        }
        const data = await res.json();
        setReviews(data);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        setError("Unable to load reviews.");

    } finally {
        setStatus(false);
    }
    }
    
    return (
    <div>
        <div equipmentId={equipmentId}>
            <button onClick={() => navigate(`/equipment/${equipmentId}`)}>{"<"}- Back</button>
        </div>
        <h2>{equipment ? `Reviews for ${equipment.name}` : "Reviews"}</h2>
 
        <WriteReview equipmentId={equipmentId} onSubmitted={loadEquipmentReviews} />
 
        <div>
            {exists && <p>Loading reviews…</p>}
            {error && <p>{error}</p>}
            {!exists && !error && reviews.length === 0 && (
            <p>No reviews yet. Be the first to leave one.</p>
            )}
            {reviews.map((r) => (
            <LoadReview key={r._id} review={r} />
            ))}
        </div>
    </div>
    );
}

function LoadReview({review}) {
    return (
    <div className="ReviewCard">
        <div className="ReviewCard-stars" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
            ))}
        </div>
        <p className="ReviewCard-comment">{review.comment}</p>
        <p className="ReviewCard-date" dateTime={review.createdAt}>
            {new Date(review.createdAt).toLocaleDateString()}
        </p>
    </div>
  );
}

function WriteReview({equipmentId, onSubmitted}) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(null);

    async function submitReview(event) {
        event.preventDefault();
        if (rating === 0){
            setError("Must select a rating before submitting!");
            return;
        }
        setSubmit(true);
        try {
            const res = await fetch(`http://localhost:3001/equipment/${equipmentId}/reviews`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userID: USERID, rating, comment }),
            });
        
            if (!res.ok){
                throw new Error("Failed to submit review");
            }

            setRating(0);
            setComment("");
            setError(null);
            onSubmitted();
        }
        catch {
            setError("Error submitting review.");
        }
        finally {
            setSubmit(false);
        }
    }

    return (
        <form onSubmit={submitReview}>
    <p>Leave a review</p>

    <div>
        {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        return (
            <button
                key={i}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-amber-500"
                >
                <Star size={22} fill={value <= (hoverRating || rating) ? "currentColor" : "none"} />
                </button>
            );
            })}
        </div>

        <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your rental?"
        />

        {error && <p>{error}</p>}

        <button
            type="submit"
            disabled={submit}
        >
            {submit ? "Submitting…" : "Submit review"}
        </button>
        </form>
    );

}

export default DisplayReviews;