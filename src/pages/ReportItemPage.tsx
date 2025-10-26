import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reportItem } from '../api/items';
import AppLayout from '../components/AppLayout';
import Spinner from '../components/Spinner';

const ReportItemPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Determine the form type ('lost' or 'found') from the URL query parameter
    const reportType = useMemo(() => searchParams.get('type') || 'found', [searchParams]);

    // --- STATE MANAGEMENT (Corrected and Combined) ---
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics', // Default category
        location: '',
        date: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null); // State for the image file
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- HANDLERS (Updated) ---

    // Handles changes for regular text inputs, textareas, and selects
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // New handler specifically for the file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // Updated submit handler to use FormData for file upload
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const submissionData = new FormData();
        submissionData.append('reportType', reportType);
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('category', formData.category);
        submissionData.append('location', formData.location);
        submissionData.append('date', formData.date);
        
        // Append the image only if a file has been selected
        if (imageFile) {
            submissionData.append('image', imageFile);
        }

        try {
            // The API call now sends FormData instead of JSON
            await reportItem(submissionData);
            navigate('/dashboard?report=success');
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to submit report. Please check the details.`);
        } finally {
            setLoading(false);
        }
    };

    // --- DYNAMIC TEXT ---
    const pageTitle = reportType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item';
    const pageDescription = reportType === 'lost'
        ? "Please provide as much detail as possible about the item you've lost."
        : "Thank you for helping our community. Please describe the item you found.";

    // --- JSX (Updated) ---
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                <p className="text-gray-600 mt-1">{pageDescription}</p>

                <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    {error && <p className="mb-4 text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Item Title</label>
                            <input
                                type="text" name="title" id="title" placeholder="e.g., Black Dell Laptop"
                                required onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description" id="description" rows={4}
                                placeholder="Describe the item, including any identifying marks, colors, or contents."
                                required onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* --- NEW FILE INPUT FIELD --- */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Photo (Optional)</label>
                            <input
                                type="file" name="image" id="image"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="mt-1 w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-md file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-teal-50 file:text-teal-700
                                           hover:file:bg-teal-100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category" id="category" value={formData.category} onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option>Electronics</option>
                                <option>Books</option>
                                <option>ID Cards</option>
                                <option>Clothing</option>
                                <option>Wallets & Bags</option>
                                <option>Other</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location {reportType === 'found' ? 'Found' : 'Last Seen'}</label>
                                <input
                                    type="text" name="location" id="location" placeholder="e.g., SEET Roundabout"
                                    required onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date {reportType === 'found' ? 'Found' : 'Lost'}</label>
                                <input
                                    type="date" name="date" id="date" required onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                             <button
                                type="submit" disabled={loading}
                                className="w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-300 disabled:bg-teal-300 flex items-center justify-center"
                            >
                                {loading ? <Spinner /> : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default ReportItemPage;