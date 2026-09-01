import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

const serviceImages = {
    car: {
        engine: "https://images.unsplash.com/photo-1767339736147-676bd47eddb6?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        oil: "https://images.unsplash.com/photo-1767180906945-bb92ba750118?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        brake: "https://images.unsplash.com/photo-1777669936049-d0c3230e7c30?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        battery: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&q=80&w=1200",
        tyre: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200",
        ac: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200",
        interior: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=80&w=1200",
        wheel: "https://images.unsplash.com/photo-1721909407299-5ba060675f8d?auto=format&fit=crop&q=80&w=1200",
        general: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"
    },
    bike: {
        engine: "https://images.unsplash.com/photo-1600761166775-4b85aa5b8534?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        oil: "https://images.unsplash.com/photo-1723120589136-7522d0b05eb3?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        brake: "https://images.unsplash.com/photo-1762012507780-060fe0bcc783?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        chain: "https://images.unsplash.com/photo-1670223649898-f445fb1f7710?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        battery: "https://images.unsplash.com/photo-1781549013775-e5feffd449bd?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        tyre: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200",
        general: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"
    }
};

const getServiceImage = (service) => {
    const name = (service.repairMode || service.name || "").toLowerCase();
    const type = (service.vehicleType || "Car").toLowerCase();
    const images = type === "bike" ? serviceImages.bike : serviceImages.car;

    if (name.includes("engine")) return images.engine;
    if (name.includes("oil")) return images.oil;
    if (name.includes("brake")) return images.brake;
    if (name.includes("battery")) return images.battery;
    if (name.includes("tyre") || name.includes("tire")) return images.tyre;
    if (name.includes("chain")) return images.chain || images.general;
    if (name.includes("ac")) return images.ac || images.general;
    if (name.includes("interior")) return images.interior || images.general;
    if (name.includes("wheel")) return images.wheel || images.general;
    return images.general;
};

export default function Services() {
    const [type, setType] = useState("All");
    const [services, setServices] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const selectedType = searchParams.get("type");

        if (selectedType === "car") {
            setType("Car");
        }

        if (selectedType === "bike") {
            setType("Bike");
        }

        getData("services")
            .then((data) => setServices(data))
            .catch(() => setServices([]));
    }, [searchParams]);

    const filteredServices = services.filter((service) => {
        return type === "All" || service.vehicleType === type;
    });

    return (
        <div className="container">
            <PageHeader title="Our Services" subtitle="Professional care for cars and bikes" />

            <div className="table-toolbar service-filter-buttons">
                <button className={type === "All" ? "active-filter" : ""} type="button" onClick={() => setType("All")}>All</button>
                <button className={type === "Car" ? "active-filter" : ""} type="button" onClick={() => setType("Car")}>Car</button>
                <button className={type === "Bike" ? "active-filter" : ""} type="button" onClick={() => setType("Bike")}>Bike</button>
            </div>

            <div className="card-grid">
                {filteredServices.map((service) => (
                    <article className="service-card" key={service.id}>
                        <img
                            className="service-image"
                            src={getServiceImage(service)}
                            alt={service.vehicleType + " " + (service.repairMode || service.name) + " service"}
                            onError={(e) => {
                                e.currentTarget.src = service.vehicleType === "Bike"
                                    ? "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&q=80&w=1200"
                                    : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200";
                            }}
                        />
                        <span>{service.vehicleType}</span>
                        <h3>{service.name}</h3>
                        <p>{service.repairMode || "General Service"}</p>
                        <strong>₹{service.price}</strong>
                        <Link className="primary-btn" to={`/book-service?type=${service.vehicleType.toLowerCase()}&service=${encodeURIComponent(service.repairMode || service.name)}`}>
                            Book Now
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}