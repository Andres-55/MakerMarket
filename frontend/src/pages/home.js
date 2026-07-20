import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import EquipmentDetails from "./equipmentDetails";
import "../App.css";

function App() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/equipment").then(response => response.json()).then(data => {
      console.log("Equipment fetched from API:" , data);
      setEquipment(data);
      
    }).catch(error => {
      console.error("Error fetching equipment:", error);
    });
  }, []);

  return (
    <div className="App">
    <header className="App-header">
        <h1>Maker Market</h1>

        <div className="equipment-list">
        {equipment.map(item => (
            <Link to={`/equipment/${item._id}`} key={item._id}>
            <div className="equipment-card" >
                <h2>{item.name}</h2>
                <p>Category: {item.category}</p>
                <p>{item.description}</p>
                <p>${item.price}/day</p>
                <p>
                {item.available ? "Available" : "Currently Rented"}
                </p>
            </div>
            </Link>
        ))}
        </div>
    </header>
    </div>        
  ); 
}

export default App;