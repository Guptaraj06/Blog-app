import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
const Dashboard = () => {
  const { search } = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const redirect = new URLSearchParams(search).get("tab");
    setTab(redirect);
  }, [search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
    </div>
  );
};

export default Dashboard;
