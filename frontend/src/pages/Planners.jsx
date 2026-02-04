import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

export default function Planners() {
    const navigate = useNavigate();
    const [planners, setPlanners] = useState([]);

    useEffect(() => {
        fetchPlanners();
    }, []);

    const fetchPlanners = async () => {
        try {
            const data = await api.getPlanners();
            setPlanners(data);
        } catch (error) {
            console.error("Failed to fetch planners", error);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">
                        Expert Event Planners
                    </h1>
                    <p className="text-lg text-stone-600 mb-8">
                        Connect with top-tier wedding planners to make your dream event a reality.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {planners.map(planner => (
                        <div key={planner.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-stone-100 group">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={planner.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
                                    alt={planner.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{planner.name}</h3>
                                    <p className="text-sm opacity-90">{planner.location}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-stone-600 line-clamp-2 text-sm">{planner.description}</p>
                                </div>

                                <div className="flex items-center justify-between mb-4 bg-stone-50 p-3 rounded-xl">
                                    <div className="text-xs text-stone-500 font-medium">BASE PRICE (1000 GUESTS)</div>
                                    <div className="text-rose-600 font-bold text-lg">₹{planner.basePrice.toLocaleString()}</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-stone-600">
                                        <span>📞</span> {planner.contact}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/planner/${planner.id}`)}
                                        className="w-full mt-4 bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors"
                                    >
                                        View Details & Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {planners.length === 0 && (
                    <div className="text-center py-20 text-stone-500">
                        <p className="text-xl">No planners found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
