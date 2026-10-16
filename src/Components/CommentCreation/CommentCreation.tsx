import React from "react";
import { useForm } from "react-hook-form";
import { FaComment } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";

export default function CommentCreation({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: string[];
}) {
  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const query = useQueryClient();

  const { register, handleSubmit, reset } = form;
  //const formdata = new FormData();

  function autoGrow(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    el.style.height = "auto"; // reset first so it can also SHRINK when you delete
    el.style.height = el.scrollHeight + "px"; // then grow to fit the text
  }

  function createComment(formData: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { data, isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      //console.log("comment created");
      toast.success(res.data.message);

      // ✅ FIX 3: Invalidate ALL affected caches so the comment count (commentsCount)
      // and topComment update INSTANTLY everywhere without needing a page refresh!
      query.invalidateQueries({ queryKey: queryKey }); // The one passed from Post.tsx
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
      query.invalidateQueries({ queryKey: ["getPostComments", postId] });

      reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? "comment failed");
    },
    onSettled() {},
  });
  function handleCreateComment(values: { content: string; image: string }) {
    if (!values.content && !values.image) {
      return;
    }
    const formdata = new FormData();
    if (values.content) {
      formdata.append("content", values.content);
    }
    if (values.image) {
      formdata.append("image", values.image[0]);
    }

    mutate(formdata);
  }

  return (
    <div className="bg-white p-3 my-4">
      <div>
        <form
          className="max-w-md mx-auto"
          onSubmit={handleSubmit(handleCreateComment)}
        >
          {/* ✅ FIX: textarea instead of input => text wraps to lines under, box grows as you type */}
          <div className="flex items-end gap-2 rounded-lg border border-slate-300 p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <textarea
              {...register("content")}
              id="commentBox"
              rows={1}
              onInput={autoGrow}
              className="flex-1 w-full resize-none overflow-y-auto max-h-40 p-2 text-sm outline-none bg-transparent break-words [overflow-wrap:anywhere]"
              placeholder="Write a comment..."
            />
            <button
              disabled={isPending}
              type="submit"
              className="shrink-0 disabled:bg-slate-800 disabled:cursor-not-allowed text-white bg-blue-600 hover:bg-blue-700 rounded text-xs px-3 py-2 focus:outline-none"
            >
              {isPending ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <FaComment />
              )}
            </button>
          </div>
          {/*  <label htmlFor="img">upload</label>
          <input type="file" id="img" hidden /> */}
          <label className="my-2 bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer p-2 flex justify-center text-white">
            <FaImage className="size-6 " />

            <input type="file" hidden {...register("image")} />
          </label>
        </form>
      </div>
    </div>
  );
}
