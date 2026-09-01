
import React, { useState } from "react";
import { getCurrentUser, updateUser } from "../users/user";
import "../styles/admin-settings.css";

const PageHeader = ({ title, subtitle, action, onAction }) => {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action && (
                <button
                    className="primary-btn"
                    type="button"
                    onClick={onAction}
                >
                    {action}
                </button>
            )}
        </div>
    );
};

function AdminSettings() {
    const user = getCurrentUser();
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [name, setName] = useState(user ? user.name : "Admin");
    const [email, setEmail] = useState(user ? user.email : "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const saveChanges = (e) => {
        e.preventDefault();

        updateUser(user.id, { ...user, name, email })
            .then((updated) => {
                localStorage.setItem("currentUser", JSON.stringify(updated));
                alert("Settings saved successfully.");
                setShowAccountForm(false);
            })
            .catch(() => alert("Unable to save settings."));
    };

    const updatePassword = (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            alert("Enter old and new password.");
            return;
        }

        if (oldPassword !== user.password) {
            alert("Old password is incorrect.");
            return;
        }

        updateUser(user.id, { ...user, password: newPassword })
            .then((updated) => {
                localStorage.setItem("currentUser", JSON.stringify(updated));
                setOldPassword("");
                setNewPassword("");
                setShowPasswordForm(false);
                alert("Password updated successfully.");
            })
            .catch(() => alert("Unable to update password."));
    };

    return (
        <>
            <PageHeader
                title="Admin Settings"
                subtitle="Manage your account settings"
            />
            <section className="panel">
                <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                        setShowAccountForm(true);
                        setShowPasswordForm(false);
                    }}
                >
                    Edit Account
                </button>
                <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                        setShowPasswordForm(true);
                        setShowAccountForm(false);
                    }}
                >
                    Change Password
                </button>
                {showAccountForm && (
                    <form onSubmit={saveChanges}>
                        <label>
                            Name
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Email
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <button className="primary-btn" type="submit">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAccountForm(false)}
                        >
                            Cancel
                        </button>
                    </form>
                )}
                {showPasswordForm && (
                    <form onSubmit={updatePassword}>
                        <label>
                            Current Password
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            New Password
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                        <button className="primary-btn" type="submit">
                            Update Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPasswordForm(false)}
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </section>
        </>
    );
}

export default AdminSettings;

