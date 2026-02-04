import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Home() {

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-rose-100 selection:text-rose-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-50/50 rounded-l-[100px] transform translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-50 -translate-x-10 translate-y-10" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-rose-100/50 text-rose-600 text-sm font-semibold tracking-wide border border-rose-100">
                        ✨ The #1 Event Management Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-stone-800 mb-6 leading-[1.1]">
                        Plan Your <span className="text-rose-500 italic">Perfect</span> Wedding<br />
                        Without The Stress
                    </h1>

                    <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Connect with expert planners to organize your dream event.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <Link to="/planners" className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 font-medium">
                            Find a Planner
                        </Link>
                    </div>

                    <div className="mt-16 flex justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="font-serif italic text-stone-400">Vogue</div>
                        <div className="font-serif italic text-stone-400">Brides</div>
                        <div className="font-serif italic text-stone-400">The Knot</div>
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <section className="py-24 bg-stone-50 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif text-stone-800 mb-4">Why Wedify?</h2>
                        <p className="text-lg text-stone-500">Simple tools to manage your complex event.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-white hover:shadow-2xl hover:shadow-stone-200/50 transition-all border border-transparent hover:border-stone-100 group duration-300 cursor-pointer">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-rose-500">📅</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-stone-800">Timeline Manager</h3>
                            <p className="text-stone-500 leading-relaxed">Keep track of every minute with our intuitive drag-and-drop timeline builder designed for couples.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-white hover:shadow-2xl hover:shadow-stone-200/50 transition-all border border-transparent hover:border-stone-100 group duration-300 cursor-pointer">
                            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-indigo-500">💰</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-stone-800">Budget Tracker</h3>
                            <p className="text-stone-500 leading-relaxed">Stay within budget with real-time tracking, automated alerts, and expense categorization.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-white hover:shadow-2xl hover:shadow-stone-200/50 transition-all border border-transparent hover:border-stone-100 group duration-300 cursor-pointer">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl text-emerald-500">✨</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-stone-800">Inspiration Board</h3>
                            <p className="text-stone-500 leading-relaxed">Curate your style and share it with vendors instantly. AI-powered suggestions based on your taste.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
