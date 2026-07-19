import { useState } from "react";
import { MessageCircle, ListChecks, ClipboardList, LogOut } from "lucide-react";
import ChatView from "./ChatView";
import RoutineBuilder from "./RoutineBuilder";
import CheckinView from "./CheckinView";

const Dashboard = ({ userEmail, onLogout }) => {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    { id: "chat", label: "Chat with AI", icon: MessageCircle },
    { id: "routines", label: "My routines", icon: ListChecks },
    { id: "checkins", label: "Check-ins", icon: ClipboardList },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <nav className="flex md:flex-col gap-1 px-4 py-3 md:w-56 md:min-h-full border-b md:border-b-0 md:border-r border-[#2E3733]">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={
              "flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors text-left " +
              (activeTab === id
                ? "bg-[#232B28] text-[#F2F0E9]"
                : "text-[#8A9691] hover:text-[#F2F0E9]")
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}

        <div className="mt-auto flex flex-col gap-1">
          {userEmail && (
            <span className="hidden md:block text-xs text-[#5E6862] px-3 py-1 truncate" title={userEmail}>
              {userEmail}
            </span>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm px-3 py-2 text-[#8A9691] hover:text-[#F2F0E9] transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        {activeTab === "chat" && <ChatView />}
        {activeTab === "routines" && <RoutineBuilder />}
        {activeTab === "checkins" && <CheckinView />}
      </div>
    </div>
  );
};

export default Dashboard;
