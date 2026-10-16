import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaCompass } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <title>404 - Page Not Found</title>

      {/* ✅ giant gradient 404 */}
      <p className="text-[6rem] md:text-[10rem] font-black leading-none bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none">
        404
      </p>

      {/* ✅ floating icon */}
      <span className="text-5xl text-indigo-600 animate-bounce mb-4">
        <FaCompass />
      </span>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
        Oops! Page not found
      </h1>
      <p className="text-slate-500 max-w-md mb-8">
        The page you are looking for doesn't exist, was moved, or is still on
        vacation. Try heading back to safety.
      </p>

      {/* ✅ action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          <FaHome /> Go Home
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-lg border border-slate-300 transition-colors cursor-pointer"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
}