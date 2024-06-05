import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { User } from './entities/user.entity';

import { Navbar } from './components/Navbar';
import { Index } from './components/Index';
import { Quiz } from './components/Quiz';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { API_BASE_URL } from './settings';
    
const App: React.FC = () => {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (storedToken) {            
            const fetchStoredToken = async () => {
                const response = await fetch(`${API_BASE_URL}/api/login/token/`, {
                method: "POST",
                    headers: {
                        Authorization: `Token ${storedToken}`
                    }
                });

                if (!response.ok) {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                }
                else {
                    const loginProps = await response.json();
                    setUser(new User(loginProps.token, loginProps.username, loginProps.email));
                }
            }

            fetchStoredToken()
            .catch(console.error);
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="bg-gray-800 min-h-screen justify-center">
                <Navbar user={user} setUser={setUser} />
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register setUser={setUser} />} />
                    <Route path="/quiz/:id" element={<Quiz />} />
                </Routes> 
            </div>
        </BrowserRouter>
    );
}

export default App;