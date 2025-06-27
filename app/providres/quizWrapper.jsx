'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLayoutVisibility } from '@/app/providres/LayoutVisibilityContext';

export default function QuizWrapper({ children }) {
    const { hideLayout } = useLayoutVisibility();

    return (
        <>
            {!hideLayout && <Navbar />}

            {children}
            
            {!hideLayout && <Footer />}
        </>
    );
}