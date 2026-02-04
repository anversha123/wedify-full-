import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function Login() {
    const [role, setRole] = useState('user'); // 'user' | 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let loggedInUser;
            if (role === 'admin') {
                const response = await api.adminLogin(email, password);
                login({ ...response.user, tokens: response.tokens, role: 'admin' });
                toast.success(`Welcome back, ${response.user.username || response.user.email}!`);
                navigate('/admin/dashboard');
            } else {
                // For user, try to login. If fail, maybe signup? Or just login. 
                // The current Login.jsx implies simple login. 
                // Since I implemented user_signup separate, I'll stick to login here. 
                // If user doesn't exist, I might auto-signup for demo purposes if the user asked, but they didn't. 
                // However, the previous logic just "simulated" it, so any email worked.
                // To support "Connect all frontend", I should probably allow signup or just auto-create in backend if not found (lazy registration) for the demo.
                // But let's try strict login first. If it fails, I'll handle it.
                // Actually, I'll use userLogin.
                const response = await api.userLogin(email, password);
                login({ ...response.user, tokens: response.tokens, role: 'user' });
                toast.success(`Welcome back, ${response.user.username || response.user.email}!`);
                navigate('/dashboard');
            }
        } catch (error) {
            // If user and login failed, maybe it's a new user?
            // Since the original app had no registration page linked from here except "Sign up" text.
            // But the Sign up text just says "Sign up" but logic wasn't fully there.
            // I'll show error.
            toast.error(error.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-stone-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-rose-500 font-bold mb-2">Welcome Back</h2>
                    <p className="text-stone-500">Please sign in to your Wedify account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:ring focus:ring-rose-100 focus:outline-none transition-all"
                            placeholder={role === 'user' ? "user@example.com" : "admin@wedify.com"}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:ring focus:ring-rose-100 focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white py-3.5 rounded-xl font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                    >
                        Sign In as {role === 'user' ? 'User' : 'Admin'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-stone-400 space-y-2">
                    {role === 'user' && (
                        <div>
                            Don't have an account? <Link to="/signup" className="text-rose-500 cursor-pointer hover:underline">Sign up</Link>
                        </div>
                    )}

                    <div>
                        <Link to="/planner-login" className="text-stone-500 hover:text-stone-700 underline"> Event Group Login</Link>
                    </div>

                    <div>
                        <button
                            onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
                            className="text-stone-500 hover:text-stone-700 underline"
                        >
                            {role === 'user' ? 'Admin Login' : 'User Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
