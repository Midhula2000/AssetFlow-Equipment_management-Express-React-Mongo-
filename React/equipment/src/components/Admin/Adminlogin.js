import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import './styles/Adminlogin.css'; // Styled with the dark theme variant
import axios from "axios";

function Adminlogin() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        axios.post(`http://127.0.0.1:5000/adminlogin_api/`, { email, password })
            .then(response => {
                console.log(response.data);
                localStorage.setItem("Admintoken", response.data.token);
                navigate('/home'); 
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Invalid email or password');
            });
    };

    return (
        <div className="admin-login-wrapper dark-theme">
            <div className="admin-login-container card-shadow">
                <div className="login-header">
                    <h2>Admin Login</h2>
                    <p>Provide your credentials to access the security console</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input  
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}      
                            placeholder="name@company.com"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input  
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}      
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn">Log In</button>
                </form>
            </div>
        </div>
    );
}

export default Adminlogin;