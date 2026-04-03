import ChatSidebar from "@/components/ChatSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#020617] text-white">
      
      {/* Sidebar */}
      {/* <div className="w-[260px] border-r border-gray-800 bg-[#020617]">
        <ChatSidebar />
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}