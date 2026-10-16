import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FaPen, FaImage, FaPaperPlane } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState(""); // preview only (blob URL)
  const textInput = useRef<HTMLTextAreaElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const query = useQueryClient();
  // ✅ add under the refs
  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto"; // reset first so it can also SHRINK when you delete
    el.style.height = el.scrollHeight + "px"; // then grow to fit the text
  }
  function createPost(formData: FormData) {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      clearForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? "post failed");
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
  });

  function clearForm() {
    if (textInput.current) textInput.current.value = "";
    if (imgInput.current) imgInput.current.value = "";
    setisUploaded("");
  }

  /* ✅ FIXED: typed + guarded + debug log */
  function handleImagePreview(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    console.log("picked file:", file); // 🐞 see it in Console
    if (!file) return; // ❌ no crash if empty/cancelled
    if (!file.type.startsWith("image/")) {
      toast.error("please choose an image file");
      return;
    }
    setisUploaded(URL.createObjectURL(file)); // preview appears NOW
  }

  function handleCreatePost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = textInput.current?.value ?? "";
    const file = imgInput.current?.files?.[0] ?? null; // ✅ safe
    console.log("sending file:", file); // 🐞 null = image never picked
    if (!text && !file) return;
    const formData = new FormData();
    if (text) formData.append("body", text);
    if (file) formData.append("image", file); // key MUST be "image"
    mutate(formData);
  }

  return (
    <>
      <div className="w-full md:w-150 mx-auto bg-white p-4 rounded-lg my-6 shadow-sm">
        <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
          {/* 1️⃣ text */}
          <div className="relative">
            <FaPen className="absolute top-[50%] inset-s-3 translate-y-[-50%] text-slate-400" />
            <textarea
              ref={textInput}
              rows={1}
              onInput={(e) => autoGrow(e.currentTarget)}
              placeholder="What's on your mind?"
              className="block w-full rounded-lg border border-slate-300 p-3 ps-9 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none overflow-y-auto max-h-40 wrap-break-word"
            />
          </div>

          {/* ✅ preview between text and upload box */}
          {isUploaded && (
            <div className="relative">
              <img
                src={isUploaded}
                alt=""
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <IoCloseCircle
                onClick={() => {
                  setisUploaded("");
                  if (imgInput.current) imgInput.current.value = "";
                }}
                className="absolute top-2.5 inset-e-2.5 size-8 text-white cursor-pointer"
              />
            </div>
          )}

          {/* 2️⃣ pick image */}
          <label className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-4 text-slate-500 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
            <FaImage className="size-6" />
            <span className="text-sm font-medium">Upload Image</span>
            <input
              ref={imgInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImagePreview}
            />
          </label>

          <button
            disabled={isPending}
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 p-2 font-bold text-white transition-colors hover:bg-indigo-700 cursor-pointer disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
            Post
          </button>
        </form>
      </div>
    </>
  );
}
