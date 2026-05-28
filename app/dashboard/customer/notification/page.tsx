"use client";

import { useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, getToken } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  async function loadNotifications() {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      setLoggedIn(true);
      const data = await authFetch<{ notifications: Notification[]; unreadCount: number }>("/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markRead(id: string) {
    try {
      await authFetch(`/notifications/${id}/read`, { method: "PUT" });
      toast.success("Notification marked as read");
      window.dispatchEvent(new Event("nexxora-notification-change"));
      loadNotifications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    }
  }

  async function markAllRead() {
    try {
      await authFetch("/notifications/read-all", { method: "PUT" });
      toast.success("All notifications marked as read");
      window.dispatchEvent(new Event("nexxora-notification-change"));
      loadNotifications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    }
  }

  return (
    <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <motion.span animate={unreadCount > 0 ? { rotate: [0, -12, 12, 0] } : {}} transition={{ repeat: Infinity, duration: 1.6 }} className="text-3xl text-gold">
              <FiBell />
            </motion.span>
            <h1 className="text-4xl font-black text-offWhite">Nexxora Notifications</h1>
          </div>
          <p className="mt-3 text-muted">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 ? <AnimatedButton onClick={markAllRead} iconLeft={FiCheckCircle}>Mark All as Read</AnimatedButton> : null}
      </div>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="order" /> : !loggedIn ? (
          <EmptyState icon={FiLogIn} title="Login required" description="Please login to read Nexxora notifications." actionLabel="Login" href="/login" />
        ) : notifications.length === 0 ? (
          <EmptyState icon={FiBell} title="Notification kosong" description="Nexxora notifications for order and payment updates will appear here." actionLabel="Explore Catalog" href="/catalog" />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.article
                key={notification.id}
                layout
                className={cn(
                  "rounded-2xl border bg-slateBlue/60 p-5 shadow-soft transition",
                  notification.isRead ? "border-white/10" : "border-gold/45 shadow-gold",
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xl font-bold text-offWhite">{notification.title}</p>
                    <p className="mt-2 text-muted">{notification.message}</p>
                    <p className="mt-3 text-sm text-muted">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead ? (
                    <AnimatedButton variant="secondary" onClick={() => markRead(notification.id)}>
                      Mark as Read
                    </AnimatedButton>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
