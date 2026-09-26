import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api.js";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        console.log("LOGIN RESPONSE:", response.data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);

        console.log(
            "SAVED TOKEN:",
            localStorage.getItem("token")
        );

        alert("Login successful");
        navigate("/");
    }

    } catch (error) {
        console.log("LOGIN ERROR:", error);
    }
};

    return (
        <div className="max-w-md mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-6">
                Login
            </h1>

            <form
                onSubmit={handleLogin}
                className="space-y-4"
            >

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;