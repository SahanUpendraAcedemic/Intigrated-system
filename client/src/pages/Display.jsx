import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Correct import syntax for jsPDF
import html2canvas from 'html2canvas';

import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Display() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const aboutContentRef = useRef(null);
  useEffect(() => {
    handleShowListings(); // Automatically calls the function when component mounts
  }, []);

  const formatDate = (date) => {
    // Convert the date string to a Date object
    const createdAtDate = new Date(date);
  
    // Format the date to display only the date portion
    const formattedDate = createdAtDate.toLocaleDateString();
  
    return formattedDate;
  };
 

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
 
  const objectIdToReadableId = (objectId) => {
    // Convert the ObjectId to a string
    const idString = objectId.toString();
  
    // Extract a portion of the string to create a more readable ID
    const readableId = idString.substring(idString.length - 6); // Example: Take the last 6 characters
  
    return `PO${readableId}`;
  };

  return (
    <div className='p-3 w-2/4  mx-auto me-64' ref={aboutContentRef}>
     

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''} 
      </p>

      {userListings && userListings.length >= 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-gray-700 font-roboto text-4xl mb-8 mt-10'>
            Purchase Orders
          </h1>
          
          <table className="w-full border-collapse"   >
  <thead>
    <tr className="bg-gray-200 text-gray-700">
      
      <th className="border border-blue-700 py-2 px-4">ID</th>
      <th className="border border-blue-700 py-2 px-4">SUPPLIER NAME</th>
      <th className="border border-blue-700 py-2 px-4">CREATED DATE</th>
      <th className="border border-blue-700 py-2 px-4">LAST UPDATE</th>
      <th className="border border-blue-700 py-2 px-4">STATUS</th>
      <th className="border border-blue-700 py-2 px-4">DELETE</th>
      <th className="border border-blue-700 py-2 px-4">EDIT</th>
     

    </tr>
  </thead>
  <tbody>
    {userListings.map((listing) => (
      <tr key={listing._id} className="border-b">
       
       <td className="py-2 px-4 border">
       <Link to={`/listing/${listing._id}`} className="underline text-blue-700">
        {objectIdToReadableId(listing._id)}
      </Link>
            
          
        </td>
        <td className="py-2 px-4 border">
         
            {listing.supplierName}
          
        </td>
        <td className="py-2 px-4 border">
           
            
            
         
            {formatDate(listing.createdAt)}
         
        </td>
        <td className="py-2 px-4 border">
          
            {formatDate(listing.updatedAt)}
         
        </td>
        <td className="py-2 px-4 border">
        <div className="flex flex-col item-center">
            
            <button className="text-red-4 00 uppercase">Pending</button>
         
        </div>
        </td>
          
        <td className="py-2 px-4 border">
          <div className="flex flex-col item-center">
            <button
              onClick={() => handleListingDelete(listing._id)}
              className="text-red-700 uppercase"
            >
              Delete
            </button>
            
          </div>
        </td>
        <td className="py-2 px-4 border">
          <div className="flex flex-col item-center">
            <Link to={`/update-po/${listing._id}`}>
              <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
        </td>
        
      </tr>
    ))}
  </tbody>
</table>


        </div>
      )}
    </div>
  );
}
