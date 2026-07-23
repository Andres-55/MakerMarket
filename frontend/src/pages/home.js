import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./home.css";

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
    <div className="homePage">
    <header className="App-header">
        <div className="homeContainer">
            <div>
                <button className="logoutButton" onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                    }}>
                    Logout
                </button>
            </div>

            <div>
                <button className="myEquipmentButton" onClick={() => navigate("/my-equipment")}>My Equipment</button>
            </div>

            <div>
                <button className="profileButton" onClick={() => navigate("/profile")}>Profile</button>
            </div>
        </div>

        <div className="homeTitle">
            <h1>Maker Market</h1>
        </div>

        <div className="searchContainer">
            <input className="searchInput" type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button className="searchButton" onClick={searchEquipment}>Search</button>
        </div>

        <div className="line"></div>

        <div className="equipmentList">
            {equipment.map(item => (
                <Link to={`/equipment/${item._id}`} key={item._id} className="equipmentLink">
                <div className="equipmentCard" >
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