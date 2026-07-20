import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";

function Register() {

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    bio,
                    password
                })
            });

            const message = await response.text();
            
            if(response.ok) {
                alert("Account registered. Please log in.");
                navigate("/");
            }
            else alert(message);

        } catch (err) {
            console.error(err);
            alert("Error creating account.");
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            <form onSubmit={registerUser}>

                <label>Username *</label>
                <br />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <br /><br />

                <label>First Name *</label>
                <br />
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <br /><br />

                <label>Last Name</label>
                <br />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <br /><br />

                <label>Email *</label>
                <br />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br /><br />

                <label>Phone Number</label>
                <br />
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <br /><br />

                <label>Bio</label>
                <br />
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    cols={40}
                />

                <br /><br />

                <label>Password *</label>
                <br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br /><br />

                <label>Confirm Password *</label>
                <br />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    Create Account
                </button>

            </form>

            <br />

            <p>Already have an account?{" "} <Link to="/">Login here</Link></p>
        </div>
    );
}

export default Register;