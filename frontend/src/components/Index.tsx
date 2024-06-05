import React, { useEffect, useState } from 'react';
import { CategoryProps, Category } from './Category';
import { API_BASE_URL } from '../settings';

export const Index: React.FC = () => {
    const [categories, setCategories] = useState<CategoryProps[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/categories/`);
                if (!response.ok) {
                    throw new Error("failed to fetch categories");
                }
                const categories: CategoryProps[] = await response.json();
                setCategories(categories);
            }
            catch (error) {
                console.error(`Error fetching data : ${error}`);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
                <Category
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    header_image={category.header_image}
                />
            ))}
        </div>
    );
}