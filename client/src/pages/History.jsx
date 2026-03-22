import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiDownload, FiShare2, FiTrash2 } from 'react-icons/fi';
import Footer from '../components/Footer';

const History = ({ user }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;
    try {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/image/history`, {
    headers: { token }
  });

      if (data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load history.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Download Handler
  const handleDownload = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `promptVision-${prompt.substring(0, 15).replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloading image...");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  // Share Handler (Copies URL to clipboard)
  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
  const token = localStorage.getItem('token');
  const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/image/delete/${id}`, {
    headers: { token }
  });

      if (data.success) {
        toast.success("Image deleted");
        setImages(images.filter(img => img._id !== id)); // Remove from UI instantly
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      <div className="flex-grow pt-32 pb-20 px-5 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">History</span>
        </h1>
        <p className="text-zinc-400 mb-10">Look back at all the amazing things you've created.</p>

        {!user ? (
          <div className="text-center py-20 text-zinc-500">Please log in to view your history.</div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            You haven't generated any images yet. Go create something amazing!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img._id} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
                <img src={img.imageUrl} alt={img.prompt} className="w-full aspect-square object-cover" />
                
                {/* Overlay with details and buttons */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <p className="text-sm text-zinc-300 line-clamp-3">{img.prompt}</p>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleDownload(img.imageUrl, img.prompt)} className="p-2 bg-zinc-800 hover:bg-pink-600 text-white rounded-lg transition-colors" title="Download">
                      <FiDownload />
                    </button>
                    <button onClick={() => handleShare(img.imageUrl)} className="p-2 bg-zinc-800 hover:bg-blue-600 text-white rounded-lg transition-colors" title="Share Link">
                      <FiShare2 />
                    </button>
                    <button onClick={() => handleDelete(img._id)} className="p-2 bg-zinc-800 hover:bg-red-600 text-white rounded-lg transition-colors" title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;