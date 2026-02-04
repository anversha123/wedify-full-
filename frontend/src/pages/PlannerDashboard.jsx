import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../context/VendorContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function PlannerDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myProfile, setMyProfile] = useState(null);

    useEffect(() => {
        if (user && user.role === 'planner') {
            setMyProfile(user);
            fetchBookings(user.id);
        }
    }, [user]);

    const fetchBookings = async (plannerId) => {
        try {
            // Fetch bookings for this planner. 
            // My API service getBookings(plannerId) appends ?planner_id=X
            // My backend BookingRequestViewSet filters by planner_id.
            // But wait, the model field is `planner` (FK) and `venueId`.
            // My backend filter code: `queryset = queryset.filter(planner_id=planner_id)`.
            // So if I pass `planner_id` query param, it filters by `planner_id` column (Django convention for FK id).
            // However, legacy bookings created via localStorage might have venueId but not plannerId FK.
            // Since we are migrating, new bookings will have it. Old localStorage bookings are gone (or manually migrated if I did that, which I haven't).
            const data = await api.getBookings(plannerId);
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings");
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
            await api.updateBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            toast.success(`Booking ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (!user || user.role !== 'planner') {
        return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Access Denied</div>;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Profile Section */}
                    <div>
                        <h1 className="text-4xl font-serif text-stone-800 mb-8">My Planner Profile</h1>

                        {myProfile ? (
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3">
                                    <img
                                        src={myProfile.image || "https://via.placeholder.com/400"}
                                        alt={myProfile.name}
                                        className="w-full h-64 object-cover rounded-2xl shadow-sm"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-stone-800">{myProfile.name}</h2>
                                        <p className="text-rose-500 font-medium">{myProfile.location}</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                                        <p className="text-sm text-stone-500 uppercase tracking-wide font-bold mb-1">Base Price (1000 Guests)</p>
                                        <p className="text-2xl font-bold text-stone-900">₹{myProfile.basePrice.toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-stone-700 leading-relaxed">{myProfile.description}</p>
                                    </div>

                                    <div className="pt-4 border-t border-stone-100">
                                        <p className="font-bold text-stone-800 mb-1">Contact Information</p>
                                        <p className="text-stone-600">{myProfile.contact}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white rounded-3xl shadow-sm">Loading Profile...</div>
                        )}
                    </div>

                    {/* Bookings Section */}
                    <div>
                        <h2 className="text-3xl font-serif text-stone-800 mb-8">Manage Booking Requests</h2>

                        {bookings.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 text-center">
                                <div className="text-5xl mb-4">📭</div>
                                <h3 className="text-xl font-bold text-stone-700">No Booking Requests</h3>
                                <p className="text-stone-500">You haven't received any requests yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold mb-2">
                                                            REQ #{booking.id}
                                                        </span>
                                                        <h3 className="text-xl font-bold text-stone-800">{booking.date}</h3>
                                                        {booking.requirements?.groomName && (
                                                            <p className="text-rose-500 font-serif text-lg font-bold">
                                                                {booking.requirements.groomName} & {booking.requirements.brideName}
                                                            </p>
                                                        )}
                                                        <p className="text-stone-500">{booking.guestCount} Guests • <span className="text-rose-600 font-bold">₹{booking.totalPrice?.toLocaleString() || 'N/A'}</span></p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 text-right">
                                                        <div className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${booking.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                            booking.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {booking.status}
                                                        </div>
                                                        {booking.paymentStatus === 'paid' ? (
                                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                                                Advance Paid via {booking.paymentMethod}
                                                            </span>
                                                        ) : booking.status === 'approved' ? (
                                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                                                                Awaiting Payment
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                                    <div className="p-4 bg-stone-50 rounded-xl">
                                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Client Details</p>
                                                        <p className="font-medium text-stone-800">{booking.userEmail}</p>
                                                    </div>
                                                    <div className="p-4 bg-stone-50 rounded-xl">
                                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Location Preference</p>
                                                        <p className="font-medium text-stone-800">{booking.requirements?.place || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <p className="text-sm font-bold text-stone-700 mb-2">Additional Requirements:</p>
                                                    <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                                                        {booking.requirements?.photography && <li>📸 Photography Requested</li>}
                                                        {booking.requirements?.videography && <li>🎥 Videography Requested</li>}
                                                        {booking.requirements?.decorations && <li>💐 Decor: {booking.requirements.decorations}</li>}
                                                        {booking.requirements?.address && <li>🏠 Address: {booking.requirements.address}</li>}
                                                        {!booking.requirements?.photography && !booking.requirements?.videography && !booking.requirements?.decorations && !booking.requirements?.address && <li>No additional services requested</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                            {booking.status === 'pending' && (
                                                <div className="flex flex-col justify-center gap-3 md:w-48 md:border-l md:border-stone-100 md:pl-6">
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                                        className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                        className="w-full py-3 bg-white text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
