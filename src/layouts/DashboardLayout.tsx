import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/layout/AppSidebar';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
