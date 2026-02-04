// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import Navbar from '../components/layout/Navbar';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import PaymentModal from '../components/modals/PaymentModal';
// import api from '../services/api';

// export default function UserDashboard() {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [myBookings, setMyBookings] = useState([]);
//     const [planners, setPlanners] = useState([]);
//     const [hasSearched, setHasSearched] = useState(false);

//     const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//     useEffect(() => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }
//         fetchMyBookings();
//         fetchPlanners();
//     }, [user, navigate]);

//     const fetchPlanners = async () => {
//         try {
//             const data = await api.getPlanners();
//             setPlanners(data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchMyBookings = async () => {
//         try {
//             const allBookings = await api.getBookings();
//             const myRequests = allBookings.filter(b => b.userEmail === user.email);
//             setMyBookings(myRequests);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleDateSelect = (date) => {
//         setSelectedDate(date);
//         if (date) {
//             setHasSearched(true);
//         } else {
//             setHasSearched(false);
//         }
//     };

//     // const handlePaymentSuccess = async (bookingId, method) => {
//     //     try {
//     //         await api.updateBooking(bookingId, { paymentStatus: 'paid', paymentMethod: method });
//     //         fetchMyBookings();
//     //         toast.success("Payment recorded!");
//     //     } catch (error) {
//     //         console.error(error);
//     //         toast.error("Failed to update payment status");
//     //     }
//     // };
//     // Inside your PaymentModal component
// // Inside UserDashboard.js
// const handlePaymentSuccess = async (bookingId, method) => {
//     try {
//         // Update the backend status
//         await api.updateBooking(bookingId, { 
//             paymentStatus: 'paid', 
//             paymentMethod: method 
//         });

//         // Close the modal and refresh data
//         setIsPaymentModalOpen(false);
//         setSelectedBookingForPayment(null);
//         fetchMyBookings();

//         toast.success("Payment successful! Booking confirmed.");
//     } catch (error) {
//         console.error(error);
//         toast.error("Payment confirmed, but failed to update dashboard. Please refresh.");
//     }
// };


// const handleSubmit = async (event) => {
//   event.preventDefault();
//   setLoading(true); // Start spinner

//   try {
//     // 1. Get the Secret from your Django backend
//     // Make sure the amount is passed correctly (e.g., booking.totalPrice)
//     const { data } = await api.post('/create-payment-intent/', { 
//       amount: booking.totalPrice 
//     });

//     const clientSecret = data.clientSecret;

//     // 2. Confirm the payment with Stripe
//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//       },
//     });

//     if (result.error) {
//       toast.error(result.error.message);
//       setLoading(false); // Stop spinner on error
//     } else if (result.paymentIntent.status === 'succeeded') {
//       // 3. Inform the parent (Dashboard) that we are done!
//       onPaymentSuccess(booking.id, 'stripe');
//     }
//   } catch (err) {
//     console.error("Payment Error:", err);
//     toast.error("Server connection failed");
//     setLoading(false); // Stop spinner on crash
//   }
// };

//     return (
//         <div className="min-h-screen bg-stone-50">
//             <Navbar />

//             <div className="container mx-auto px-6 pt-32 pb-12">
//                 <div className="grid md:grid-cols-12 gap-12">

//                     {/* Sidebar / Calendar Section */}
//                     <div className="md:col-span-4">
//                         <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 sticky top-32">
//                             <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
//                                 <Calendar className="text-rose-500" /> Select Your Date
//                             </h2>
//                             <div className="flex justify-center">
//                                 <style>{`
//                    .rdp { --rdp-accent-color: #f43f5e; --rdp-background-color: #fff1f2; margin: 0; }
//                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #fff1f2; color: #f43f5e; }
//                  `}</style>
//                                 <DayPicker
//                                     mode="single"
//                                     selected={selectedDate}
//                                     onSelect={handleDateSelect}
//                                     disabled={{ before: new Date() }}
//                                     modifiersClassNames={{
//                                         selected: 'bg-rose-500 text-white hover:bg-rose-600',
//                                         today: 'text-rose-500 font-bold'
//                                     }}
//                                 />
//                             </div>
//                             {selectedDate && (
//                                 <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100 text-center">
//                                     <p className="text-stone-600">You selected:</p>
//                                     <p className="text-xl font-bold text-rose-600 font-serif">
//                                         {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Main Content / Results Section */}
//                     <div className="md:col-span-8">

//                         {/* My Requests Section */}
//                         {myBookings.length > 0 && (
//                             <div className="mb-12">
//                                 <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
//                                     <span className="text-rose-500">✨</span> My Booking Requests
//                                 </h2>
//                                 <div className="space-y-4">
//                                     {myBookings.map(booking => (
//                                         <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4">
//                                             <div className="flex justify-between items-start w-full">
//                                                 <div className="flex-1">
//                                                     <h3 className="font-bold text-stone-800 mb-1">Request #{booking.id}</h3>
//                                                     <p className="text-sm text-stone-500">
//                                                         Planner: {booking.plannerName} • Guests: {booking.guestCount} • <span className="text-rose-600 font-bold">₹{booking.totalPrice?.toLocaleString() || 'N/A'}</span>
//                                                     </p>
//                                                     <div className="flex items-center gap-4 mt-2">
//                                                         <p className="text-xs text-stone-400">
//                                                             Date: {booking.date}
//                                                         </p>
//                                                         {booking.requirements?.groomName && (
//                                                             <span className="text-xs font-bold text-rose-500 italic">
//                                                                 ❤️ {booking.requirements.groomName} & {booking.requirements.brideName}
//                                                             </span>
//                                                         )}
//                                                         {booking.paymentStatus === 'paid' && (
//                                                             <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
//                                                                 <CheckCircle size={12} /> Advance Paid via {booking.paymentMethod?.toUpperCase()}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-right flex flex-col items-end gap-3">
//                                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'pending' ? 'bg-amber-100 text-amber-600' :
//                                                         booking.status === 'approved' ? 'bg-green-100 text-green-600' :
//                                                             'bg-red-100 text-red-600'
//                                                         }`}>
//                                                         {booking.status}
//                                                     </span>

//                                                     {booking.status === 'approved' && booking.paymentStatus !== 'paid' && (
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setSelectedBookingForPayment(booking);
//                                                                 setIsPaymentModalOpen(true);
//                                                             }}
//                                                             className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100"
//                                                         >
//                                                             <CreditCard size={14} /> Pay Advance
//                                                         </button>
//                                                     )}

//                                                     {booking.requirements?.groomName && (
//                                                         <button
//                                                             onClick={() => navigate(`/wedding-poster/${booking.id}`)}
//                                                             className="flex items-center gap-2 bg-white text-rose-500 border border-rose-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm"
//                                                         >
//                                                             ✨ View Poster
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Planners Banner */}
//                         {/* Planners List Logic */}
//                         {!selectedDate ? (
//                             <div className="bg-gradient-to-r from-stone-900 to-stone-800 p-8 rounded-3xl mb-12 text-white relative overflow-hidden">
//                                 <div className="relative z-10">
//                                     <h2 className="text-3xl font-serif mb-2">Need an Event Planner?</h2>
//                                     <p className="text-stone-300 mb-6 max-w-lg">
//                                         Select a date from the calendar to view available expert wedding planners matching your schedule.
//                                     </p>
//                                 </div>
//                                 <div className="absolute right-0 top-0 h-full w-1/3 bg-rose-500/10 rounded-l-full transform translate-x-12"></div>
//                             </div>
//                         ) : (
//                             <div className="mb-12">
//                                 <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
//                                     Available Planners for <span className="text-rose-600">{selectedDate.toLocaleDateString()}</span>
//                                 </h2>

//                                 {planners.length === 0 ? (
//                                     <p className="text-stone-500">No planners listed yet.</p>
//                                 ) : (
//                                     <div className="grid gap-6">
//                                         {planners.map(planner => (
//                                             <div key={planner.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6">
//                                                 <div className="w-full md:w-48 h-32 flex-shrink-0">
//                                                     <img
//                                                         src={planner.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
//                                                         alt={planner.name}
//                                                         className="w-full h-full object-cover rounded-xl"
//                                                     />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <div className="flex justify-between items-start">
//                                                         <div>
//                                                             <h3 className="text-xl font-bold text-stone-800">{planner.name}</h3>
//                                                             <p className="text-stone-500 text-sm mb-2">{planner.location}</p>
//                                                         </div>
//                                                         <div className="text-right">
//                                                             <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider">Starting From</span>
//                                                             <span className="text-xl font-bold text-rose-600">₹{planner.basePrice.toLocaleString()}</span>
//                                                         </div>
//                                                     </div>

//                                                     <p className="text-stone-600 text-sm mb-4 line-clamp-2">{planner.description}</p>

//                                                     <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50">
//                                                         <div className="text-sm text-stone-500">
//                                                             📞 {planner.contact}
//                                                         </div>
//                                                         <div>
//                                                             <button
//                                                                 onClick={() => navigate(`/planner/${planner.id}`, { state: { date: selectedDate.toLocaleDateString() } })}
//                                                                 className="px-6 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-sm font-bold shadow-md shadow-stone-200 transition-colors"
//                                                             >
//                                                                 View Details & Book
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         )}



//                     </div>

//                 </div>
//             </div>

//             {selectedBookingForPayment && (
//                 <PaymentModal
//                     isOpen={isPaymentModalOpen}
//                     onClose={() => {
//                         setIsPaymentModalOpen(false);
//                         setSelectedBookingForPayment(null);
//                     }}
//                     booking={selectedBookingForPayment}
//                     onPaymentSuccess={handlePaymentSuccess}
//                 />
//             )}
//         </div >
//     );
// }



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PaymentModal from '../components/modals/PaymentModal';
import api from '../services/api';

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [selectedDate, setSelectedDate] = useState(null);
    const [myBookings, setMyBookings] = useState([]);
    const [planners, setPlanners] = useState([]);
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyBookings();
        fetchPlanners();
    }, [user, navigate]);

    const fetchPlanners = async () => {
        try {
            const data = await api.getPlanners();
            setPlanners(data);
        } catch (error) {
            console.error("Error fetching planners:", error);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const allBookings = await api.getBookings();
            // Filter bookings belonging to the logged-in user
            const myRequests = allBookings.filter(b => b.userEmail === user.email);
            setMyBookings(myRequests);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    /**
     * This function is triggered AFTER the PaymentModal 
     * successfully finishes the Stripe handshake.
     */
    const handlePaymentUpdate = async (bookingId, method) => {
        try {
            // 1. Update the booking status in your database via Django
            await api.updateBooking(bookingId, {
                paymentStatus: 'paid',
                paymentMethod: method
            });

            // 2. Refresh the UI data
            await fetchMyBookings();

            // 3. Close the modal and cleanup
            setIsPaymentModalOpen(false);
            setSelectedBookingForPayment(null);

            toast.success("Payment confirmed and booking updated!");
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Payment succeeded, but database update failed. Please contact support.");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-12">
                <div className="grid md:grid-cols-12 gap-12">

                    {/* Left: Calendar Section */}
                    <div className="md:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100 sticky top-32">
                            <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                                <Calendar className="text-rose-500" /> Select Your Date
                            </h2>
                            <div className="flex justify-center">
                                <style>{`
                                    .rdp { --rdp-accent-color: #f43f5e; --rdp-background-color: #fff1f2; margin: 0; }
                                `}</style>
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={{ before: new Date() }}
                                />
                            </div>
                            {selectedDate && (
                                <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100 text-center">
                                    <p className="text-stone-600">Selected:</p>
                                    <p className="text-xl font-bold text-rose-600 font-serif">
                                        {selectedDate.toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Bookings & Planners */}
                    <div className="md:col-span-8">
                        {/* 1. My Booking Requests */}
                        {myBookings.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                                    <span className="text-rose-500">✨</span> My Booking Requests
                                </h2>
                                <div className="space-y-4">
                                    {myBookings.map(booking => (
                                        <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-stone-800">Request #{booking.id}</h3>
                                                    <p className="text-sm text-stone-500">
                                                        Planner: {booking.plannerName} •
                                                        <span className="text-rose-600 font-bold ml-1">₹{booking.totalPrice?.toLocaleString()}</span>
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-stone-400">Date: {booking.date}</span>
                                                        {booking.paymentStatus === 'paid' && (
                                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
                                                                <CheckCircle size={12} /> Paid
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                        }`}>
                                                        {booking.status}
                                                    </span>

                                                    {/* Show Poster Button only if names are available */}
                                                    {booking.requirements?.groomName && (
                                                        <button
                                                            onClick={() => navigate(`/wedding-poster/${booking.id}`)}
                                                            className="flex items-center gap-2 bg-white text-rose-500 border border-rose-100 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm"
                                                        >
                                                            ✨ View Poster
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Planners List Section */}
                        <div className="mb-12">
                            {!selectedDate ? (
                                <div className="bg-gradient-to-r from-stone-900 to-stone-800 p-8 rounded-3xl mb-12 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-serif mb-2">Need an Event Planner?</h2>
                                        <p className="text-stone-300 mb-6 max-w-lg">
                                            Select a date from the calendar to view available expert wedding planners matching your schedule.
                                        </p>
                                    </div>
                                    <div className="absolute right-0 top-0 h-full w-1/3 bg-rose-500/10 rounded-l-full transform translate-x-12"></div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                                        Available Planners for <span className="text-rose-600">{selectedDate.toLocaleDateString()}</span>
                                    </h2>

                                    {planners.length === 0 ? (
                                        <p className="text-stone-500">No planners listed yet.</p>
                                    ) : (
                                        <div className="grid gap-6">
                                            {planners.map(planner => (
                                                <div key={planner.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6">
                                                    <div className="w-full md:w-48 h-32 flex-shrink-0">
                                                        <img
                                                            src={planner.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"}
                                                            alt={planner.name}
                                                            className="w-full h-full object-cover rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-xl font-bold text-stone-800">{planner.name}</h3>
                                                                <p className="text-stone-500 text-sm mb-2">{planner.location}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider">Starting From</span>
                                                                <span className="text-xl font-bold text-rose-600">₹{planner.basePrice.toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <p className="text-stone-600 text-sm mb-4 line-clamp-2">{planner.description}</p>

                                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50">
                                                            <div className="text-sm text-stone-500">
                                                                📞 {planner.contact}
                                                            </div>
                                                            <div>
                                                                <button
                                                                    onClick={() => navigate(`/planner/${planner.id}`, { state: { date: selectedDate.toLocaleDateString() } })}
                                                                    className="px-6 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-sm font-bold shadow-md shadow-stone-200 transition-colors"
                                                                >
                                                                    View Details & Book
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* The Payment Modal */}
            {selectedBookingForPayment && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedBookingForPayment(null);
                    }}
                    booking={selectedBookingForPayment || {}}
                    onPaymentSuccess={handlePaymentUpdate}
                />
            )}
        </div>
    );
}