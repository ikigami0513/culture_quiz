import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../settings";

export interface CategoryProps {
    id: string;
    name: string;
    header_image: string;
}

export const Category: React.FC<CategoryProps> = ({ id, name, header_image }) => {
    const navigate = useNavigate();
    const handleQuizClick = () => {
        navigate(`/quiz/${id}`);
    }

    return (
        <div key={id} className="max-w-sm m-2 p-2 bg-gray-700 border border-gray-600 rounded-lg shadow">
            <img className="rounded-t-lg" src={`${API_BASE_URL}/${header_image}`} alt={name} />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                <button onClick={handleQuizClick} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Faire le quiz
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}