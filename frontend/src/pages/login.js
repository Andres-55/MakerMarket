import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {GoogleLogin} from "@react-oauth/google";

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
            alert("Successfully logged in.");
            navigate("/home");
        } catch(err) {
            console.error(err);
            alert("Something went wrong. Try loggin in again.");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={loginUser}>
                <label>Username</label>
                <br />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>

                <br /><br />

                <label>Password</label>
                <br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                <br /><br />

                <button type="submit">Login</button>

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
                    alert("Successfully logged in using Google.");
                    navigate("/home");

                    } catch(err) {
                        console.error(err);
                    }

                }} onError={() => {
                    console.log("Google sign in failed.");
                }}/>

            </form>

            <br />

            <p>New to MakerMarket? {" "} <Link to="/register">Create an account.</Link></p>
        </div>
    );
}

export default Login;