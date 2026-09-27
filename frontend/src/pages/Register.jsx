import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api.js";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password
            });

            console.log("REGISTER RESPONSE:", response.data);

            if (response.data.success) {
                alert("Registration successful");
                navigate("/login");
            }

        } catch (error) {
            console.log("REGISTER ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="max-w-md mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">
                Create Account
            </h1>

            <form
                onSubmit={handleRegister}
                className="space-y-4"
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
