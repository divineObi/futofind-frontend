import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Make sure these are imported
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import type { IconType, IconBaseProps } from 'react-icons';
import { FiPlusSquare, FiEdit, FiSearch } from 'react-icons/fi';

const DashboardPage = () => {
    const { user } = useAuth();
    // --- NEW LOGIC STARTS HERE ---
    const [searchParams] = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);

    // This effect runs when the page loads to check for the success message
    useEffect(() => {
        if (searchParams.get('report') === 'success') {
            setShowSuccess(true);
            // This timer will hide the message after 5 seconds
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

            // Cleanup function to clear the timer if the user navigates away
            return () => clearTimeout(timer);
        }
    }, [searchParams]);
    // --- NEW LOGIC ENDS HERE ---

    // This is your exact return value, with the success message added at the top
    return (
        <AppLayout>
            {/* --- NEW JSX ELEMENT FOR THE SUCCESS MESSAGE --- */}
            {/* This message will only be rendered if showSuccess is true */}
            {showSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow animate-pulse">
                    <strong>Success!</strong> Your item report has been submitted.
                </div>
            )}
            {/* --- END OF NEW JSX --- */}

            <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-600 mt-1">What would you like to do today?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Card 1: Report a Lost Item */}
                <Link to="/report-item?type=lost" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-center">
                    <div className="h-12 w-12 mx-auto text-red-500">{React.createElement(FiEdit as IconType as React.ComponentType<IconBaseProps>, { size: 48 })}</div>
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">Report a Lost Item</h2>
                    <p className="mt-1 text-sm text-gray-500">Create a detailed report for an item you have lost.</p>
                </Link>

                {/* Card 2: Report a Found Item */}
                 <Link to="/report-item?type=found" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-center">
                    <div className="h-12 w-12 mx-auto text-green-500">{React.createElement(FiPlusSquare as IconType as React.ComponentType<IconBaseProps>, { size: 48 })}</div>
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">Report a Found Item</h2>
                    <p className="mt-1 text-sm text-gray-500">Found an item? Report it here to help its owner.</p>
                </Link>

                {/* Card 3: Search Found Items */}
                <Link to="/search" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 text-center">
                    <div className="h-12 w-12 mx-auto text-blue-500">{React.createElement(FiSearch as IconType as React.ComponentType<IconBaseProps>, { size: 48 })}</div>
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">Search Found Items</h2>
                    <p className="mt-1 text-sm text-gray-500">Browse through items that have been found on campus.</p>
                </Link>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;