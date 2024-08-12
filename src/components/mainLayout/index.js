import Navbar from "../navbar";

export default function MainLayout({ children }) {
    return (
        <div >
            <Navbar />
            {children}
        </div>

    );
}