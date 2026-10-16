import { ThreeDots } from "react-loader-spinner";
export default function Loader() {
  return (
    <div className="absolute h-screen  w-full flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="100"
        width="100"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
