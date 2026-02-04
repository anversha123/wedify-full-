export const VENDOR_DATA = [
    {
        id: 1,
        name: "Elegant Events & Co.",
        category: "Full Service",
        rating: 4.9,
        reviews: 128,
        priceStart: 200000,
        costPerGuest: 2500,
        description: "Specializing in luxury weddings with a touch of modern elegance. We handle everything from venue selection to the last dance.",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
        availableDates: ["2026-02-14", "2026-06-20", "2026-08-15"],
        contact: { phone: "+91 98765 43210", email: "info@elegantevents.com" },
        subVendors: [
            { id: 'v1', name: 'Gourmet Catering', type: 'Catering', price: 150000 },
            { id: 'v2', name: 'Luxe Florals', type: 'Decoration', price: 100000 },
            { id: 'v3', name: 'Capture Moments', type: 'Photography', price: 80000 }
        ]
    },
    {
        id: 2,
        name: "Blissful Beginnings",
        category: "Day-of Coordination",
        rating: 4.7,
        reviews: 85,
        priceStart: 80000,
        costPerGuest: 1500,
        description: "Perfect for couples who have planned it all but need a professional to execute their vision seamlessly on the big day.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
        availableDates: ["2026-01-20", "2026-02-14", "2026-09-10"],
        contact: { phone: "+91 87654 32109", email: "hello@blissful.com" },
        subVendors: [
            { id: 'v4', name: 'Basic Bites', type: 'Catering', price: 80000 },
            { id: 'v5', name: 'Simple Stems', type: 'Decoration', price: 50000 }
        ]
    },
    {
        id: 3,
        name: "Royal Weddings",
        category: "Destination",
        rating: 5.0,
        reviews: 210,
        priceStart: 500000,
        costPerGuest: 5000,
        description: "Experts in destination weddings. We turn your dream location into a reality with logistical mastery.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        availableDates: ["2026-03-01", "2026-04-15", "2026-05-20"],
        contact: { phone: "+91 76543 21098", email: "royal@weddings.com" },
        subVendors: [
            { id: 'v6', name: 'Royal Feast', type: 'Catering', price: 300000 },
            { id: 'v7', name: 'Grand Decor', type: 'Decoration', price: 200000 },
            { id: 'v8', name: 'Cinema Pro', type: 'Videography', price: 150000 }
        ]
    },
    {
        id: 4,
        name: "Rustic Romance Planners",
        category: "Themed",
        rating: 4.8,
        reviews: 92,
        priceStart: 120000,
        costPerGuest: 2000,
        description: "Creating cozy, intimate, and rustic weddings that feel like home. Specializing in outdoor and barn venues.",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
        availableDates: ["2026-06-20", "2026-07-04", "2026-08-15"],
        contact: { phone: "+91 65432 10987", email: "rustic@romance.com" },
        subVendors: [
            { id: 'v9', name: 'Farm Fresh Food', type: 'Catering', price: 100000 },
            { id: 'v10', name: 'Wildflowers', type: 'Decoration', price: 60000 }
        ]
    }
];

export const checkAvailability = (date) => {
    if (!date) return VENDOR_DATA;
    return VENDOR_DATA;
};
