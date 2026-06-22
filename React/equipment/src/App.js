import { useNavigate } from "react-router-dom";
import "./App.css"; // Separate standalone styling sheet

function Home() {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper">
            {/* Ambient Background Overlay Gradients */}
            <div className="landing-bg-overlay"></div>

            <div className="landing-content">
                <div className="landing-brand">
                    <span className="brand-logo">🛡️</span>
                    <h1>Asset<span className="text-sky">Flow</span></h1>
                </div>

                <p className="landing-subtitle">
                    The next-generation equipment management ecosystem. Seamlessly track hardware asset allocation, monitor real-time user borrowings, and streamline ledger logistics from a single unified terminal.
                </p>

                {/* Main Gateway Options */}
                <div className="gateway-grid">
                    <div className="gateway-card user-card">
                        <div className="gateway-icon">👤</div>
                        <h3>User Terminal</h3>
                        <p>Access your personal dashboard to view active borrowings, request assets, and submit hardware returns.</p>
                        <button 
                            className="btn-gateway btn-user"
                            onClick={() => navigate("/user/login")}
                        >
                            Enter User Portal
                        </button>
                    </div>

                    <div className="gateway-card admin-card">
                        <div className="gateway-icon">⚙️</div>
                        <h3>Admin Control</h3>
                        <p>Manage system inventories, track global transaction audit trails, and oversee active borrower records.</p>
                        <button 
                            className="btn-gateway btn-admin"
                            onClick={() => navigate("/adminlogin")}
                        >
                            Enter Admin Terminal
                        </button>
                    </div>
                </div>

                <footer className="landing-footer">
                    &copy; {new Date().getFullYear()} AssetFlow Systems. Secure Hardware Management Protocol.
                </footer>
            </div>
        </div>
    );
}

export default Home;