import UserProtectedRoute from "@/app/providres/UserProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UserProtectedRoute>
                    <Navbar />
                    {children}
                    <Footer />
                </UserProtectedRoute>
            </body>
        </html>
    );
}
