import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { VENDOR_DATA } from '../data/mockData';
import { ArrowLeft, Check, Star, MapPin, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useQuotes } from '../context/QuoteContext';
import { useAuth } from '../context/AuthContext';

export default function GroupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addQuote } = useQuotes();

    const group = VENDOR_DATA.find(v => v.id === parseInt(id));

    const [guestCount, setGuestCount] = useState(100);
    const [location, setLocation] = useState('');
    const [selectedSubVendors, setSelectedSubVendors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!group) return <div>Group not found</div>;

    const handleVendorToggle = (vendorId) => {
        setSelectedSubVendors(prev => {
            if (prev.includes(vendorId)) {
                return prev.filter(id => id !== vendorId);
            }
            return [...prev, vendorId];
        });
    };

    const calculateTotal = () => {
        let total = group.priceStart;
        total += guestCount * (group.costPerGuest || 0); // Base guest cost if any

        selectedSubVendors.forEach(vId => {
            const sub = group.subVendors.find(v => v.id === vId);
            if (sub) total += sub.price;
        });

        return total;
    };

    const handleRequestQuote = () => {
        setIsSubmitting(true);
        const quoteData = {
            plannerId: group.id,
            plannerName: group.name,
            userId: user ? user.name : 'Guest',
            date: new Date().toISOString(), // In real app, pass selected date from dashboard
            guestCount,
            location,
            selectedSubVendors: group.subVendors.filter(v => selectedSubVendors.includes(v.id)),
            totalAmount: calculateTotal(),
            basePrice: group.priceStart,
            contact: group.contact
        };

        addQuote(quoteData);

        toast.success("Quote request submitted successfully! An admin will review it shortly.");

        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <Navbar />

            {/* Header Image */}
            <div className="h-[40vh] relative">
                <img src={group.image} className="w-full h-full object-cover" alt={group.name} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft size={18} /> Back to Search
                        </button>
                        <h1 className="text-5xl font-serif text-white mb-2">{group.name}</h1>
                        <p className="text-white/90 text-xl flex items-center gap-2">
                            {group.category} Specialist
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                            <h2 className="text-2xl font-serif text-stone-800 mb-6">About the Planner</h2>
                            <p className="text-stone-600 leading-relaxed text-lg mb-6">
                                {group.description}
                            </p>

                            {group.subVendors && group.subVendors.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-stone-800 mb-4">Included Vendors & Services</h3>
                                    <p className="text-stone-500 mb-4">Select the additional services managed by this group to add to your package:</p>
                                    <div className="space-y-3">
                                        {group.subVendors.map(sub => (
                                            <label key={sub.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedSubVendors.includes(sub.id) ? 'border-rose-500 bg-rose-50' : 'border-stone-200 hover:border-rose-300'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubVendors.includes(sub.id)}
                                                        onChange={() => handleVendorToggle(sub.id)}
                                                        className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-stone-800">{sub.name}</div>
                                                        <div className="text-xs text-stone-500 uppercase">{sub.type}</div>
                                                    </div>
                                                </div>
                                                <div className="font-medium text-stone-600">+₹{sub.price}</div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 sticky top-32">
                            <div className="mb-6 pb-6 border-b border-stone-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Base Package</p>
                                        <p className="text-3xl font-serif text-rose-500">₹{group.priceStart.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star fill="currentColor" size={18} />
                                        <span className="font-bold text-stone-800 text-lg">{group.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 flex items-center gap-2">
                                            <Users size={16} /> Number of Guests
                                        </label>
                                        <input
                                            type="number"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:outline-none"
                                            min="0"
                                        />
                                        <p className="text-xs text-stone-400 mt-1">Estimates based on ₹{group.costPerGuest || 0} / person</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-stone-600 mb-1 flex items-center gap-2">
                                            <MapPin size={16} /> Event Location
                                        </label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-rose-500 focus:outline-none"
                                            placeholder="City, Venue, or Address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-between items-center">
                                <span className="font-bold text-stone-700">Estimated Total</span>
                                <span className="text-2xl font-bold text-stone-900">₹{calculateTotal().toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleRequestQuote}
                                disabled={isSubmitting || !location}
                                className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Request Quote'}
                            </button>

                            {!location && <p className="text-xs text-center text-red-400">Please enter a location to request a quote</p>}

                            <p className="text-center text-xs text-stone-400 mt-4">
                                Typically responds within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
