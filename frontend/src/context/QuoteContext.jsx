import { createContext, useContext, useState } from 'react';

const QuoteContext = createContext(null);

export const QuoteProvider = ({ children }) => {
    const [quotes, setQuotes] = useState([]);

    const addQuote = (quote) => {
        setQuotes((prev) => [...prev, { ...quote, id: Date.now(), status: 'Pending' }]);
    };

    const updateQuoteStatus = (id, status) => {
        setQuotes((prev) => prev.map(q => q.id === id ? { ...q, status } : q));
    };

    return (
        <QuoteContext.Provider value={{ quotes, addQuote, updateQuoteStatus }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuotes = () => useContext(QuoteContext);
