import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/user";
const DashSidebar = () => {
  const [tab, setTab] = useState("");
  const { search } = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const redirect = new URLSearchParams(search).get("tab");
    if (redirect) {
      setTab(redirect);
    }
  }, [search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout/");
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark"
            as="div"
          >
            Profile
          </Sidebar.Item>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
