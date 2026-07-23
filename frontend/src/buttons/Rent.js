    import { useState } from "react";
    import "./Rent.css";

    const USERID = "0";

    // Drop into the equipment detail page:
    // <RentButton equipmentId={item._id} available={item.available} onRented={() => window.location.reload()} />
    export default function RentButton({ equipmentId, available, onRented }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(null);

    async function Confirmation() {
        if (!startDate || !endDate) {
            setError("Pick a start and end date first.");
            return;
        }
        setSubmit(true);
        try {
        const res = await fetch(`http://localhost:3001/rentals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ equipmentId, renterId: USERID, startDate, endDate }),
        });
        if (!res.ok) throw new Error("Failed to rent");
        setError(null);
        if (onRented) onRented();
        } catch {
        setError("Couldn't complete the rental. Try again.");
        } finally {
        setSubmit(false);
        }
    }

    if (!available) {
        return <p>Currently unavailable for rent.</p>;
    }

    return (
        <div className="RentalCard">
        <label className="RentalCard-field">
            Start date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="RentalCard-field">
            End date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>

        {error && <p>{error}</p>}

        <button onClick={Confirmation} disabled={submit}>
            {submit ? "Renting…" : "Confirm rental"}
        </button>
        </div>
    );
    }