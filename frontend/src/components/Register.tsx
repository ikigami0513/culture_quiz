import React, { useState, FormEvent, ChangeEvent } from "react"
import { User } from "../entities/user.entity";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const Register: React.FC<RegisterProps> = ({setUser}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [checkPassword, setCheckPassword] = useState<string>('');

    const [formError, setFormError] = useState<string>('');

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleCheckPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckPassword(event.target.value);
    }

    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== checkPassword) {
            // TODO: Afficher un message d'erreur précisant que les mots de passe ne correspondent pas
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/register/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            if (!response.ok) {
                const messageError = await response.json();
                setFormError(messageError.message);
            }
            else {
                const registerProps = await response.json();
                setUser(new User(registerProps.token, registerProps.username, registerProps.email));
                navigate("/");
            }
        }
        catch (error) {
            console.error(`Error fetching data: ${error}`);
        }
    }

    return (
        <div className="w-full md:w-3/4 mx-auto space-y-8 p-4">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Inscription</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={handleUsernameChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nom d'utilisateur"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">Adresse Email</label>
                        <input 
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={handleEmailChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Adresse Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Mot de passe"
                        />
                    </div>
                    <div>
                        <label htmlFor="check_password" className="sr-only">Confirmation du Mot de passe</label>
                        <input
                            id="check_password"
                            name="check_password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={checkPassword}
                            onChange={handleCheckPasswordChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirmation du Mot de passe"
                        />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Inscription
                    </button>
                </div>
                {formError === '' ?
                    "" 
                :
                    <div className="text-center text-white p-1 rounded-md border-2 border-red-800">
                        {formError}
                    </div>
                }
            </form>
        </div>
    );
}