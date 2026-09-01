import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getData, updateData } from "../users/user";
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

export default function MyBookings() {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const loadBookings = () => {
        getData("bookings")
            .then((data) => {
                setBookings(data.filter((item) => String(item.customerId) === String(user.id)));
            })
            .catch(() => setBookings([]));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const editBooking = (booking) => {
        navigate(`/book-service?edit=${booking.id}`);
    };

    const cancelBooking = (id) => {
        const booking = bookings.find((item) => String(item.id) === String(id));

        if (!booking) {
            return;
        }

        if (!window.confirm("Do you want to cancel this booking?")) {
            return;
        }

        updateData("bookings", id, {
            ...booking,
            status: "Cancelled"
        })
            .then(() => {
                alert("Booking cancelled.");
                loadBookings();
            })
            .catch(() => alert("Unable to cancel booking."));
    };

    return (
        <div className="container">
            <PageHeader title="My Bookings" subtitle="Track all your service bookings" />

            <div className="booking-list">
                {bookings.length > 0 ? bookings.map((booking) => (
                    <article className="booking-item" key={booking.id}>
                        <div>
                            <h3>Booking #{booking.id}</h3>
                            <p>{booking.vehicle} • {booking.repairMode || booking.service}</p>
                            <small>{booking.date} • {booking.time} • {booking.center}</small>
                        </div>

                        <span className="status">{booking.status}</span>

                        {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                            <div className="booking-actions">
                                <button className="edit-booking-btn" type="button" onClick={() => editBooking(booking)}>
                                    Edit Booking
                                </button>
                                <button className="cancel-booking-btn" type="button" onClick={() => cancelBooking(booking.id)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </article>
                )) : <p>No bookings found.</p>}
            </div>
        </div>
    );
}