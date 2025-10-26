import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, claimItem } from '../api/items';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import placeholderImage from '../assets/placeholder.png';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ItemDetailsPage = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justification, setJustification] = useState('');
    const [proofImageFile, setProofImageFile] = useState<File | null>(null); // <-- State for proof image
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimError, setClaimError] = useState('');

    useEffect(() => { /* ... (this useEffect remains the same) ... */
        if (!itemId) return;
        const fetchItem = async () => {
            setLoading(true);
            try {
                const response = await getItemById(itemId);
                setItem(response.data);
            } catch (err) {
                setError('Failed to fetch item details.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [itemId]);

    // NEW handler for the proof image file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofImageFile(e.target.files[0]);
        }
    };
    
    // UPDATED submit handler
    const handleSubmitClaim = async () => {
        if (!justification) {
            setClaimError('Please provide a justification for your claim.');
            return;
        }
        if (!itemId) return;

        setClaimLoading(true);
        setClaimError('');
        
        // Use FormData to send file and text data together
        const formData = new FormData();
        formData.append('justification', justification);
        if (proofImageFile) {
            formData.append('proofImage', proofImageFile);
        }
        
        try {
            await claimItem(itemId, formData); // Pass the FormData object
            setIsModalOpen(false);
            navigate('/my-reports?claim=success');
        } catch (err: any) {
            setClaimError(err.response?.data?.message || 'Failed to submit claim.');
        } finally {
            setClaimLoading(false);
        }
    };
    
    const canClaim = user && item && user._id !== item.reporter._id;
    if (loading) return <AppLayout><p>Loading details...</p></AppLayout>;
    if (error) return <AppLayout><p className="text-red-500">{error}</p></AppLayout>;
    if (!item) return <AppLayout><p>Item not found.</p></AppLayout>;

    return (
        <AppLayout>
            {/* The main page JSX remains exactly the same */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={item.imageUrl || placeholderImage} alt={item.title} className="w-full h-auto max-h-96 object-contain rounded-lg"/>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>
                        <p className="mt-4 text-gray-600">{item.description}</p>
                        <div className="mt-6 space-y-3 border-t pt-4">
                           <DetailRow label="Category" value={item.category} />
                           <DetailRow label="Location Found" value={item.location} />
                           <DetailRow label="Date Found" value={new Date(item.date).toLocaleDateString()} />
                           <DetailRow label="Reported By" value={item.reporter.name} />
                        </div>
                        {canClaim && ( <button onClick={() => setIsModalOpen(true)} className="mt-auto w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-300"> Make a Claim </button> )}
                    </div>
                </div>
            </div>

            {/* UPDATED Claim Modal JSX */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Claim: ${item.title}`}>
                <p className="text-sm text-gray-600">Provide details only the owner would know. Uploading a photo that proves ownership (e.g., a photo of the item's serial number, or you with the item) is highly recommended.</p>
                {claimError && <p className="mt-4 text-center text-red-500 bg-red-100 p-2 rounded-md">{claimError}</p>}
                
                <textarea
                    rows={4}
                    placeholder="e.g., The phone's lock screen is a picture of my dog..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                {/* --- NEW FILE INPUT FOR PROOF IMAGE --- */}
                <div className="mt-4">
                    <label htmlFor="proofImage" className="block text-sm font-medium text-gray-700">Add Proof (Optional)</label>
                    <input
                        type="file" name="proofImage" id="proofImage"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="mt-1 w-full text-sm text-gray-500
                                   file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                                   file:text-sm file:font-semibold file:bg-gray-50 file:text-teal-700
                                   hover:file:bg-gray-100"
                    />
                </div>
                
                <button
                    onClick={handleSubmitClaim}
                    disabled={claimLoading}
                    className="mt-6 w-full py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition disabled:bg-teal-300 flex items-center justify-center"
                >
                    {claimLoading ? <Spinner /> : 'Submit Claim'}
                </button>
            </Modal>
        </AppLayout>
    );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-500">{label}:</span>
        <span className="text-gray-800">{value}</span>
    </div>
);

export default ItemDetailsPage;