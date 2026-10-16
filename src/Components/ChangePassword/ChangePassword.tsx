import { useState, type FormEvent } from "react";
import { FaKey, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  // 👁 show / hide states (same idea as Login & Register)
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password || !newPassword) return;
    setIsPending(true);
    try {
      const res = await axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        { password, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      toast.success(res.data.message);
      setPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-150 mx-auto bg-white p-4 rounded-lg my-6 flex flex-col gap-4"
    >
      <h2 className="font-bold text-xl flex items-center gap-2">
        <FaKey /> Change Password
      </h2>

      {/* 1️⃣ old password + 👁 */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Old password"
          className="w-full rounded-lg border border-slate-300 p-2 pe-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-[50%] end-2 translate-y-[-50%] text-lg text-gray-600 cursor-pointer"
        >
          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </div>

      {/* 2️⃣ new password + 👁 */}
      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full rounded-lg border border-slate-300 p-2 pe-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword((prev) => !prev)}
          className="absolute top-[50%] end-2 translate-y-[-50%] text-lg text-gray-600 cursor-pointer"
        >
          {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </div>

      <button
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white font-bold p-2 rounded-lg cursor-pointer flex justify-center items-center gap-2"
      >
        {isPending ? <ImSpinner2 className="animate-spin" /> : <FaKey />} Save
      </button>
    </form>
  );
}
