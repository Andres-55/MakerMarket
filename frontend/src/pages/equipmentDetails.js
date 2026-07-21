import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";

function EquipmentDetails() {

    const {id} = useParams();
    const [equipment, setEquipment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3001/equipment/${id}`).then(response => response.json()).then(data => {
            console.log("Equipment details:", data);
            setEquipment(data);
        }).catch(error => {
            console.error("Error fetching equipment details:", error);
        });
    }, [id]);

    if(!equipment) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <div>
                <button onClick={() => navigate("/home")}>{"<"}- Back</button>
            </div>
            <h1>{equipment.name}</h1>
            <p>Category: {equipment.category}</p>
            <p>{equipment.description}</p>
            <p>${equipment.price}/day</p>
            <p>
                {equipment.available ? "Available" : "Currently Rented"}
            </p>
        </div>
    );
}

export default EquipmentDetails;