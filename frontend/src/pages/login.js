import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {GoogleLogin} from "@react-oauth/google";
import "./login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault();

        try{
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if(!response.ok) {
                const message = await response.text();
                alert(message);
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/home");
        } catch(err) {
            console.error(err);
            alert("Something went wrong. Try loggin in again.");
        }
    };

    return (
        <div className="page">
            <div className="title">
                <h1>Maker Market</h1>
            </div>

            <form onSubmit={loginUser}>
                <div className="input">
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <div className="submitContainer">
                    <button className="submitButton" type="submit">Login</button>
                </div>

                <div className="googleButton">
                    <GoogleLogin onSuccess={async(credentialResponse) => {
                        console.log("Google sign in successful", credentialResponse);
                        try {
                        const response = await fetch("http://localhost:3001/google-login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({credential: credentialResponse.credential})
                        });

                        const data = await response.json();
                        localStorage.setItem("token", data.token);
                        navigate("/home");

                        } catch(err) {
                            console.error(err);
                        }

                    }} onError={() => {
                        console.log("Google sign in failed.");
                    }}/>
                </div>

            </form>

            <div className="accountLink">
                <p>New to MakerMarket? {" "} <Link to="/register">Create an account.</Link></p>
            </div>
        </div>
    );
}

export default Login;