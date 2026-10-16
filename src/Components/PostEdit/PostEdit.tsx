import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FaPen, FaImage } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { PostType } from "../../Types/Post.type";

// post = the data | onClose = function from Post.tsx to close the form
export default function PostEdit({
  post,
  onClose,
}: {
  post: PostType;
  onClose: () => void;
}) {
  const { _id, body, image } = post;

  // ✅ fresh mount every open => starts with the CURRENT post text
  const [editText, setEditText] = useState(body);
  const [editPreview, setEditPreview] = useState(""); // preview of NEW image
  const editImgInput = useRef<HTMLInputElement>(null);

  const query = useQueryClient();

  /* ---------- update request (PUT) ---------- */
  function updatePost(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: updatePost,
    onSuccess: (res) => {
      toast.success(res.data.message);

      // ⚡ NEW: patch the cache NOW => React re-renders immediately (no refresh)
      query.setQueryData(["getAllPosts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p: PostType) =>
                p._id === _id
                  ? {
                      ...p,
                      body: editText,
                      image: editPreview || p.image,
                    }
                  : p,
              ),
            },
          },
        };
      });

      // same for PostDetails page cache
      query.setQueryData(["getSinglePost", _id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: {
                ...old.data.data.post,
                body: editText,
                image: editPreview || old.data.data.post.image,
              },
            },
          },
        };
      });

      onClose(); // keep this (after you fix it in Post.tsx, it closes the form)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? "update failed");
    },
    onSettled: () => {
      // refresh home feed + post details page
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", _id] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] }); // prefix → covers Profile AND UserProfile
      query.invalidateQueries({ queryKey: ["getBookmarks"] });
    },
  });

  /* ---------- preview new image ---------- */
  function handleEditImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPreview(URL.createObjectURL(file));
  }

  /* ---------- send the update ---------- */
  function handleEditPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    if (editText) formData.append("body", editText);
    const file = editImgInput.current?.files?.[0];
    if (file) formData.append("image", file); // only if user chose a NEW image
    mutate(formData); // 🚀
  }

  return (
    <form
      onSubmit={handleEditPost}
      className="bg-white p-3 my-3 rounded-lg flex flex-col gap-3"
    >
      {/* 1️⃣ text (filled with current post body) */}
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="block w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
      />

      {/* 2️⃣ image: new preview if chosen, otherwise the old image */}
      {editPreview ? (
        <div className="relative">
          <img
            src={editPreview}
            alt=""
            className="w-full rounded-lg max-h-64 object-cover"
          />
          <IoCloseCircle
            onClick={() => {
              setEditPreview("");
              if (editImgInput.current) editImgInput.current.value = "";
            }}
            className="absolute top-2 inset-e-2 size-7 text-white cursor-pointer"
          />
        </div>
      ) : (
        image && (
          <img
            src={image}
            alt=""
            className="w-full rounded-lg max-h-64 object-cover"
          />
        )
      )}

      {/* 3️⃣ change image (optional) */}
      <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-200 hover:bg-slate-300 transition-all p-2 rounded-lg text-sm font-medium">
        <FaImage /> change image
        <input
          ref={editImgInput}
          type="file"
          accept="image/*"
          hidden
          onChange={handleEditImage}
        />
      </label>

      {/* 4️⃣ save / cancel */}
      <div className="flex gap-2">
        <button
          disabled={isPending}
          type="submit"
          className="flex-1 flex justify-center items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold p-2 rounded-lg cursor-pointer disabled:bg-slate-800 disabled:cursor-not-allowed"
        >
          {isPending ? <ImSpinner2 className="animate-spin" /> : <FaPen />}
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-bold p-2 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
