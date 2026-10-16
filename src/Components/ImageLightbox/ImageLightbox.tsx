import { FaTimes, FaThumbsUp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ImageLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose} // Close when clicking background
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 cursor-pointer z-[101]"
        title="Close"
      >
        <FaTimes />
      </button>

      {/* Reaction button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.success("Reaction added! 👍");
          // TODO: Connect to LikeButton mutation if needed
        }}
        className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white text-xl p-3 rounded-full cursor-pointer z-101 flex items-center gap-2"
        title="React"
      >
        <FaThumbsUp />
      </button>

      {/* Image */}
      <img
        src={src}
        alt="Full view"
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
      />
    </div>
  );
}
