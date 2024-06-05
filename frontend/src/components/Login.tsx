import React, { useState, FormEvent, ChangeEvent } from "react"
import { User } from "../entities/user.entity";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../settings";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const Login: React.FC<LoginProps> = ({ setUser }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>('');

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }

    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/api/login/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            if (!response.ok) {
                const messageError = await response.json();
                setFormError(messageError.message);
            }
            else {
                const loginProps = await response.json();
                setUser(new User(loginProps.token, loginProps.username, loginProps.email));
                if (rememberMe) {
                    localStorage.setItem('token', loginProps.token);
                }
                else {
                    sessionStorage.setItem('token', loginProps.token);
                }
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
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Connexion à votre compte</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
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
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Mot de passe"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                            Se souvenir de moi
                        </label>
                    </div>

                    <div className="text-sm">
                        <button className="font-medium text-indigo-600 hover:text-indigo-500">
                            Mot de passe oublié ?
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Connexion
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