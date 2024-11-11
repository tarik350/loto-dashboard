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
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

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
    title: "Withdrawal",
    icon: CiMoneyBill,
    className: "sidebar-icon",
    route: "/dashboard/withdrawal",
  },
  {
    title: "Financial Report",
    icon: BiSolidBank,
    className: "sidebar-icon",
    route: "/dashboard/financialreport",
  },
  {
    title: "Users",
    icon: FaUser,
    className: "sidebar-icon",
    route: "/dashboard/users",
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
        route: "/dashboard/admin/users",
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

//TYPESENSE SCHEMAS

const gameCategorySchema: CollectionCreateSchema = {
  name: "gamecategories",
  fields: [
    { name: "id", type: "string" },
    { name: "categoryId", type: "string" },
    { name: "title_en", type: "string" },
    { name: "title_am", type: "string" },
    { name: "duration", type: "string" },
    { name: "winningPrize", type: "int32" },
    { name: "secondPlacePrize", type: "int32" },
    { name: "thirdPlacePrize", type: "int32" },
    { name: "ticketPrice", type: "int32" },
    { name: "numberOfTicket", type: "int32" },
    //   { name: "createdAt", type: "string" },
    //   { name: "updatedAt", type: "string" },
  ],
  default_sorting_field: "winningPrize",
};

const userSchema: CollectionCreateSchema = {
  name: "users",
  fields: [
    { name: "uid", type: "string" },
    { name: "email", type: "string" },
    { name: "emailVerified", type: "bool" },
    { name: "displayName", type: "string" },
    { name: "disabled", type: "bool" },
    { name: "lastSignInTime", type: "string" },
    { name: "creationTime", type: "int32" },
    { name: "lastRefreshTime", type: "string" },
    { name: "tokensValidAfterTime", type: "string" },
    { name: "provider_uid", type: "string" },
    { name: "provider_displayName", type: "string" },
    { name: "provider_email", type: "string" },
    { name: "provider_providerId", type: "string" },
  ],
  // default_sorting_field: "creationTime",
};

export type httpRequestStatus = "initial" | "loading" | "success" | "error";
export type ticketNumberStatus = "sold" | "locked" | "free";
export type gameStatus = "on-going" | "all-tickets-sold" | "finished";
export type gameTicketStatus = "free" | "locked" | "sold";
export const gameStatusTitle: Record<string, gameStatus> = {
  "On going": "on-going",
  Finished: "finished",
  "All tickets sold": "all-tickets-sold",
};
export const gameTicketStatusTitle: Record<string, gameTicketStatus> = {
  Locked: "locked",
  Free: "free",
  Sold: "sold",
};
export type GenericQueryByType = "Name" | "ID";
export const genericQueryByConst: GenericQueryByType[] = ["Name", "ID"];

const authPages = ["login", "register"];
export { sidebarItems, authPages };
export { userSchema, gameCategorySchema };
