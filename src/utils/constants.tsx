import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { GrHome } from "react-icons/gr";
import { sidebarItemType } from "./types";
import {
  BiArchiveOut,
  BiCategory,
  BiGame,
  BiHome,
  BiLock,
  BiMessageSquareEdit,
  BiMobileVibration,
  BiMoney,
  BiMoneyWithdraw,
  BiPaperclip,
  BiPaperPlane,
  BiSolidBank,
  BiSolidMobile,
} from "react-icons/bi";
import { MdOutlineMoney, MdVerifiedUser } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { LuServer } from "react-icons/lu";
import { SiSecurityscorecard } from "react-icons/si";

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
    title: "Admin users",
    icon: BiLock,
    className: "sidebar-icon",
    route: "/dashboard/adminusers",
    subRoute: [
      {
        title: "Users",
        icon: FaUser,
        route: "/dashboard/users",
      },
      {
        title: "Roles",
        route: "/dashboard/roles",
        icon: SiSecurityscorecard,
      },
      {
        title: "Permissions",
        route: "/dashboard/permissions",
        icon: MdVerifiedUser,
      },
    ],
  },
  {
    title: "Setting",
    icon: CiSettings,
    className: "sidebar-icon",
    route: "/dashboard/setting",
  },
];

export type httpRequestStatus = "initial" | "loading" | "success" | "error";
export type ticketNumberStatus = "sold" | "locked" | "free";
export type gameStatus = "started" | "completed";
const authPages = ["login", "register"];
export { sidebarItems, authPages };
