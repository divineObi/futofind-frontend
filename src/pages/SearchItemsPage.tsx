import { useState, useEffect } from 'react';
import { getFoundItems } from '../api/items';
import AppLayout from '../components/AppLayout';
import ItemCard from '../components/ItemCard';

const SearchItemsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filters, setFilters] = useState({
        keyword: '',
        category: 'All',
    });

    // This useEffect hook is the core of our dynamic search.
    // It runs on the initial page load and any time the 'filters' state changes.
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getFoundItems(filters);
                setItems(response.data);
            } catch (err) {
                setError('Could not fetch items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [filters]); // The dependency array ensures this effect re-runs when filters change.

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [e.target.name]: e.target.value
        }));
    };
    
    return (
        <AppLayout>
            <h1 className="text-3xl font-bold text-gray-800">Search Found Items</h1>
            <p className="text-gray-600 mt-1">Browse items reported as found by the FUTO community.</p>

            {/* Filter Bar */}
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    name="keyword"
                    placeholder="Search by keyword (e.g., iPhone, bag)..."
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option>All</option>
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>ID Cards</option>
                    <option>Clothing</option>
                    <option>Wallets & Bags</option>
                    <option>Other</option>
                </select>
            </div>
            
            {/* Items Grid */}
            <div className="mt-8">
                {loading ? (
                    <p>Loading items...</p> // Replace with a spinner or skeleton loader for better UX
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-500">No items found matching your criteria.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item: any) => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default SearchItemsPage;