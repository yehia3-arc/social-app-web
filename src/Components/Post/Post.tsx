import { useContext, useState } from "react";

import ImageLightbox from "../ImageLightbox/ImageLightbox"; // ✅ NEW
import { FaRegComment, FaShare, FaPen, FaTrashAlt } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import type { PostType } from "../../Types/Post.type";
import type { CommentType } from "../../Types/Comment.type";
import Comment from "../Comment/Comment";
import CommentCreation from "../CommentCreation/CommentCreation";
import Loader from "./../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import PostEdit from "../PostEdit/PostEdit";
import LikeButton from "../LikeButton/LikeButton";
import BookmarkButton from "../BookmarkButton/BookmarkButton";

export default function Post({
  post,
  isPostDetails = false,
}: {
  post: PostType;
  isPostDetails?: boolean;
}) {
  const {
    body,
    image,
    user,
    createdAt,
    topComment,
    _id,
    likes,
    likesCount,
    bookmarked,
    isShare,
    sharedPost,
    commentsCount,
    sharesCount, // ✅ now actually USED below
  } = post;
  const { name, photo, _id: userId } = user;
  const { userId: loginUserId } = useContext(AuthContext);

  const query = useQueryClient();
  const navigate = useNavigate();

  const [isOpen, setisOpen] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ See more / See less

  // ✅ split body into words → if more than 230, truncate until expanded
  const words = (body || "").split(/\s+/).filter(Boolean);
  const isLong = words.length > 230;
  const shownBody =
    isLong && !expanded ? words.slice(0, 230).join(" ") + " …" : body;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false); // ✅ share box open/close
  const [shareText, setShareText] = useState(""); // ✅ share caption
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null); // ✅ NEW
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({}); // ✅ replies per comment
  const totalReplies = Object.values(replyCounts).reduce((a, b) => a + b, 0);
  // ✅ FIX: details page count = top-level comments + all replies (Facebook-style)
  const shownCommentsCount = isPostDetails
    ? commentsCount + totalReplies
    : commentsCount;
  /* ---------- comments (same as before) ---------- */
  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments", _id],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  /* ---------- delete post (same as before) ---------- */
  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }
  const { isPending, mutate } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? "delete failed");
    },
  });

  /* ---------- ✅ NEW: share post (POST /posts/:id/share) ---------- */
  function handleSharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${_id}/share`,
      { body: shareText },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { isPending: isSharePending, mutate: shareMutate } = useMutation({
    mutationFn: handleSharePost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setIsShareOpen(false);
      setShareText("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? "share failed");
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <p className="font-bold bg-red-500 text-white absolute top-[50%] left-[50%] text-2xl">
        {error.message}
      </p>
    );
  }

  return (
    <>
      <div
        className="w-full md:w-155 mx-auto bg-slate-300 p-4 rounded-lg my-6 "
        key={post._id}
      >
        {/* ---------- header (author = link to his profile ✅) ---------- */}

        <div className="flex justify-between items-start gap-2">
          <Link
            to={`/user/${userId}`}
            className="flex gap-3 items-center min-w-0"
          >
            <img
              src={photo}
              className="w-10 h-10 rounded-full border-2 border-white"
              alt=""
            />
            <div>
              {/* ✅ FIX: post author name clickable too */}
              <Link
                to={userId === loginUserId ? "/profile" : `/user/${userId}`}
                className="font-bold  cursor-pointer  hover:text-indigo-600 truncate"
              >
                {name}
              </Link>

              <p className="text-sm text-slate-500">{createdAt}</p>
            </div>
          </Link>

          <div className="relative">
            {loginUserId === userId && (
              <HiDotsVertical
                onClick={() => setisOpen(!isOpen)}
                className="text-2xl cursor-pointer"
              />
            )}
            {isOpen && (
              <div className="bg-white p-2 rounded-lg absolute top-[120%] -inset-e-20 border-2 z-10">
                <ul className="flex flex-col gap-3">
                  <li>
                    <button
                      onClick={() => {
                        setIsEditOpen(true);
                        setisOpen(false);
                      }}
                      className="font-semibold bg-amber-300 flex gap-2 items-center cursor-pointer text-xl w-full justify-between"
                    >
                      Edit <FaPen />
                    </button>
                  </li>
                  <li>
                    <button
                      disabled={isPending}
                      onClick={() => mutate()}
                      className="font-semibold bg-red-600 flex gap-2 items-center cursor-pointer text-xl disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-white"
                    >
                      {isPending ? (
                        <ImSpinner2 className="animate-spin" />
                      ) : (
                        <>
                          Delete <FaTrashAlt />
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ---------- edit form ---------- */}
        {loginUserId === userId && isEditOpen && (
          <PostEdit post={post} onClose={() => setIsEditOpen(false)} />
        )}

        {/* ---------- body ---------- */}
        <div className="p-4">
          {/* ✅ FIX: long words wrap under + "See more" after 230 words */}
          <p className="mb-4 whitespace-pre-wrap wrap-break-word ">
            {shownBody}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mb-4 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}

          {/* ✅ sharedPost embed (isShare = this post is a share of another post) */}
          {isShare && sharedPost && (
            <div className="mb-4 border-2 border-slate-400 rounded-lg p-3 bg-slate-200">
              {/* ✅ FIX: make the ORIGINAL author clickable → go to his profile */}
              <Link
                to={
                  sharedPost.user?._id === loginUserId
                    ? "/profile" // if the embedded author is ME → my profile
                    : `/user/${sharedPost.user?._id}` // ⚠️ use the SAME path string as your <Route> for UserProfile in App.tsx
                }
                className="flex gap-3 items-center hover:underline cursor-pointer"
              >
                <img
                  src={sharedPost.user?.photo}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt=""
                />
                <div>
                  <p className="font-bold text-sm">{sharedPost.user?.name}</p>
                  <p className="text-xs text-slate-500">
                    {sharedPost.createdAt}
                  </p>
                </div>
              </Link>
              <p className="my-2 whitespace-pre-wrap wrap-break-word">
                {sharedPost.body}
              </p>
              {sharedPost.image && (
                <img
                  src={sharedPost.image}
                  className="w-full rounded-lg"
                  alt=""
                />
              )}
            </div>
          )}

          {image && (
            <img
              src={image}
              alt=""
              className="w-full max-h-80 md:max-h-125 object-cover rounded-lg cursor-pointer"
              onDoubleClick={() => setLightboxSrc(image)} // ✅ Double-click to open
              title="Double-click to view full size"
            />
          )}
        </div>

        {/* ---------- actions (✅ real counts now) ---------- */}

        <div className="md:p-4 p-3 flex flex-wrap justify-between gap-2 bg-white rounded-sm text-sm md:text-base">
          <LikeButton
            postId={_id}
            isLiked={likes.includes(loginUserId)}
            likesCount={likesCount}
          />

          <Link to={`/postdetails/${_id}`}>
            <div className="font-bold cursor-pointer flex gap-1 md:gap-3 items-center">
              Comments <FaRegComment />
              <span className="text-slate-500 font-normal">
                ({shownCommentsCount})
              </span>
            </div>
          </Link>

          <div className="flex gap-2 md:gap-3 items-center">
            <BookmarkButton postId={_id} isBookmarked={bookmarked} />
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="font-bold cursor-pointer flex gap-1 md:gap-3 items-center"
            >
              Share <FaShare />
              <span className="text-slate-500 font-normal">
                ({sharesCount})
              </span>
            </button>
          </div>
        </div>

        {/* ✅ share box */}
        {isShareOpen && (
          <div className="bg-white p-3 mt-2 rounded-sm flex gap-2">
            <input
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="write something about this post..."
              className="flex-1 rounded-lg border border-slate-300 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              disabled={isSharePending}
              onClick={() => shareMutate()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold px-4 rounded-lg cursor-pointer flex items-center gap-2"
            >
              {isSharePending ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <FaShare />
              )}{" "}
              Share
            </button>
          </div>
        )}

        <CommentCreation
          postId={_id}
          queryKey={isPostDetails ? ["getPostComments", _id] : ["getAllPosts"]}
        />

        {/* ✅ postId passed so Comment can delete */}
        {!isPostDetails && topComment && (
          <Comment comment={topComment} postId={_id} postOwnerId={userId} />
        )}

        {isPostDetails &&
          data?.data.data.comments &&
          data?.data.data.comments
            .filter((c: CommentType) => !c.parentComment)
            .map((comment: CommentType) => (
              <Comment
                key={comment._id}
                comment={comment}
                postId={_id}
                postOwnerId={userId}
                allComments={data?.data.data.comments}
                onRepliesCount={
                  (n) =>
                    setReplyCounts((prev) =>
                      prev[comment._id] === n
                        ? prev
                        : { ...prev, [comment._id]: n },
                    ) /* ✅ same value → same object → no re-render loop */
                }
              />
            ))}
      </div>
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
