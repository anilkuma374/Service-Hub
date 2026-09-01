import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getData } from "../users/user";
import "../styles/public.css";

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

export default function ServiceCenters() {
    const [centers, setCenters] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getData("serviceCenters")
            .then((data) => setCenters(data))
            .catch(() => setCenters([]));
    }, []);

    const filteredCenters = centers.filter((center) => {
        const text = `${center.name} ${center.location}`.toLowerCase();
        return text.includes(search.toLowerCase());
    });

    return (
        <div className="container">
            <PageHeader title="Service Centers" subtitle="Find verified centers near you" />

            <div className="center-search">
                <input
                    type="text"
                    placeholder="Search service center or location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="card-grid">
                {filteredCenters.map((center) => (
                    <article className="service-card" key={center.id}>
                        <h3>{center.name}</h3>
                        <p className="center-location">Location: {center.location}</p>
                        <p>{center.services || "Car & Bike Services Available"}</p>
                        <p>{center.phone}</p>
                        <Link className="outline-btn" to={`/book-service?center=${encodeURIComponent(center.name)}`}>
                            View & Book
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}