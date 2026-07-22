import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";


const USERID = "";

function DisplayReviews() {
    const [reviews, setReviews] = useState([]);
    const [exists, setStatus] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadEquipmentReviews();
    }, [equipmentId]);

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
    }
    }
    
    return (
    <div>
        <h2>Reviews</h2>
 
        <loadReview equipmentId={equipmentId} onSubmitted={loadEquipmentReviews} />
 
        <div>
            {exists && <p>Loading reviews…</p>}
            {error && <p>{error}</p>}
            {!exists && !error && reviews.length === 0 && (
            <p>No reviews yet. Be the first to leave one.</p>
            )}
            {reviews.map((r) => (
            <ReviewItem key={r._id} review={r} />
            ))}
        </div>
    </div>
    );
}

function loadReview(review) {
    return (
    <div>
        <div>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
            ))}
        </div>
        <p>{review.comment}</p>
        <p>
            {new Date(review.createdAt).toLocaleDateString()}
        </p>
    </div>
  );
}

function writeReview(equipmentId, onSubmitted) {
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
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userID: CURRENT_USER_ID, rating, comment }),
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
            setSubmitting(false);
        }
    }

    return (
        <div></div>
    );
}

export default Profile;