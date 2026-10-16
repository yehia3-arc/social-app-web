import { useState } from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { NotificationType } from "../../Types/Notification.type";
import { useNavigate } from "react-router-dom"; // ✅ NEW

function auth() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  };
}

function getNotifications() {
  return axios.get(
    `https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=20`,
    auth(),
  );
}

function getUnreadCount() {
  return axios.get(
    `https://route-posts.routemisr.com/notifications/unread-count`,
    auth(),
  );
}

function markNotificationAsRead(notificationId: string) {
  return axios.patch(
    `https://route-posts.routemisr.com/notifications/${notificationId}/read`,
    {},
    auth(),
  );
}

function markAllAsRead() {
  return axios.patch(
    `https://route-posts.routemisr.com/notifications/read-all`,
    {},
    auth(),
  );
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ NEW
  const query = useQueryClient();

  const { data: countData } = useQuery({
    queryKey: ["getUnreadCount"],
    queryFn: getUnreadCount,
  });
  const unreadCount =
    countData?.data?.data?.count ?? countData?.data?.data?.unreadCount ?? 0;

  const { data, isLoading } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: getNotifications,
    enabled: isOpen,
  });
  const notifications: NotificationType[] =
    data?.data?.data?.notifications ?? [];

  const refresh = () => {
    query.invalidateQueries({ queryKey: ["getNotifications"] });
    query.invalidateQueries({ queryKey: ["getUnreadCount"] });
  };

  const { mutate: readOne } = useMutation({
    mutationFn: markNotificationAsRead,
    onSettled: refresh,
  });
  const { mutate: readAll, isPending } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (res) => toast.success(res.data.message),
    onSettled: refresh,
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer text-2xl text-gray-700"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -end-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[130%] end-0 w-80 bg-white rounded-lg border-2 shadow-lg p-2 z-50">
          <div className="flex justify-between items-center p-2">
            <p className="font-bold">Notifications</p>
            <button
              disabled={isPending}
              onClick={() => readAll()}
              className="text-xs text-blue-600 underline cursor-pointer"
            >
              mark all as read
            </button>
          </div>
          {isLoading ? (
            <p className="p-4 text-center text-slate-500 text-sm">loading...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-slate-500 text-sm">
              no notifications yet
            </p>
          ) : (
            <ul className="flex flex-col gap-1 max-h-96 overflow-y-auto">
              {notifications.map((n: any) => {
                // ✅ Extract postId robustly for navigation
                const postId =
                  n.post?._id ??
                  n.post ??
                  n.postId ??
                  n.data?.post?._id ??
                  n.data?.postId;

                // ✅ Extract actor name
                const actor =
                  n.user?.name ?? n.sender?.name ?? n.actor?.name ?? "someone";
                const label =
                  n.message ?? `${actor} → ${n.type?.replace(/_/g, " ")}`;

                return (
                  <li
                    key={n._id}
                    // ✅ FIX: Clicking the TEXT navigates to the post (if postId exists)
                    onClick={() => {
                      if (postId) navigate(`/postdetails/${postId}`);
                    }}
                    className={`p-2 rounded-lg cursor-pointer text-sm flex justify-between items-start gap-2 ${
                      n.read ? "bg-white" : "bg-blue-50 font-semibold"
                    }`}
                  >
                    {/* Left side: Notification text (clickable to go to post) */}
                    <div className="flex-1">
                      <p className="flex items-center gap-1">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                        {label}
                      </p>
                      <span className="block text-xs text-slate-400 mt-1">
                        {n.createdAt}
                      </span>
                    </div>

                    {/* ✅ FIX: Right side: Dedicated button to mark as read (doesn't navigate) */}
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ Prevent navigation when clicking the button
                          readOne(n._id);
                        }}
                        title="Mark as read"
                        className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      >
                        {/* ✅ React Icon for "Mark as Read" */}
                        <FaCheckCircle className="text-lg" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
