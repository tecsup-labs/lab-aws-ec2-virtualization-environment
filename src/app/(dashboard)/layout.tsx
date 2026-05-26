import Sidebar from '@/shared/components/Sidebar';
import Navbar from '@/shared/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafd] relative">
      {/* Premium Glass Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-indigo-200/25 to-violet-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-pink-100/20 to-indigo-150/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-violet-100/15 to-indigo-100/15 blur-[110px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Inner Screen View */}
        <main className="flex-1 overflow-y-auto bg-transparent p-6 md:p-8 transition-colors duration-200">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
