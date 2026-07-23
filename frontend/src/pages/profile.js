import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import ('./profile.css');

function Profile() {
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();

    //updates the profile if the chooser clicks Save Changes
    const updateProfile = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:3001/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio
                })
            });

            setEdit(false);
        } catch(err) {
            console.error("Error updating profile:", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:3001/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            console.log("Profile data:", data);
            setUser(data);
        }).catch(error => {
            console.error("Error getting profile:", error);
        });
    }, []);

    if(!user) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="profilePage">
            <div className="container">
                <div>
                    <button className="logoutButton" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>
                        Logout
                    </button>
                </div>

                <div>
                    <button className="homeButton" onClick={() => navigate("/home")}>
                        Home
                    </button>
                </div>
            </div>

            <div className="profileTitle">
                <h1>Profile</h1>
            </div>

            <div className="info">
                <p className="infoTitle">Username: </p> 
                <p>{user.username}</p>
            </div>

            <div className="info">
                <p className="infoTitle">Email: </p> 
                <p>{user.email}</p>
            </div>

            <div className="info">
                <p className="infoTitle"> First Name:</p>
                { edit ? (      //checks if the user chose to edit their profile, if yes then add an input box, if not just show the info
                    <input type="text" value={user.firstName} onChange={(e) => 
                        setUser({
                            ...user,
                            firstName: e.target.value
                        })
                    } 
                    />) : (<p>{user.firstName}</p>)
                }
            </div>

            <div className="info">
                <p className="infoTitle">Last Name:</p>
                { edit ? (
                    <input type="text" value={user.lastName} onChange={(e) => 
                        setUser({
                            ...user,
                            lastName: e.target.value
                        })
                    } 
                    />) : (<p>{user.lastName}</p>)
                }
            </div>

            <div className="info">
                <p className="infoTitle">Phone Number:</p>
                { edit ? (
                    <input type="tel" value={user.phoneNumber} onChange={(e) => 
                        setUser({
                            ...user,
                            phoneNumber: e.target.value
                        })
                    } 
                    />) : (<p>{user.phoneNumber}</p>)
                }
            </div>

            <div className="info">
                <p className="infoTitle">Bio: </p>
                { edit ? (
                    <textarea value={user.bio} onChange={(e) =>
                        setUser({
                            ...user,
                            bio: e.target.value
                        })
                    }
                    />) : (<p>{user.bio}</p>)
                }
            </div>

            <div className="bottomButton">
                { edit ? (
                    <button class="saveEditButton" onClick={updateProfile}>Save Changes</button>
                ): (
                    <button class="saveEditButton" onClick={() => setEdit(true)}>Edit Profile</button>
                )}
            </div>

        </div>
    );
}

export default Profile;