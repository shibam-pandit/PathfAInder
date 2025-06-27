'use client';

import { createContext, useContext, useState } from 'react';

const LayoutVisibilityContext = createContext();

export const LayoutVisibilityProvider = ({ children }) => {
    const [hideLayout, setHideLayout] = useState(false);

    return (
        <LayoutVisibilityContext.Provider value={{ hideLayout, setHideLayout }}>
            {children}
        </LayoutVisibilityContext.Provider>
    );
};

export const useLayoutVisibility = () => useContext(LayoutVisibilityContext);
