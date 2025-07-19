import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";

export default function DashSideBar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const activeClassName = "bg-gradient-to-r from-blue-500 to-green-500 text-white";
  const inactiveClassName = "text-gray-700 hover:bg-gray-200";

  return (
    <Sidebar className="w-full md:w-56 bg-white shadow-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=client">
            <Sidebar.Item
              className={`${tab === "client" ? activeClassName : inactiveClassName} rounded-lg p-2`}
              active={tab === "client"}
              as="div"
            >
              Client
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=appointment">
            <Sidebar.Item
              className={`${tab === "appointment" ? activeClassName : inactiveClassName} rounded-lg p-2`}
              active={tab === "appointment"}
              as="div"
            >
              Appointment
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
