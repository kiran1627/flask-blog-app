import React, { useState } from "react";
import axios from "axios";

const TableBooking = ({ setIsTableBooked }) => {
    const [booking, setBooking] = useState({
        customer_name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
    });

    const [confirmation, setConfirmation] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { customer_name, email, phone, date, time, guests } = booking;

        if (!customer_name || !email || !phone || !date || !time || !guests) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/booking/book_table", {
                customer_name,
                email,
                phone,
                date,
                time,
                guests: parseInt(guests),
            });

            const { booking_id } = response.data;

            setConfirmation(`✅ Table booked under ${customer_name} on ${date} at ${time}. Booking ID: ${booking_id}`);
            setIsTableBooked(true);

            setBooking({
                customer_name: "",
                email: "",
                phone: "",
                date: "",
                time: "",
                guests: "",
            });

            // Navigate to homepage or another screen if needed
            // e.g., window.location.href = "/";

        } catch (err) {
            console.error("❌ Booking Error:", err);
            alert("❌ Failed to book table. Please try again.");
        }
    };

    return (
        <div className="table-booking">
            <h3>🍽️ Book a Table</h3>
            <form onSubmit={handleSubmit} className="booking-form">
                <input
                    type="text"
                    name="customer_name"
                    placeholder="Your Name"
                    value={booking.customer_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={booking.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={booking.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={booking.date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={booking.time}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="guests"
                    placeholder="No. of Guests"
                    value={booking.guests}
                    onChange={handleChange}
                    required
                    min="1"
                />
                <button type="submit">Book Table</button>
            </form>

            {confirmation && <p className="booking-confirmation">{confirmation}</p>}
        </div>
    );
};

export default TableBooking;
