import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MenuItems from "./Menu";
import "../styles/main.css";

const CATEGORIES = ["Main Course", "Snacks", "Beverages", "Dessert"];

const AdminPanel = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [form, setForm] = useState({ id: null, name: "", price: "", category: CATEGORIES[0] });
    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState("");

    // Load from localStorage
    useEffect(() => {
        const savedItems = JSON.parse(localStorage.getItem("menuItems")) || [];
        setMenuItems(savedItems);
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("menuItems", JSON.stringify(menuItems));
    }, [menuItems]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            setMenuItems(menuItems.map(item => item.id === form.id ? form : item));
            setEditMode(false);
        } else {
            setMenuItems([...menuItems, { ...form, id: Date.now() }]);
        }
        setForm({ id: null, name: "", price: "", category: CATEGORIES[0] });
    };

    const handleEdit = (item) => {
        setForm(item);
        setEditMode(true);
    };

    const handleDelete = (id) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            className="admin-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2>🛠️ Admin Panel – Menu Management</h2>

            <form onSubmit={handleSubmit} className="menu-form">
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    required
                    onChange={(e) => setForm({ ...form, price: +e.target.value })}
                />
                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    {CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
                <button type="submit">{editMode ? "Update" : "Add"} Item</button>
            </form>

            <input
                type="text"
                placeholder="🔍 Search by name/category..."
                className="search-bar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <MenuItems
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </motion.div>
    );
};

export default AdminPanel;
