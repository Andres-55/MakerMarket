import { LoaderPinwheelIcon } from "lucide-react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userID;
}

function UserEquipment() {

    const [owned, setOwned] = useState([]);
    const [rented, setRented] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        loadOwnedEquipment();
        loadRentedEquipment();
    }, []);

    async function loadOwnedEquipment() {
        try {
            const res = await fetch("http://localhost:3001/equipment/owned", {
                headers: {Authorization: `Bearer ${token}`}
            });
            const data = await res.json();
            setOwned(data);
        }
        catch(err) {
            console.error("Error fetching owned equipment:", err);
        }
        
    }

    async function loadRentedEquipment() {
        try {
            const userId = getUserIdFromToken();
            const res = await fetch(`http://localhost:3001/users/${userId}/rentals`);
            const rentalRecords = await res.json();
            const active = rentalRecords.filter(r => r.status === "active");

            const withEquipment = await Promise.all(
                active.map(async (rental) => {
                    const eqRes = await fetch(`http://localhost:3001/equipment/${rental.equipmentId}`);
                    const equipment = eqRes.ok ? await eqRes.json() : null;
                    return { 
                            _id: rental._id,
                            equipmentId: rental.equipmentId,
                            renterId: rental.renterId,
                            status: rental.status,
                            startDate: rental.startDate,
                            endDate: rental.endDate,
                            equipment: equipment
                        }
                })
            );

            setRented(withEquipment);

        }

        catch(err) {
            console.error("Error fetching rented equipment");
        }
        finally {
            setLoading(false);
        }
    }

    async function returnEquipment(rentalId) {
        try {
            await fetch(`http://localhost:3001/rentals/${rentalId}/complete`, {method: "PUT"});
            loadRentedEquipment();
        } catch(err) {
            console.error("Error returning equipment:", err);
        }
    }

    async function deleteEquipment(equipmentId) {
        if (!window.confirm("Delete this equipment? This can't be undone.")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/equipment/${equipmentId}`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`}
            });
            if (!res.ok) {
                throw new Error(await res.text());
            }
            loadOwnedEquipment();
        } catch(err) {
            console.error("Error deleting equipment:", err);
            alert("Couldn't delete this equipment.");
        }
    }


    if (loading) {
        return <p>Loading…</p>;
    }

    return (
      <div>
        <button onClick={() => navigate("/home")}>Back</button>
        <h1>Your Equipment</h1>

        <h2>Equipment Owned:</h2>

        <div>
            {owned.map((item) => (
                <div key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <button onClick={() => navigate(`/equipment-form/${item._id}`)}>Edit</button>
                    <button onClick={() => deleteEquipment(item._id)}>Delete</button>
                </div>
            ))}
            <button onClick={() => navigate("/equipment-form")}>
                Add New Equipment
            </button>
        </div>

        

        <h2>Currently Renting:</h2>

        <div>
            {rented.length === 0 && <p>You aren't renting anything right now.</p>}
            {rented.map((rental) => (
                <div key={rental._id}>
                    <p>{rental.equipment?.name ?? "Unavailable"}</p>
                    <button onClick={() => returnEquipment(rental._id)}>Return</button>
                </div>
                ))}
        </div>
      </div>  
    );
}

export default UserEquipment;