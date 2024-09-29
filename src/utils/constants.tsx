import { CiSettings } from "react-icons/ci";
import { GrHome } from "react-icons/gr";
import { sidebarItemType } from "./types";

export type imageType = "profilePics" | "idcard";
const sidebarItems: sidebarItemType[] = [
  {
    title: "Dashboard",
    icon: GrHome,
    className: "sidebar-icon",
    route: "/dashboard",
  },

  {
    title: "Setting",
    icon: CiSettings,
    className: "sidebar-icon",
    route: "/dashboard/setting",
  },
];

export { sidebarItems };
