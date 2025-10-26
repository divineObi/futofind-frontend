import { useState, useEffect } from 'react';
import { getPendingClaims, resolveClaim } from '../api/admin';
import AppLayout from '../components/AppLayout';
import placeholderImage from '../assets/placeholder.png';

const AdminPage = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchClaims = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await getPendingClaims();
            setClaims(response.data);
        } catch (err) {
            setError('Failed to fetch pending claims.');
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch claims when the component mounts
    useEffect(() => {
        fetchClaims();
    }, []);

    const handleResolveClaim = async (claimId: string, decision: 'approved' | 'rejected') => {
        try {
            await resolveClaim(claimId, decision);
            setSuccess(`Claim has been successfully ${decision}.`);
            // Refresh the list of claims after resolving one
            fetchClaims();
        } catch (err) {
            setError('Failed to resolve the claim. Please try again.');
        }
    };
    
    return (
        <AppLayout>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Review and resolve pending item claims.</p>
            {success && <p className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</p>}
            {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</p>}
            
            <div className="mt-8 space-y-6">
                {loading ? (
                    <p>Loading pending claims...</p>
                ) : claims.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No pending claims to review.</p>
                ) : (
                    claims.map((claim: any) => (
                        <ClaimReviewCard key={claim._id} claim={claim} onResolve={handleResolveClaim} />
                    ))
                )}
            </div>
        </AppLayout>
    );
};

// --- Child Component for each claim review card ---

const ClaimReviewCard = ({ claim, onResolve }: { claim: any, onResolve: (id: string, decision: 'approved' | 'rejected') => void }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md border">
            {/* Header: Item Title */}
            <h2 className="text-xl font-bold text-gray-800">
                Claim for: <span className="text-teal-600">{claim.item?.title || 'N/A'}</span>
            </h2>

            {/* Responsive grid for details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Left Side: Claim Details */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Claimant Details</h3>
                        <p>{claim.claimant?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{claim.claimant?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">Justification</h3>
                        <p className="bg-gray-50 p-3 rounded-md border">{claim.justification}</p>
                    </div>
                </div>

                {/* Right Side: Visual Evidence */}
                <div>
                     <h3 className="text-sm font-semibold text-gray-500">Visual Evidence</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-center">
                        <div>
                             <p className="text-xs text-gray-400 mb-1">Item Photo</p>
                            <img src={claim.item?.imageUrl || placeholderImage} alt="Item" className="w-full h-32 object-cover rounded-md border"/>
                        </div>
                         <div>
                            <p className="text-xs text-gray-400 mb-1">Claimant's Proof</p>
                            {claim.proofImageUrl ? (
                               <img src={claim.proofImageUrl} alt="Proof" className="w-full h-32 object-cover rounded-md border"/>
                            ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md border">
                                    <p className="text-sm text-gray-400">No proof<br/>uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3">
                 <button 
                    onClick={() => onResolve(claim._id, 'approved')}
                    className="flex-1 py-2 px-4 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                 >Approve</button>
                 <button 
                    onClick={() => onResolve(claim._id, 'rejected')}
                    className="flex-1 py-2 px-4 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >Reject</button>
            </div>
        </div>
    );
}

export default AdminPage;