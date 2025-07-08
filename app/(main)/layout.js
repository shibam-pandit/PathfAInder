import UserProtectedRoute from '@/app/providres/UserProtectedRoute';
import { LayoutVisibilityProvider } from '../providres/LayoutVisibilityContext';
import QuizWrapper from '../providres/quizWrapper'; 
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout({ children }) {
    return (
        <UserProtectedRoute>
            <LayoutVisibilityProvider>
                <QuizWrapper>
                    {children}
                    <Toaster position="top-center" richColors closeButton={false} />
                </QuizWrapper>
            </LayoutVisibilityProvider>
        </UserProtectedRoute>
    );
}
