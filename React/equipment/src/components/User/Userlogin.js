import React, { useState } from "react"; // Fixed: Combined imports and fixed 'useState' casing
import { useNavigate } from "react-router-dom";
import './styles/Userlogin.css'; // Un-commented to apply styling
import axios from "axios";

function Userlogin() {
    const [email, setEmail] = useState(''); // Fixed: useState
    const [password, setPassword] = useState(''); // Fixed: useState
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        axios.post(`http://127.0.0.1:5000/users/userlogin_api`, { email, password })
            .then(response => {
                console.log(response.data);
                localStorage.setItem("token", response.data.token);
                navigate('/user-dashboard'); 
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Invalid email or password');
            });
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-container">
                <h2>User Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input  
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}      
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input  
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}      
                            placeholder="Enter your password"
                            required 
                        />
                    </div>
                    {/* Added missing submit button */}
                    <button type="submit" className="login-btn">Log In</button>
                </form>
            </div>
        </div>
    );
}

export default Userlogin;