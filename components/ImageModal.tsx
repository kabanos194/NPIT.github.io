
import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  // Add an effect to handle the 'Escape' key press for closing the modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-transparent" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image container
      >
        <img src={imageUrl} alt="Zoomed view" className="block max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close image view"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
