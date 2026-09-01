import axios from "axios";
import { BASE_URL } from "../services/api";

export const getUsers = () => {
    return axios
        .get(`${BASE_URL}/users`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error loading users:", error);
            alert("Unable to load users. Start JSON Server.");
            throw error;
        });
};

export const getUserById = (id) => {
    return axios
        .get(`${BASE_URL}/users/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error loading user:", error);
            alert("Unable to load user.");
            throw error;
        });
};

export const addUser = (userData) => {
    return axios
        .post(`${BASE_URL}/users`, userData)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error adding user:", error);
            alert("Unable to add user.");
            throw error;
        });
};

export const updateUser = (id, userData) => {
    return axios
        .put(`${BASE_URL}/users/${id}`, userData)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error updating user:", error);
            alert("Unable to update user.");
            throw error;
        });
};

export const deleteUser = (id) => {
    return axios
        .delete(`${BASE_URL}/users/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error deleting user:", error);
            alert("Unable to delete user.");
            throw error;
        });
};

export const registerUser = (userData) => {
    return getUsers()
        .then((users) => {
            const email = userData.email.trim().toLowerCase();

            const exists = users.find(
                (user) => user.email.toLowerCase() === email
            );

            if (exists) {
                return {
                    success: false,
                    message: "Email already registered"
                };
            }

            return addUser({
                name: userData.name.trim(),
                email: email,
                mobile: userData.mobile.trim(),
                password: userData.password,
                role: "user"
            }).then((user) => {
                return {
                    success: true,
                    user: user
                };
            });
        })
        .catch((error) => {
            console.error("Registration error:", error);
            return {
                success: false,
                message: "Registration failed"
            };
        });
};

export const loginUser = (email, password) => {
    return getUsers()
        .then((users) => {
            const user = users.find(
                (item) =>
                    item.email.toLowerCase() === email.trim().toLowerCase() &&
                    item.password === password
            );

            if (!user) {
                return {
                    success: false,
                    message: "Invalid email or password"
                };
            }

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            return {
                success: true,
                user: user
            };
        })
        .catch((error) => {
            console.error("Login error:", error);
            return {
                success: false,
                message: "Unable to connect to database. Start JSON Server."
            };
        });
};

export const logoutUser = () => {
    localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        localStorage.removeItem("currentUser");
        return null;
    }
};

export const getData = (collection) => {
    return axios
        .get(`${BASE_URL}/${collection}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error loading ${collection}:`, error);
            alert(`Unable to load ${collection}.`);
            throw error;
        });
};

export const addData = (collection, data) => {
    return axios
        .post(`${BASE_URL}/${collection}`, data)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error adding ${collection}:`, error);
            alert(`Unable to add ${collection}.`);
            throw error;
        });
};

export const updateData = (collection, id, data) => {
    return axios
        .put(`${BASE_URL}/${collection}/${id}`, data)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error updating ${collection}:`, error);
            alert(`Unable to update ${collection}.`);
            throw error;
        });
};

export const deleteData = (collection, id) => {
    return axios
        .delete(`${BASE_URL}/${collection}/${id}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error deleting ${collection}:`, error);
            alert(`Unable to delete ${collection}.`);
            throw error;
        });
};
