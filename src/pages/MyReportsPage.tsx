import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { getMyReportedItems, getMyClaims } from '../api/user';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import placeholderImage from '../assets/placeholder.png';

type Tab = 'reports' | 'claims';

const MyReportsPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('reports');
    const [reportedItems, setReportedItems] = useState([]);
    const [myClaims, setMyClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [showSuccess, setShowSuccess] = useState(false);

    // A robust, memoized function for fetching data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch both sets of data concurrently for better performance
            const [reportsResponse, claimsResponse] = await Promise.all([
                getMyReportedItems(),
                getMyClaims(),
            ]);
            setReportedItems(reportsResponse.data);
            setMyClaims(claimsResponse.data);
        } catch (err) {
            setError('Failed to fetch your data. Please try again later.');
        } finally {
            setLoading(false); // Always clear loading at the end
        }
    }, []); // Empty dependency array means this function is created only once

    // This effect handles the success message logic
    useEffect(() => {
        if (searchParams.get('claim') === 'success') {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [searchParams]);
    
    // This effect fetches data every time the page path changes
    useEffect(() => {
        fetchData();
    }, [fetchData, location.pathname]);


    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 py-4">Loading your data...</p>;
        if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

        if (activeTab === 'reports') {
            return reportedItems.length > 0 ? (
                <div className="space-y-4">
                    {reportedItems.map((item: any) => (
                        <ReportedItemRow key={item._id} item={item} />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-4">You have not reported any items yet.</p>;
        }

        if (activeTab === 'claims') {
             return myClaims.length > 0 ? (
                <div className="space-y-4">
                    {myClaims.map((claim: any) => (
                        <ClaimRow key={claim._id} claim={claim} />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-4">You have not made any claims yet.</p>;
        }
    };

    return (
        <AppLayout>
            {showSuccess && (
                 <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow animate-pulse">
                    <strong>Success!</strong> Your claim has been submitted and is now pending review.
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800">My Activity</h1>
            <p className="text-gray-600 mt-1">Track the status of items you've reported and claims you've made.</p>

            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Items I've Reported ({reportedItems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('claims')}
                         className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'claims' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        My Claims ({myClaims.length})
                    </button>
                </nav>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>
        </AppLayout>
    );
};

// --- Child Component for "Items I've Reported" list ---
const ReportedItemRow = ({ item }: { item: any }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <img src={item.imageUrl || placeholderImage} alt={item.title} className="w-20 h-20 sm:w-16 sm:h-16 rounded-md object-cover flex-shrink-0" />
        <div className="flex-grow">
            <h3 className="font-bold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-500">Reported on: {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex-shrink-0 pt-2 sm:pt-0">
            <StatusBadge status={item.status} />
        </div>
    </div>
);

// --- Child Component for "My Claims" list ---
const ClaimRow = ({ claim }: { claim: any }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <img src={claim.item?.imageUrl || placeholderImage} alt={claim.item?.title || 'Item image'} className="w-20 h-20 sm:w-16 sm:h-16 rounded-md object-cover flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-gray-500">Claim for:</p>
            <h3 className="font-bold text-gray-800">{claim.item?.title || 'An item that is no longer available'}</h3>
            <p className="text-sm text-gray-500">Claimed on: {new Date(claim.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex-shrink-0 pt-2 sm:pt-0">
            <StatusBadge status={claim.status} />
        </div>
    </div>
);

export default MyReportsPage;