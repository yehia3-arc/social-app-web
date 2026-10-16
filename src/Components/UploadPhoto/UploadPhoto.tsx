import { useRef, useState, type ChangeEvent } from "react";
import { FaCamera } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// ✅ NEW optional onClose → lets Profile close the form after upload/cancel
export default function UploadPhoto({ onClose }: { onClose?: () => void }) {
  const imgInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [isPending, setIsPending] = useState(false);
  const query = useQueryClient();

  function auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };
  }

  function handlePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    const file = imgInput.current?.files?.[0];
    if (!file) return toast.error("choose an image first");

    // 1️⃣ upload the new profile photo (PUT /users/upload-photo)
    const formData = new FormData();
    formData.append("photo", file); // Postman key = photo

    setIsPending(true);
    try {
      const res = await axios.put(
        `https://route-posts.routemisr.com/users/upload-photo`,
        formData,
        auth(),
      );
      toast.success(res.data.message);

      // 3️⃣ refresh photo + feeds everywhere
      query.invalidateQueries({ queryKey: ["getMyProfile"] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] }); // covers ["getUserPosts", id] too
      query.invalidateQueries({ queryKey: ["getUserProfile"] });

      setPreview("");
      if (imgInput.current) imgInput.current.value = "";
      onClose?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "upload failed");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg my-4 flex flex-col items-center gap-3 shadow-sm">
      {preview && (
        <img
          src={preview}
          className="w-24 h-24 rounded-full object-cover border-2 border-white"
          alt=""
        />
      )}
      <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 p-2 rounded-lg text-sm font-medium flex items-center gap-2">
        <FaCamera /> choose photo
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePick}
        />
      </label>
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold p-2 px-4 rounded-lg cursor-pointer flex items-center gap-2"
        >
          {isPending ? <ImSpinner2 className="animate-spin" /> : <FaCamera />}{" "}
          upload
        </button>
        {/* ✅ Cancel button appears only when opened from the profile photo */}
        {onClose && (
          <button
            onClick={onClose}
            className="bg-slate-500 hover:bg-slate-600 text-white font-bold p-2 px-4 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
