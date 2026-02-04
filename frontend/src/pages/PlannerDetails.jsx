import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function PlannerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const initialDate = location.state?.date || null;

    const [planner, setPlanner] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [guestCount, setGuestCount] = useState('');
    const [place, setPlace] = useState('');
    const [photography, setPhotography] = useState(false);
    const [videography, setVideography] = useState(false);
    const [decorations, setDecorations] = useState('');
    const [address, setAddress] = useState('');
    const [groomName, setGroomName] = useState('');
    const [brideName, setBrideName] = useState('');
    const [couplePhoto, setCouplePhoto] = useState('');
    const [posterTheme, setPosterTheme] = useState('modern');

    const SERVICE_PRICES = {
        photography: 25000,
        videography: 35000
    };

    const calculateTotal = () => {
        if (!planner) return 0;
        let total = planner.basePrice;
        if (photography) total += SERVICE_PRICES.photography;
        if (videography) total += SERVICE_PRICES.videography;
        return total;
    };

    useEffect(() => {
        const fetchPlanner = async () => {
            try {
                // Fetch all and find, or we could add getPlannerById to api.js
                // Efficient enough for now
                const planners = await api.getPlanners();
                const found = planners.find(p => p.id === parseInt(id));
                if (found) {
                    setPlanner(found);
                } else {
                    toast.error("Planner not found");
                    navigate('/planners');
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load planner details");
            } finally {
                setLoading(false);
            }
        };
        fetchPlanner();
    }, [id, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to book");
            return;
        }

        if (!initialDate) {
            toast.error("No date selected. Please go back and select a date.");
            return;
        }

        try {
            const totalPrice = calculateTotal();
            const newBooking = {
                plannerId: planner.id,
                venueId: planner.id, // For legacy frontend compatibility in Dashboard
                plannerName: planner.name,
                userEmail: user.email,
                date: initialDate,
                guestCount: parseInt(guestCount) || 0,
                requirements: {
                    place,
                    photography,
                    videography,
                    decorations,
                    address,
                    groomName,
                    brideName,
                    couplePhoto,
                    posterTheme
                },
                totalPrice: totalPrice,
                status: 'pending'
            };

            await api.createBooking(newBooking);

            toast.success('Booking request sent successfully!');
            navigate('/dashboard'); // Back to user dashboard (was vendors, but probably dashboard is better)

        } catch (error) {
            console.error(error);
            toast.error('Error sending request');
        }
    };

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading...</div>;
    if (!planner) return null;

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-12">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100">
                    <div className="h-64 md:h-96 relative">
                        <img
                            src={planner.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
                            alt={planner.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                            <h1 className="text-3xl md:text-5xl font-serif mb-2">{planner.name}</h1>
                            <p className="text-lg opacity-90">📍 {planner.location}</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12">
                        {/* Details Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">About The Planner</h3>
                                <p className="text-stone-600 leading-relaxed">
                                    {planner.description}
                                </p>
                            </div>

                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                <h4 className="font-bold text-stone-800 mb-4">Pricing & Contact</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Base Price (1000 pax)</span>
                                        <span className="font-bold text-rose-600">₹{planner.basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Contact</span>
                                        <span className="font-medium text-stone-800">{planner.contact}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form Column */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                            <h3 className="text-2xl font-serif text-stone-800 mb-6">Request Booking</h3>
                            <p className="text-sm text-stone-500 mb-6">
                                For Date: <span className="font-bold text-rose-500">{initialDate || "Not selected"}</span>
                            </p>

                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Number of Guests</label>
                                    <input
                                        type="number"
                                        required
                                        value={guestCount}
                                        onChange={e => setGuestCount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                        placeholder="e.g. 500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Groom's Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={groomName}
                                            onChange={e => setGroomName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                            placeholder="Groom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Bride's Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={brideName}
                                            onChange={e => setBrideName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                            placeholder="Bride"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Couple Photo URL (Optional)</label>
                                    <input
                                        type="url"
                                        value={couplePhoto}
                                        onChange={e => setCouplePhoto(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                        placeholder="https://example.com/your-photo.jpg"
                                    />
                                    <p className="text-[10px] text-stone-400 mt-1 italic">Add a photo of the couple for the wedding poster</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Select Wedding Poster Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['modern', 'royal', 'floral', 'vintage'].map(theme => (
                                            <button
                                                key={theme}
                                                type="button"
                                                onClick={() => setPosterTheme(theme)}
                                                className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${posterTheme === theme ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
                                            >
                                                {theme} Theme
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Event Location / Place</label>
                                    <input
                                        type="text"
                                        required
                                        value={place}
                                        onChange={e => setPlace(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                        placeholder="City or Venue preference"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">User Address</label>
                                    <textarea
                                        required
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                        rows="2"
                                        placeholder="Your complete address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Additional Services</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={photography}
                                                onChange={e => setPhotography(e.target.checked)}
                                                className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                                            />
                                            <span className="text-stone-600">Photography</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={videography}
                                                onChange={e => setVideography(e.target.checked)}
                                                className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                                            />
                                            <span className="text-stone-600">Videography</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Decorations (Theme/Color/Notes)</label>
                                    <textarea
                                        value={decorations}
                                        onChange={e => setDecorations(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500"
                                        rows="3"
                                        placeholder="Describe your decoration needs..."
                                    />
                                </div>

                                {/* Price Summary Section */}
                                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Base Price</span>
                                        <span className="font-medium text-stone-800">₹{planner.basePrice.toLocaleString()}</span>
                                    </div>
                                    {photography && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-500">Photography Service</span>
                                            <span className="font-medium text-stone-800">+₹{SERVICE_PRICES.photography.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {videography && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-500">Videography Service</span>
                                            <span className="font-medium text-stone-800">+₹{SERVICE_PRICES.videography.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-rose-100 flex justify-between items-center">
                                        <span className="font-bold text-stone-700">Total Estimation</span>
                                        <span className="text-xl font-bold text-rose-600">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors mt-4"
                                >
                                    Confirm Booking Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
