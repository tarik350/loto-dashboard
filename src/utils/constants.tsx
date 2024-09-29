import { CiSettings } from "react-icons/ci";
import { GrHome } from "react-icons/gr";
import { sidebarItemType } from "./types";
import { BiGame, BiHome } from "react-icons/bi";

export type imageType = "profilePics" | "idcard";
const sidebarItems: sidebarItemType[] = [
  {
    title: "Dashboard",
    icon: BiHome,
    className: "sidebar-icon",
    route: "/dashboard",
  },
  {
    title: "Games",
    icon: BiGame,
    className: "sidebar-icon",
    route: "/dashboard/games",
  },

  {
    title: "Setting",
    icon: CiSettings,
    className: "sidebar-icon",
    route: "/dashboard/setting",
  },
];

export { sidebarItems };
