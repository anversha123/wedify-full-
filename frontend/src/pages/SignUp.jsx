import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function SignUp() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.userSignup({
                name: `${firstName} ${lastName}`,
                email,
                password
            });
            toast.success('Account created successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create account");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-stone-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-rose-500 font-bold mb-2">Create Account</h2>
                    <p className="text-stone-500">Join Wedify to plan your dream wedding</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white py-3.5 rounded-xl font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-stone-400">
                    Already have an account? <Link to="/login" className="text-rose-500 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}
