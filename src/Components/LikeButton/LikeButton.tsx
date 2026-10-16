import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LikeButton({
  postId,
  isLiked = false,
  likesCount = 0,
}: {
  postId: string;
  isLiked?: boolean;
  likesCount?: number;
}) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likesCount);
  const query = useQueryClient();

  function likeUnlikePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: likeUnlikePost,
    onMutate: () => {
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    },
    onError: () => {
      setLiked(liked);
      setCount(count);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost"] });
      query.invalidateQueries({ queryKey: ["getBookmarks"] });
    },
  });

  return (
    <button
      disabled={isPending}
      onClick={() => mutate()}
      className="font-bold cursor-pointer flex gap-1 md:gap-3 items-center"
    >
      {liked ? <AiFillLike className="text-blue-600" /> : <AiOutlineLike />}{" "}
      {count || "Likes"}
    </button>
  );
}
