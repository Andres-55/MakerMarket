import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../App.css";

function App() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState([]);
  const navigate = useNavigate();

  const getAllEquipment = () => {
    fetch(`http://localhost:3001/equipment`).then(response => response.json()).then(data => {
            setEquipment(data);
        }).catch(error => {
            console.error("Error fetching equipment:", error);
        });
  };

  useEffect(() => {
    getAllEquipment();
  }, []);

  
  const searchEquipment = () => {

    if(search.trim() === "") {
        getAllEquipment();
        return;
    }

    fetch(`http://localhost:3001/equipment/search?query=${search}`).then(response => response.json()).then(data => {
        setEquipment(data);
    }).catch(error => {
        console.error("Error searching equipemnt.");
    });
  };

  return (
    <div className="App">
    <header className="App-header">
        <div>
            <button onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
                }}>
                Logout
            </button>
            
            <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
        
        <h1>Maker Market</h1>

        <div>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button onClick={searchEquipment}>Search</button>
        </div>

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