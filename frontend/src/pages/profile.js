import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

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

            const message = await response.text();

            alert(message);
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
        <div>
            <div>
                <button onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                }}>
                    Logout
                </button>
                <button onClick={() => navigate("/home")}>
                    Home
                </button>
            </div>
            <h1>Profile</h1>

            <p>Username: {user.username}</p>

            <p>Email: {user.email}</p>

            <p>First Name:</p>
            { edit ? (                                                          //checks if the user chose to edit their profile, if yes then add an input box, if not just show the info
                <input type="text" value={user.firstName} onChange={(e) => 
                    setUser({
                        ...user,
                        firstName: e.target.value
                    })
                } 
                />) : (<p>{user.firstName}</p>)
            }

            <p>Last Name:</p>
            { edit ? (
                <input type="text" value={user.lastName} onChange={(e) => 
                    setUser({
                        ...user,
                        lastName: e.target.value
                    })
                } 
                />) : (<p>{user.lastName}</p>)
            }

            <p>Phone Number:</p>
            { edit ? (
                <input type="tel" value={user.phoneNumber} onChange={(e) => 
                    setUser({
                        ...user,
                        phoneNumber: e.target.value
                    })
                } 
                />) : (<p>{user.phoneNumber}</p>)
            }

            <p>Bio: {user.bio}</p>
            { edit ? (
                <textarea value={user.bio} onChange={(e) =>
                    setUser({
                        ...user,
                        bio: e.target.value
                    })
                }
                />) : (<p>{user.bio}</p>)
            }

            { edit ? (
                <button onClick={updateProfile}>Save Chnages</button>
            ): (
                <button onClick={() => setEdit(true)}>Edit Profile</button>
            )}

        </div>
    );
}

export default Profile;