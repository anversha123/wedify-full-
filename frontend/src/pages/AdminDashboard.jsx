import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [planners, setPlanners] = useState([]);
    const [newPlanner, setNewPlanner] = useState({
        name: '',
        contact: '',
        location: '',
        basePrice: '',
        description: '',
        image: '',
        username: '',
        password: ''
    });

    const [editingPlannerId, setEditingPlannerId] = useState(null);

    useEffect(() => {
        fetchPlanners();
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await api.getBookings();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings", error);
            // toast.error("Failed to fetch bookings");
        }
    };

    const fetchPlanners = async () => {
        try {
            const data = await api.getPlanners();
            setPlanners(data);
        } catch (error) {
            console.error("Error fetching planners", error);
            // toast.error("Failed to fetch planners");
        }
    };


    const handleCreatePlanner = async (e) => {
        e.preventDefault();
        try {
            // Validate: check valid number for basePrice
            const plannerData = {
                ...newPlanner,
                basePrice: parseInt(newPlanner.basePrice) || 0
            };

            if (editingPlannerId) {
                // Update existing planner
                await api.updatePlanner(editingPlannerId, plannerData);
                toast.success("Planner updated!");
            } else {
                // Create new planner
                await api.createPlanner(plannerData);
                toast.success("Planner added!");
            }

            fetchPlanners();

            // Reset form
            setNewPlanner({ name: '', contact: '', location: '', basePrice: '', description: '', image: '', username: '', password: '' });
            setEditingPlannerId(null);

        } catch (error) {
            console.error("Error saving planner", error);
            toast.error("Error saving planner: " + error.message);
        }
    };

    const handleEditPlanner = (planner) => {
        setNewPlanner({
            ...planner,
            password: planner.password || '', // Ensure password field is populated or empty string if not returned/wanted
            // Logic note: Backend might not return password for security, but for simple Planner model it does.
        });
        setEditingPlannerId(planner.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePlanner = async (id) => {
        if (!confirm("Are you sure you want to delete this planner?")) return;
        try {
            await api.deletePlanner(id);
            toast.success("Planner deleted");
            fetchPlanners();

            if (editingPlannerId === id) {
                setNewPlanner({ name: '', contact: '', location: '', basePrice: '', description: '', image: '', username: '', password: '' });
                setEditingPlannerId(null);
            }
        } catch (error) {
            console.error("Error deleting planner", error);
            toast.error("Error deleting planner");
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!confirm("Are you sure you want to delete this booking request?")) return;
        try {
            await api.deleteBooking(id);
            setBookings(prev => prev.filter(b => b.id !== id));
            toast.success("Booking deleted");
        } catch (e) {
            toast.error("Failed to delete booking");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-serif text-stone-800 mb-2">Admin Dashboard</h1>
                        <p className="text-stone-500">Full control over Venues, Planners, and Bookings</p>
                    </div>
                </div>

                {/* Planners Management Section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-12">
                    <h2 className="text-2xl font-serif text-stone-800 mb-6">{editingPlannerId ? 'Edit Event Planner' : 'Manage Event Planners'}</h2>

                    {/* Add/Edit Planner Form */}
                    <form onSubmit={handleCreatePlanner} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-6 rounded-2xl">
                        <input
                            type="text"
                            placeholder="Planner/Company Name"
                            value={newPlanner.name}
                            onChange={(e) => setNewPlanner({ ...newPlanner, name: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Contact Info"
                            value={newPlanner.contact}
                            onChange={(e) => setNewPlanner({ ...newPlanner, contact: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={newPlanner.username}
                            onChange={(e) => setNewPlanner({ ...newPlanner, username: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newPlanner.password}
                            onChange={(e) => setNewPlanner({ ...newPlanner, password: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newPlanner.location}
                            onChange={(e) => setNewPlanner({ ...newPlanner, location: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Base Price (for 1000 guests)"
                            value={newPlanner.basePrice}
                            onChange={(e) => setNewPlanner({ ...newPlanner, basePrice: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={newPlanner.image}
                            onChange={(e) => setNewPlanner({ ...newPlanner, image: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 md:col-span-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={newPlanner.description}
                            onChange={(e) => setNewPlanner({ ...newPlanner, description: e.target.value })}
                            className="p-3 bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 md:col-span-2"
                            rows="3"
                        />
                        <div className="md:col-span-2 flex gap-4">
                            <button type="submit" className="flex-1 bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-900 transition-colors">
                                {editingPlannerId ? 'Update Planner' : 'Add Planner'}
                            </button>
                            {editingPlannerId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPlannerId(null);
                                        setNewPlanner({ name: '', contact: '', location: '', basePrice: '', description: '', image: '', username: '', password: '' });
                                    }}
                                    className="px-6 py-3 bg-stone-200 text-stone-700 rounded-xl hover:bg-stone-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Planners List */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {planners.map(planner => (
                            <div key={planner.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative group">
                                <h3 className="font-bold text-lg text-stone-800 pr-16">{planner.name}</h3>
                                <p className="text-stone-500 text-sm">{planner.location}</p>
                                <p className="text-stone-500 text-sm mt-1">{planner.contact}</p>
                                <p className="text-xs text-stone-400 mt-2">Base Price (1000 pax): ₹{planner.basePrice}</p>
                                <p className="text-xs text-stone-400 mt-1">User: {planner.username} | Pass: {planner.password}</p>

                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => handleEditPlanner(planner)}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlanner(planner.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                <h2 className="text-2xl font-serif text-stone-800 mb-6">Monitor Bookings</h2>
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-200">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-stone-700 mb-2">No Requests Yet</h3>
                        <p className="text-stone-500">Bookings will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6 justify-between items-center group relative">
                                <button
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="absolute top-4 right-4 bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                    title="Delete Booking"
                                >
                                    🗑️
                                </button>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-800">Booking #{booking.id}</h3>
                                    <p className="text-stone-500">Planner: {booking.plannerName || 'N/A'}</p>
                                    <p className="text-stone-500 font-medium">For: {booking.userEmail}</p>
                                    <p className="text-stone-500">Date: {booking.date}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded bg-stone-100`}>
                                            Couple: {booking.requirements?.groomName} & {booking.requirements?.brideName} | Guests: {booking.guestCount} | Total: ₹{booking.totalPrice?.toLocaleString() || 'N/A'} | Address: {booking.requirements?.address || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-4 py-2 rounded-full font-bold text-sm ${booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
