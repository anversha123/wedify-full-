import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Heart, Calendar, MapPin, Share2, Download, Sparkles, Flower, Crown, ScrollIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function WeddingPoster() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await api.getBooking(id);
                setBooking(data);
            } catch (error) {
                console.error(error);
                toast.error("Booking not found");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-stone-500 font-serif italic text-lg animate-pulse">Designing your memories...</p>
            </div>
        </div>
    );

    if (!booking) return null;

    const { groomName, brideName, place, couplePhoto, posterTheme = 'modern' } = booking.requirements || {};
    const displayPhoto = couplePhoto || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800";

    const themes = {
        modern: {
            bg: 'bg-[#faf9f6]',
            card: 'bg-white rounded-[60px] border-stone-100',
            accent: 'text-rose-400',
            button: 'bg-stone-950 text-white hover:bg-stone-800',
            font: 'font-serif-premium',
            overlay: 'mix-blend-luminosity',
            icon: <Heart size={24} className="text-rose-500 fill-rose-500/10" />
        },
        royal: {
            bg: 'bg-[#0a0f1d]',
            card: 'bg-[#151c2e] rounded-[40px] border-amber-900/30',
            accent: 'text-amber-500',
            button: 'bg-amber-600 text-white hover:bg-amber-700',
            font: 'font-serif-royal',
            overlay: 'opacity-60 saturate-[0.5]',
            icon: <Crown size={24} className="text-amber-500" />
        },
        floral: {
            bg: 'bg-rose-50/30',
            card: 'bg-white rounded-[100px] border-rose-100 shadow-rose-100/50',
            accent: 'text-rose-400',
            button: 'bg-rose-500 text-white hover:bg-rose-600',
            font: 'font-floral',
            overlay: 'sepia-[0.3] brightness-110',
            icon: <Flower size={24} className="text-rose-400" />
        },
        vintage: {
            bg: 'bg-[#f4ebe0]',
            card: 'bg-[#faf3e0] rounded-none border-[12px] border-double border-stone-800 shadow-none',
            accent: 'text-stone-700',
            button: 'bg-stone-800 text-[#f4ebe0] hover:bg-stone-900',
            font: 'font-vintage',
            overlay: 'sepia brightness-90 contrast-125 grayscale-[0.3]',
            icon: <ScrollIcon size={24} className="text-stone-800" />
        }
    };

    const current = themes[posterTheme] || themes.modern;

    return (
        <div className={`min-h-screen ${current.bg} pb-20 transition-colors duration-700`}>
            {/* Professional Fonts Import */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Great+Vibes&family=UnifrakturMaguntia&display=swap');
                
                .font-serif-premium { font-family: 'Playfair Display', serif; }
                .font-serif-royal { font-family: 'Playfair Display', serif; letter-spacing: -0.02em; }
                .font-floral { font-family: 'Great Vibes', cursive; }
                .font-vintage { font-family: 'UnifrakturMaguntia', serif; }
                .font-classic { font-family: 'Cormorant Garamond', serif; }
                .font-sans-modern { font-family: 'Montserrat', sans-serif; }
                
                @media print {
                    nav, .no-print { display: none !important; }
                    .print-area { margin: 0 !important; width: 100% !important; height: 100% !important; border: none !important; }
                    body { background: white !important; }
                }

                .theme-transition { transition: all 0.5s ease; }
            `}</style>

            <Navbar />

            <div className="container mx-auto px-6 pt-32">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
                        <div>
                            <h1 className={`text-4xl font-serif-premium ${posterTheme === 'royal' ? 'text-white' : 'text-stone-900'} mb-2`}>
                                {posterTheme.charAt(0).toUpperCase() + posterTheme.slice(1)} Wedding Poster
                            </h1>
                            <p className="text-stone-500 font-sans-modern tracking-widest text-xs uppercase font-bold">A professionally curated memory for {groomName} & {brideName}</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Invitation link copied!');
                            }} className="group flex items-center gap-2 bg-white border border-stone-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-stone-600 font-sans-modern text-sm font-bold">
                                <Share2 size={18} className="group-hover:scale-110 transition-transform" /> Share Invitation
                            </button>
                            <button onClick={() => window.print()} className={`group flex items-center gap-3 ${current.button} px-8 py-4 rounded-2xl font-sans-modern font-black text-sm shadow-xl transition-all hover:-translate-y-1`}>
                                <Download size={18} /> DOWNLOAD POSTER
                            </button>
                        </div>
                    </div>

                    {/* The Poster Masterpiece */}
                    <div className={`print-area relative ${current.card} shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row min-h-[800px] border theme-transition`}>

                        {/* Left: Artistic Visual Layer */}
                        <div className="relative w-full md:w-[45%] h-[400px] md:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-stone-900">
                                <img
                                    src={displayPhoto}
                                    alt="The Couple"
                                    className={`w-full h-full object-cover ${current.overlay} transition-all duration-1000 scale-105 hover:scale-100`}
                                />
                                {posterTheme === 'royal' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#151c2e]"></div>}
                                {posterTheme === 'modern' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>}
                            </div>

                            {/* Decorative Elements over Photo */}
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className={`w-full h-full border ${posterTheme === 'royal' ? 'border-amber-500/30' : 'border-white/30'} rounded-[40px] flex items-end justify-start p-10`}>
                                    <div className={posterTheme === 'royal' ? 'text-amber-500' : 'text-white'}>
                                        <Sparkles className={`mb-4 ${current.accent}`} size={32} />
                                        <h3 className={`text-3xl ${current.font} leading-tight`}>Together<br />Forever</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Elegant Typography Layer */}
                        <div className={`flex-1 ${current.card.split(' ')[0]} flex flex-col justify-center p-12 md:p-20 relative`}>
                            {/* Background Pattern */}
                            <div className={`absolute top-0 right-0 p-10 opacity-[0.03] scale-150 pointer-events-none ${posterTheme === 'royal' ? 'text-amber-500' : 'text-stone-900'}`}>
                                {current.icon}
                            </div>

                            <div className="relative z-10 max-w-lg mx-auto w-full">
                                <div className="flex items-center gap-4 mb-10 overflow-hidden whitespace-nowrap text-right">
                                    <div className={`h-[1px] flex-1 ${posterTheme === 'royal' ? 'bg-amber-900/50' : 'bg-rose-200'}`}></div>
                                    {current.icon}
                                    <div className={`h-[1px] flex-1 ${posterTheme === 'royal' ? 'bg-amber-900/50' : 'bg-rose-200'}`}></div>
                                </div>

                                <p className={`${current.accent} font-sans-modern font-black uppercase tracking-[0.4em] text-[10px] mb-8 text-center`}>Save Our Magical Date</p>

                                <div className="space-y-4 mb-16 text-center">
                                    <h2 className={`text-6xl md:text-8xl ${current.font} ${posterTheme === 'royal' ? 'text-amber-500' : posterTheme === 'vintage' ? 'text-stone-800' : 'text-stone-900'} tracking-tighter lowercase leading-none`}>
                                        {groomName || "Groom"}
                                    </h2>
                                    <div className="flex items-center justify-center gap-6">
                                        <span className={`h-[1px] w-8 ${posterTheme === 'royal' ? 'bg-amber-900/50' : 'bg-stone-200'}`}></span>
                                        <p className={`text-3xl ${posterTheme === 'floral' ? 'font-floral' : 'font-classic'} ${current.accent} italic font-medium`}>and</p>
                                        <span className={`h-[1px] w-8 ${posterTheme === 'royal' ? 'bg-amber-900/50' : 'bg-stone-200'}`}></span>
                                    </div>
                                    <h2 className={`text-6xl md:text-8xl ${current.font} ${posterTheme === 'royal' ? 'text-amber-500' : posterTheme === 'vintage' ? 'text-stone-800' : 'text-stone-900'} tracking-tighter lowercase leading-none`}>
                                        {brideName || "Bride"}
                                    </h2>
                                </div>

                                <div className={`grid grid-cols-2 gap-12 border-y ${posterTheme === 'royal' ? 'border-amber-900/30' : 'border-stone-100'} py-10 mb-10`}>
                                    <div className="text-center group">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${posterTheme === 'royal' ? 'bg-amber-950 text-amber-500' : 'bg-rose-50 text-rose-500'} mb-4 group-hover:scale-110 transition-all`}>
                                            <Calendar size={20} />
                                        </div>
                                        <p className={`text-[10px] font-sans-modern font-black ${posterTheme === 'royal' ? 'text-amber-900' : 'text-stone-400'} uppercase tracking-widest mb-1`}>When</p>
                                        <p className={`text-xl font-classic font-bold ${posterTheme === 'royal' ? 'text-amber-200' : 'text-stone-800'}`}>{booking.date}</p>
                                    </div>

                                    <div className="text-center group">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${posterTheme === 'royal' ? 'bg-amber-950 text-amber-500' : 'bg-rose-50 text-rose-500'} mb-4 group-hover:scale-110 transition-all`}>
                                            <MapPin size={20} />
                                        </div>
                                        <p className={`text-[10px] font-sans-modern font-black ${posterTheme === 'royal' ? 'text-amber-900' : 'text-stone-400'} uppercase tracking-widest mb-1`}>Where</p>
                                        <p className={`text-xl font-classic font-bold ${posterTheme === 'royal' ? 'text-amber-200' : 'text-stone-800'} leading-tight`}>{place || "Royal Orchid Palace"}</p>
                                    </div>
                                </div>

                                <div className="text-center space-y-4">
                                    <p className={`italic ${posterTheme === 'royal' ? 'text-amber-500/70' : 'text-stone-500'} font-classic text-xl`}>"Because every love story is beautiful, but ours is my favorite."</p>
                                    <div className="pt-6">
                                        <p className={`${posterTheme === 'royal' ? 'text-amber-900' : 'text-stone-300'} font-sans-modern text-[9px] uppercase tracking-[0.2em] font-bold`}>Joyfully requested by their families</p>
                                    </div>
                                </div>
                            </div>

                            {/* Corner Floral Accents */}
                            <div className={`absolute bottom-0 right-0 p-8 opacity-10 pointer-events-none ${posterTheme === 'royal' ? 'text-amber-500' : 'text-stone-400'}`}>
                                <Sparkles size={80} strokeWidth={1} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Professional Note */}
                    <div className="mt-12 text-center no-print">
                        <p className="text-stone-400 font-sans-modern text-[10px] uppercase tracking-widest">
                            Created with Wedify Premium Venue Planner • Personalized for each Couple
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
