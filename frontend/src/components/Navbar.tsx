import React, { useState } from 'react';
import Logo from '../logo.jpg';
import { useNavigate } from 'react-router-dom';
import { User } from '../entities/user.entity';

interface NavbarProps {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate("/");
    }
    
    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleRegisterClick = () => {
        navigate("/register");
    }

    const handleLogoutClick = () => {
        setUser(undefined);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/");
    }

    function capitalize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <nav className="bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={handleLogoClick} className='flex items-center'>
                        <img className="h-12 rounded-full" src={Logo} alt="Logo" />
                        <span className="text-white pl-2">Culture Quiz</span>
                    </button>
                </div>
                <div className="hidden md:flex space-x-4">
                    {/* Liens du menu pour la version desktop */}
                    <button className="text-white hover:text-gray-300">Accueil</button>
                    {user === undefined ? 
                        <>
                            <button onClick={handleLoginClick} className="text-white hover:text-gray-300">Connexion</button>
                            <button onClick={handleRegisterClick} className="text-white hover:text-gray-300">Inscription</button>
                        </> 
                    :
                        <>
                            <div className="relative">
                                <button onClick={toggleSubMenu} className="text-white bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-md">{capitalize(user.username)}</button>
                                {isSubMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-2 z-20">
                                        <button onClick={handleLogoutClick} className="block px-4 py-2 text-white hover:bg-gray-600 w-full text-left">Déconnexion</button>
                                    </div>
                                )}
                            </div>
                        </>
                    }
                </div>
                <div className="md:hidden flex items-center">
                    {/* Bouton de menu hamburger pour la version mobile */}
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {/* Menu déroulant pour la version mobile */}
            {isOpen && (
                <div className="md:hidden mt-4">
                    {user !== undefined ? 
                        <div className="block text-white py-2 border-b border-b-white mb-4">
                            <div>{capitalize(user.username)}</div>
                            <div className='text-gray-400 pl-4 text-sm'>{user.email}</div>
                        </div>
                    :
                        ""
                    }
                    <button onClick={handleLogoClick} className="block text-white hover:text-gray-300 py-2">Accueil</button>
                    {user === undefined ?
                        <div className='text-white pt-2 mt-2 border-t border-t-white'>
                            <button onClick={handleLoginClick} className='block text-white hover:text-gray-300 py-2'>Connexion</button>
                            <button onClick={handleRegisterClick} className='block text-white hover:text-gray-300 py-2'>Inscription</button>
                        </div>
                    :
                        <button onClick={handleLogoutClick} className='block text-white hover:text-gray-300 py-2'>Déconnexion</button>
                    }
                </div>
            )}
        </nav>
    );
};
