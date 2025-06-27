import UserProtectedRoute from '@/app/providres/UserProtectedRoute';
import { LayoutVisibilityProvider } from '../providres/LayoutVisibilityContext';
import QuizWrapper from '../providres/quizWrapper'; 

export default function MainLayout({ children }) {
    return (
        <UserProtectedRoute>
            <LayoutVisibilityProvider>
                <QuizWrapper>
                    {children}
                </QuizWrapper>
            </LayoutVisibilityProvider>
        </UserProtectedRoute>
    );
}
