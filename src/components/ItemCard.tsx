import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import placeholderImage from '../assets/placeholder.png'; // A fallback image

// Define the shape of the item data this card will receive
interface Item {
  _id: string;
  title: string;
  location: string;
  date: string;
  imageUrl?: string;
}

const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
  // Format the date for better readability
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link 
      to={`/item/${item._id}`} // Link to the detailed view page
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <img
          src={item.imageUrl || placeholderImage}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{item.title}</h3>
        
        <div className="mt-2 space-y-2 text-sm text-gray-600 flex-grow">
          <div className="flex items-center">
            <IconContext.Provider value={{className: 'h-4 w-4 mr-2 text-gray-500'}}>
                <FiMapPin />
            </IconContext.Provider>
            <span className="truncate">Found at: {item.location}</span>
          </div>
          <div className="flex items-center">
             <IconContext.Provider value={{className: 'h-4 w-4 mr-2 text-gray-500'}}>
                <FiCalendar />
            </IconContext.Provider>
            <span>Found on: {formattedDate}</span>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-gray-200">
             <p className="text-center text-sm font-semibold text-teal-600 group-hover:underline">
                View Details
             </p>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;