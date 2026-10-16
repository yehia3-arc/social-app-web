import axios from "axios";

import Loader from "./../../Components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Post from "../../Components/Post/Post";

export default function PostDetails() {
  // post details

  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getPostDetails,
    retry: 3,
  });
  console.log(data?.data.data.post);
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <p className=" font-bold bg-red-500 text-white absolute top-[50%] left-[50%] text-2xl">
        {error.message}
      </p>
    );
  }

  return (
    <>
      {data?.data.data.post && (
        <Post post={data?.data.data.post} isPostDetails={true} />
      )}
    </>
  );
}
