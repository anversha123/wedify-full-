import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function PlannerLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const planner = await api.plannerLogin(username, password);
            const loggedInUser = {
                ...planner,
                role: 'planner',
                email: username // Adapting for AuthContext which might expect email
            };
            login(loggedInUser);
            toast.success(`Welcome back, ${planner.name}!`);
            navigate('/planner/dashboard');
        } catch (error) {
            toast.error(error.message || "Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-stone-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-rose-500 font-bold mb-2">Planner Login</h2>
                    <p className="text-stone-500">Sign in to manage your event group</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-rose-300 focus:ring focus:ring-rose-100 focus:outline-none transition-all"
                            placeholder="Enter your username"
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
                        className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                    >
                        Login as Planner
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-stone-500 hover:text-rose-500">
                            ← Back to Main Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
