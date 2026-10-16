import axios from "axios";
// React hooks not needed here anymore
import type { PostType } from "./../../Types/Post.type";
import FollowSuggestions from "../../Components/FollowSuggestions/FollowSuggestions";
import Post from "../../Components/Post/Post";

import Loader from "../../Components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../../Components/PostCreation/PostCreation";
//import { Helmet } from "react-helmet";

export default function Home() {
  // if (!localStorage.getItem("userToken")) {
  //   // go login means if there no userToken (token ) so user neeed to login
  //   return <h1>not allowed !! , you need to login or register</h1>;
  // }
  //   thats not good idea because iif i have more tahn 5 pages so i can pt make it in every page that  wrong

  /*  const [allProducts, setallProducts] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isError, setisError] = useState(false); // or   , null */

  // const [isClicked, setisClicked] = useState(false); // if want user clcik opn button to get information liek : get all posts
  function getAllPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/posts?sort=-createdAt`,
      {
        // params : {limit:50}    , limit num,ber of posts  ( according to backened of api )
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          //Bearer accordin what backend say in postman
        },
      },
    ); //  ..../posts?sort=createdAt`  // ( لكلا ينظم post الى القدية sort من backend)
    /* .then((res) => {
        console.log(res.data.data.posts);
        setallProducts(res.data.data.posts);
      })
      .catch((err) => {
        console.log(err);
        setisError(true);
      })
      .finally(() => {
        setisLoading(false);
      }); */
  }
  /*  useEffect(() => {
    getAllPosts();
  }, []); */

  /* if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <h1>Error ...</h1>;
  } */
  // that in {} from tankstak libray ⬇️
  const { data, isLoading, isError, error, isFetching } = useQuery({
    // see status of request
    queryKey: ["getAllPosts"], // same name of function ( function getAllPosts) to save request and if call it again and means it cash so if change it reload automatic if data change if not come cash not reloading
    queryFn: getAllPosts, // function  name that send request and  , add ( return ) in function name thats end request

    retry: 3, // number of try to get request
    retryDelay: 2000, // time request will wait for new retry
    // staleTime :8000  , // means data in cash old and new to update
    gcTime: 10000, // means time if user get of page and user retujrn before time of gcTime data will not cash ,  but if time pass data will cash ,means forget cash  ( refetch)
    //  enabled: isClicked,
  });

  console.log("data", data?.data.data.posts);
  console.log("isLoading", isLoading);
  /*  console.log("isError", isError);
  console.log("error", error); */
  console.log("isFetching", isFetching);

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
      <title>Home</title>
      <div className="my-8 flex flex-col items-center gap-6">
        {/* ✅ 1. Create Post (Centered) */}
        <div className="w-full max-w-2xl">
          <PostCreation />
        </div>

        <div className="w-full max-w-2xl">
          <FollowSuggestions />
        </div>

        {/* ✅ 3. All Posts (Centered Feed) */}
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {data?.data.data.posts.map((post: PostType) => (
            <Post post={post} key={post.id} isPostDetails={false} />
          ))}
        </div>
      </div>
    </>
  );
}
