import Link from "next/link";
import { useState } from "react";
import { FaBell, FaCheckCircle, FaUser } from "react-icons/fa";
import { CardItemProps } from "@/types/cards"; // Import the CardItemProps type

const notificationData: CardItemProps[] = [
  {
    icon: FaBell,
    cardTitle: "New Message from Dr. Jane",
    cardContent: "You have a new message from Dr. Jane.",
    timeSent: "2 mins ago",
    category: "message",
    isRead: false
  },
  {
    icon: FaCheckCircle,
    cardTitle: "Analysis Report Ready",
    cardContent: "Your analysis report is ready to view.",
    timeSent: "1 hour ago",
    category: "report",
    isRead: false
  },
  {
    icon: FaUser,
    cardTitle: "Dr. Smith Commented",
    cardContent: "Dr. Smith commented on your research.",
    timeSent: "3 days ago",
    category: "comment",
    isRead: true
  },
  {
    icon: FaBell,
    cardTitle: "Scheduled Meeting",
    cardContent: "Your meeting with Dr. Lee is in 30 minutes.",
    timeSent: "30 mins ago",
    category: "meeting",
    isRead: false
  },
];

const NotificationCard = () => {
  const [notifications, setNotifications] = useState(notificationData);

  const handleNotificationClick = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].isRead = true;
    setNotifications(updatedNotifications);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Notifications
      </h4>

      <div>
        {notifications.map((notification, index) => (
          <Link
            href="#" // Replace with appropriate URL or leave empty for now
            className={`flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4 ${
              !notification.isRead ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
            key={index}
            onClick={() => handleNotificationClick(index)}
          >
            <div className="text-xl text-gray-500 dark:text-gray-400">
              <notification.icon />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {notification.cardTitle}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {notification.cardContent}
                  </span>
                  <span className="text-xs"> . {notification.timeSent}</span>
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NotificationCard;