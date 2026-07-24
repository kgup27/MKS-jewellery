import { motion } from "framer-motion";
import AnnouncementBar from "../components/AnnouncementBar/AnnouncementBar";
import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  return (
    <>
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.main>
    </>
  );
}

export default MainLayout;