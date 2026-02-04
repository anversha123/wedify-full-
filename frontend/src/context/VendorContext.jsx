import { createContext, useContext, useState } from 'react';
import { VENDOR_DATA } from '../data/mockData';

const VendorContext = createContext(null);

export const VendorProvider = ({ children }) => {
    const [vendors, setVendors] = useState(VENDOR_DATA);

    const addVendor = (vendor) => {
        setVendors(prev => [...prev, { ...vendor, id: prev.length + 1 }]);
    };

    const updateVendor = (id, updatedData) => {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updatedData } : v));
    };

    return (
        <VendorContext.Provider value={{ vendors, addVendor, updateVendor }}>
            {children}
        </VendorContext.Provider>
    );
};

export const useVendors = () => useContext(VendorContext);
