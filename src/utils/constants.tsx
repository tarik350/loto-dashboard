import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { GrHome } from "react-icons/gr";
import { sidebarItemType } from "./types";
import {
  BiCategory,
  BiGame,
  BiHome,
  BiMessageSquareEdit,
  BiMobileVibration,
  BiMoney,
  BiMoneyWithdraw,
  BiPaperclip,
  BiPaperPlane,
  BiSolidBank,
  BiSolidMobile,
} from "react-icons/bi";
import { MdOutlineMoney } from "react-icons/md";

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
    title: "Game Category",
    icon: BiCategory,
    className: "sidebar-icon",
    route: "/dashboard/gamecategory",
  },

  {
    title: "Audit",
    icon: BiMessageSquareEdit,
    className: "sidebar-icon",
    route: "/dashboard/audit",
  },
  {
    title: "Activity Log",
    icon: BiPaperPlane,
    className: "sidebar-icon",
    route: "/dashboard/activitylog",
  },
  {
    title: "Deposit",
    icon: CiMoneyBill,
    className: "sidebar-icon",
    route: "/dashboard/deposit",
  },

  {
    title: "Financial Report",
    icon: BiSolidBank,
    className: "sidebar-icon",
    route: "/dashboard/financialreport",
  },
  {
    title: "Setting",
    icon: CiSettings,
    className: "sidebar-icon",
    route: "/dashboard/setting",
  },
];

export { sidebarItems };
