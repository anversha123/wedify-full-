import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-serif text-rose-500 font-bold tracking-tight">
                    Wedify
                </Link>
                <div className="hidden md:flex space-x-8 text-stone-600 font-medium">
                    {user && (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin/dashboard" className="text-rose-600 font-bold hover:text-rose-800 transition-colors">Admin Dashboard</Link>
                            ) : user.role === 'planner' ? (
                                <Link to="/planner/dashboard" className="text-rose-600 font-bold hover:text-rose-800 transition-colors">Planner Dashboard</Link>
                            ) : (
                                <Link to="/dashboard" className="hover:text-rose-500 transition-colors">Dashboard</Link>
                            )}

                            <Link to="/vendors" className="hover:text-rose-500 transition-colors">Vendors</Link>
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {!user ? (
                        <>
                            <Link to="/signup" className="text-stone-600 hover:text-rose-500 font-medium">Register</Link>
                            <Link to="/login" className="text-stone-600 hover:text-rose-500 font-medium">Log In</Link>
                            <Link to="/signup" className="bg-rose-500 text-white px-6 py-2.5 rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 font-medium">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-stone-600">Hai, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-stone-600 hover:text-rose-500 font-medium"
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div >
        </nav >
    )
}
