import Navbar from '../components/layout/Navbar';

export default function PlaceholderPage({ title }) {
    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <div className="container mx-auto px-6 pt-32 text-center">
                <h1 className="text-4xl font-serif text-stone-800 mb-4">{title}</h1>
                <p className="text-stone-500 text-lg">This feature is coming soon to Wedify!</p>
                <div className="mt-12 opacity-50">
                    <div className="w-24 h-24 bg-stone-200 rounded-full mx-auto animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
