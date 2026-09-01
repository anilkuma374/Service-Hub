import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../users/user";
import "../styles/reg.css";

const Reg = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (
            name.trim() === "" ||
            email.trim() === "" ||
            mobile.trim() === "" ||
            password.trim() === "" ||
            confirmPassword.trim() === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Mobile number must contain 10 digits.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        registerUser({
            name: name,
            email: email,
            mobile: mobile,
            password: password
        })
            .then((result) => {
                if (result.success === false) {
                    alert(result.message);
                    return;
                }

                alert("Registration successful. Please login.");
                navigate("/login");
            })
            .catch(() => {
                alert("Registration failed. Please start JSON Server.");
            });
    };

    return (
        <div className="reg-page">
            <form
                className="reg-form"
                onSubmit={handleRegister}
                noValidate
            >
                <h1>Register</h1>

                <label htmlFor="name">
                    Name
                </label>

                <input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="email">
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="mobile">
                    Mobile Number
                </label>

                <input
                    id="mobile"
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />

                <label htmlFor="password">
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label htmlFor="confirmPassword">
                    Confirm Password
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="submit">
                    Register
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Reg;
