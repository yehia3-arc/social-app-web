// ✅ See more + EDIT + REPLY features
import { useContext, useEffect, useRef, useState } from "react";
import { timeAgo } from "../../utils/timeAgo"; // ✅ NEW (shared helper)
import ImageLightbox from "../ImageLightbox/ImageLightbox"; // ✅ NEW
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaPen, FaReply, FaImage } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";
import type { CommentType } from "../../Types/Comment.type";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

export default function Comment({
  comment,
  postId,

  onRepliesCount,
  postOwnerId,
}: {
  comment: CommentType;
  postId: string;
  allComments?: CommentType[];
  onRepliesCount?: (n: number) => void;
  postOwnerId?: string;
}) {
  const { userId: loginUserId } = useContext(AuthContext);
  const query = useQueryClient();
  const isOwner = comment?.commentCreator?._id === loginUserId;
  const isPostOwner = loginUserId === postOwnerId;
  /* ---------- "See more" state ---------- */
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  /* ---------- ✅ NEW: EDIT state ---------- */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editText, setEditText] = useState(comment?.content ?? "");
  const editImg = useRef<HTMLInputElement>(null);

  /* ---------- ✅ NEW: REPLY state ---------- */
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const replyImg = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 2);
  }, [comment?.content]);

  function auth() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };
  }

  /* ---------- DELETE (as before) ---------- */
  function handleDeleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      auth(),
    );
  }

  function handleUpdateComment(text: string) {
    const formData = new FormData();
    if (text) formData.append("content", text);
    const file = editImg.current?.files?.[0];
    if (file) formData.append("image", file);
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      auth(),
    );
  }

  /* ---------- ✅ NEW: REPLY = POST /posts/:postId/comments/:commentId/replies (form-data: content + image) ---------- */

  /* ---------- ✅ NEW: DELETE REPLY (replies are just comments with a parent) ---------- */
  function handleDeleteReply(replyId: string) {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${replyId}`,
      auth(),
    );
  }
  const { isPending: isDeleteReplyPending, mutate: deleteReplyMutate } =
    useMutation({
      mutationFn: handleDeleteReply,
      onSuccess: (res) => toast.success(res.data.message ?? "reply deleted"),
      onSettled: invalidateAll,
    });

  function handleCreateReply() {
    const formData = new FormData();
    if (replyText) formData.append("content", replyText);
    const file = replyImg.current?.files?.[0];
    if (file) formData.append("image", file);
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
      formData,
      auth(),
    );
  }

  /* ---------- refresh every cache that shows comments ---------- */
  function invalidateAll() {
    query.invalidateQueries({ queryKey: ["getPostComments", postId] });
    query.invalidateQueries({ queryKey: ["getAllPosts"] });
    query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
    query.invalidateQueries({ queryKey: ["getUserPosts"] });
    query.invalidateQueries({ queryKey: ["getBookmarks"] });
    // ✅ FIX: refetch THIS comment's replies → new reply shows without refresh
    query.invalidateQueries({ queryKey: ["getCommentReplies", comment._id] });
  }
  const { isPending, mutate } = useMutation({
    mutationFn: handleDeleteComment,
    onMutate: () => {
      query.setQueryData(["getAllPosts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p: any) =>
                p._id === postId
                  ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) }
                  : p,
              ),
            },
          },
        };
      });
      query.setQueryData(["getSinglePost", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: {
                ...old.data.data.post,
                commentsCount: Math.max(
                  0,
                  old.data.data.post.commentsCount - 1,
                ),
              },
            },
          },
        };
      });
    },
    onSuccess: (res) => toast.success(res.data.message),
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? "delete failed"),
    onSettled: invalidateAll,
  });

  const { isPending: isEditPending, mutate: editMutate } = useMutation({
    mutationFn: handleUpdateComment,
    // ✅ FIX: Patch cache instantly so edit + "Edited" label show without refresh
    onMutate: (text: string) => {
      query.setQueryData(["getPostComments", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              comments: old.data.data.comments.map((c: any) =>
                c._id === comment._id ? { ...c, content: text } : c,
              ),
            },
          },
        };
      });
    },
    onSuccess: (res) => {
      toast.success(res.data.message ?? "comment updated");
      setIsEditOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message ?? "update failed"),
    onSettled: invalidateAll,
  });

  const { isPending: isReplyPending, mutate: replyMutate } = useMutation({
    mutationFn: handleCreateReply,

    // ✅ FIX: Update the count INSTANTLY in browser memory (no waiting for server)
    onMutate: () => {
      query.setQueryData(["getAllPosts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((p: any) =>
                p._id === postId
                  ? { ...p, commentsCount: p.commentsCount + 1 }
                  : p,
              ),
            },
          },
        };
      });
      query.setQueryData(["getSinglePost", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: {
                ...old.data.data.post,
                commentsCount: old.data.data.post.commentsCount + 1,
              },
            },
          },
        };
      });
    },

    onSuccess: (res) => {
      console.log("Reply success:", res.data); // ✅ Debug log
      toast.success(res.data.message ?? "reply added");
      setReplyText("");
      setIsReplyOpen(false);
    },
    onError: (err: any) => {
      console.error("Reply error:", err); // ✅ Debug log
      toast.error(err.response?.data?.message ?? "reply failed");
    },
    onSettled: () => {
      console.log("Reply settled, invalidating queries"); // ✅ Debug log
      invalidateAll();
    },
  });

  /* ---------- ✅ NEW: replies come nested inside the comment object ---------- */
  // ✅ FIX: replies either nested (replies) OR flat comments whose parentComment = this comment's id
  /* ---------- ✅ FIX: FETCH this comment's replies (they are NOT inside GET comments) ---------- */
  function getReplies() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
      auth(),
    );
  }
  const { data: repliesData } = useQuery({
    queryKey: ["getCommentReplies", comment._id],
    queryFn: getReplies,
  });
  // nested (if API ever embeds them) OR from the replies endpoint (covers both response shapes)
  const replies: any[] =
    (comment as any)?.replies ??
    repliesData?.data?.data?.replies ??
    repliesData?.data?.data?.comments ??
    [];
  // ✅ tell Post.tsx how many replies this comment has (for the total count)
  useEffect(() => {
    onRepliesCount?.(replies.length);
  }, [replies.length]);

  return (
    <div className="my-2 bg-slate-100 w-[80%] mx-auto p-4 rounded-sm">
      {/* ---------- header + actions ---------- */}
      <div className="flex justify-between items-start gap-2 ">
        <div className="flex gap-3 items-center min-w-0">
          <img
            src={comment?.commentCreator.photo}
            className="w-10 h-10 rounded-full border-2 border-white"
            alt=""
          />
          <div>
            <Link
              to={
                comment?.commentCreator?._id === loginUserId
                  ? "/profile"
                  : `/user/${comment?.commentCreator?._id}`
              }
              className="font-bold wrap-break-word hover:text-indigo-600 "
            >
              {comment?.commentCreator.name}
            </Link>
            <p className="text-sm text-slate-500">
              {timeAgo(comment?.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {(!isOwner || replies.length > 0) && (
            <button
              onClick={() => {
                setIsReplyOpen(!isReplyOpen);
                // only auto-mention if replying to someone ELSE
                if (!isOwner)
                  setReplyText(`@${comment?.commentCreator?.username} `);
                else setReplyText(""); // clear text if replying to yourself
              }}
              title="reply"
              className="cursor-pointer text-blue-600 hover:text-blue-700 text-xl"
            >
              <FaReply />
            </button>
          )}

          {/* ✅ edit = comment author only */}
          {isOwner && (
            <button
              onClick={() => {
                setIsEditOpen(!isEditOpen);
                setEditText(comment?.content ?? "");
              }}
              title="edit"
              className="cursor-pointer text-amber-500 hover:text-amber-600 text-xl"
            >
              <FaPen />
            </button>
          )}

          {(isOwner || isPostOwner) && (
            <button
              disabled={isPending}
              onClick={() => mutate()}
              title="delete"
              className="cursor-pointer text-red-600 hover:text-red-700 text-xl"
            >
              {isPending ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <FaTrashAlt />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ---------- content + See more (hidden while editing) ---------- */}
      {!isEditOpen && (
        <>
          <p
            ref={textRef}
            className={`px-4 wrap-break-word whitespace-pre-wrap ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {comment?.content}
          </p>
          {(isClamped || expanded) && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="px-4 mt-1 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </>
      )}

      {/* ---------- ✅ NEW: EDIT form (PUT) ---------- */}
      {isEditOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!editText.trim()) return;
            editMutate(editText);
          }}
          className="flex flex-col gap-2 mt-2"
        >
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
          />
          {/* ✅ FIX: show "change image" ONLY if the comment already HAS an image */}
          {comment.image && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 bg-slate-200 hover:bg-slate-300 p-1.5 rounded-lg w-fit">
              <FaImage /> change image
              <input ref={editImg} type="file" accept="image/*" hidden />
            </label>
          )}
          <div className="flex gap-2">
            <button
              disabled={isEditPending}
              type="submit"
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-sm"
            >
              {isEditPending ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <FaPen />
              )}{" "}
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isReplyOpen && (
        <form
          id={`reply-form-${comment._id}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (!replyText.trim()) return;
            console.log("Submitting reply:", replyText); // ✅ Debug log
            replyMutate();
          }}
          className="flex flex-col gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          {/* ✅ Show who you're replying to */}
          <p className="text-xs text-slate-600 font-semibold">
            Replying to{" "}
            <Link
              to={
                comment?.commentCreator?._id === loginUserId
                  ? "/profile"
                  : `/user/${comment?.commentCreator?._id}`
              }
              className="text-blue-600 hover:underline"
            >
              {comment?.commentCreator?.name}
            </Link>
            's comment
          </p>
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${comment?.commentCreator?.name}...`}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 bg-slate-200 hover:bg-slate-300 p-1.5 rounded-lg w-fit">
            <FaImage /> add image
            <input ref={replyImg} type="file" accept="image/*" hidden />
          </label>
          <div className="flex gap-2">
            <button
              disabled={isReplyPending}
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-sm"
            >
              {isReplyPending ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <FaReply />
              )}{" "}
              Reply
            </button>
            <button
              type="button"
              onClick={() => setIsReplyOpen(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {/* ---------- ✅ NEW: replies list (nested under the comment) ---------- */}
      {replies.length > 0 && (
        <div className="mt-3 ms-8 border-s-2 border-slate-300 ps-3 flex flex-col gap-2">
          {replies.map((r: any) => (
            <div
              key={r._id}
              className="bg-white p-2 rounded-sm flex justify-between items-start gap-2"
            >
              <div className="flex gap-2">
                <img
                  src={r.commentCreator?.photo}
                  className="w-7 h-7 rounded-full border-2 border-white"
                  alt=""
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={
                        r.commentCreator?._id === loginUserId
                          ? "/profile"
                          : `/user/${r.commentCreator?._id}`
                      }
                      className="font-bold text-xs hover:text-lime-600"
                    >
                      {r.commentCreator?.name}
                    </Link>
                    {/* ✅ FIX: show time for the reply */}
                    <span className="text-[10px] text-slate-400">
                      {timeAgo(r.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {r.content}
                  </p>
                  {r.image && (
                    <img
                      src={r.image}
                      className="w-24 h-24 object-cover rounded-lg my-1"
                      alt=""
                    />
                  )}

                  <button
                    onClick={() => {
                      setIsReplyOpen(true);
                      setReplyText(`@${r.commentCreator?.username} `);
                      // ✅ Scroll to the reply form so user sees it opened
                      setTimeout(() => {
                        const form = document.getElementById(
                          `reply-form-${comment._id}`,
                        );
                        if (form)
                          form.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }, 100);
                    }}
                    className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* ✅ FIX: Delete button for replies (only if YOU wrote the reply) */}
              {r.commentCreator?._id === loginUserId ||
                (isPostOwner && (
                  <button
                    disabled={isDeleteReplyPending}
                    onClick={() => deleteReplyMutate(r._id)}
                    className="text-red-500 hover:text-red-700 text-xs cursor-pointer p-1"
                    title="delete reply"
                  >
                    {isDeleteReplyPending ? (
                      <ImSpinner2 className="animate-spin" />
                    ) : (
                      <FaTrashAlt />
                    )}
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}
      {/* ---------- comment image ---------- */}
      {comment.image && (
        <img
          src={comment.image}
          alt=""
          className="w-full max-w-48 h-auto object-cover rounded-lg border-2 border-white my-2 ms-4 cursor-pointer"
          onDoubleClick={() => setLightboxSrc(comment.image)} // ✅ Double-click to open
          title="Double-click to view full size"
        />
      )}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
