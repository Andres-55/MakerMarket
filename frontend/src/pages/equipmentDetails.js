import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import Rent from "../buttons/Rent";
import "./equipmentDetails.css";

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
            <button onClick={() => navigate("/home")}>{"<"}- Back</button>
        <div className="equipmentCard">
            <h1>{equipment.name}</h1>
            <p>Category: {equipment.category}</p>
            <p>{equipment.description}</p>
            <p>${equipment.price}/day</p>
            <p>
                {equipment.available ? "Available" : "Currently Rented"}
            </p>
            <Link to={`/equipment/${equipment._id}/reviews`}>See reviews</Link>
            <Rent
            equipmentId={equipment._id}
            available={equipment.available}
            onRented={() => window.location.reload()}
            />
        </div>
        </div>
    );
}

export default EquipmentDetails;