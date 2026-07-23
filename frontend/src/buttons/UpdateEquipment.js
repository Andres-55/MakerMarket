import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

function UpdateEquipment() {
    const {id} = useParams(); // present when editing, undefined when adding new
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/equipment/${id}`)
                .then(res => res.json())
                .then(data => {
                    setName(data.name || "");
                    setCategory(data.category || "");
                    setDescription(data.description || "");
                    setPrice(data.price || 0);
                })
                .catch(err => console.error("Error loading equipment:", err));
        }
    }, [id]);

    async function SubmitEquipment(event) {
        event.preventDefault();
        const body = JSON.stringify({name, category, description, price: Number(price)});
        const url = id ? `http://localhost:3001/equipment/${id}` : "http://localhost:3001/equipment";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body
            });
            if (!res.ok) throw new Error(await res.text());
            navigate("/my-equipment");
        } catch(err) {
            console.error("Error saving equipment:", err);
        }
    }

    return (
        <div className="UpdateEquipment">
            <button className="UpdateEquipment-back" onClick={() => navigate("/my-equipment")}>Back</button>

            <form onSubmit={SubmitEquipment}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Category:
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <button type="submit">{id ? "Save Changes" : "Add New Equipment"}</button>
            </form>
        </div>
    );
}

export default UpdateEquipment;