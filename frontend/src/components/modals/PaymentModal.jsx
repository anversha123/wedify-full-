import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, onSuccess, onClose }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("Payment succeeded!");
            toast.success("Payment Successful!");
            onSuccess();
            onClose();
        } else {
            setMessage("Unexpected state.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-6 py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    `Pay ₹${amount.toLocaleString()}`
                )}
            </button>
        </form>
    );
}

export default function PaymentModal({ isOpen, onClose, booking, onPaymentSuccess }) {
    const [clientSecret, setClientSecret] = useState("");
    const advanceAmount = booking ? Math.round(booking.totalPrice * 0.2) : 0;

    useEffect(() => {
        if (isOpen && advanceAmount > 0) {
            const createIntent = async () => {
                try {
                    // Amount in paise
                    const data = await api.createPaymentIntent({
                        amount: advanceAmount * 100,
                        currency: "inr"
                    });
                    setClientSecret(data.clientSecret);
                } catch (error) {
                    console.error("Payment intent error:", error);
                    toast.error("Failed to initialize payment");
                }
            };
            createIntent();
        }
    }, [isOpen, advanceAmount]);

    // Memoize options to prevent re-renders related to "mutable property" warning
    const options = useMemo(() => ({
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    }), [clientSecret]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-rose-50/30">
                    <div>
                        <h2 className="text-2xl font-serif text-stone-800">Secure Advance Payment</h2>
                        <p className="text-sm text-stone-500">Booking #{booking?.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <X size={24} className="text-stone-400" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-8 p-6 bg-stone-900 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-stone-200">
                        <div>
                            <p className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-1">Advance to Pay (20%)</p>
                            <h3 className="text-3xl font-bold">₹{advanceAmount.toLocaleString()}</h3>
                        </div>
                    </div>

                    {clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm
                                amount={advanceAmount}
                                onSuccess={() => onPaymentSuccess(booking.id, 'card')}
                                onClose={onClose}
                            />
                        </Elements>
                    ) : (
                        <div className="flex justify-center p-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

