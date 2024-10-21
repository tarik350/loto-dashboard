"use client";
import CreatePermissionModal from "@/utils/modals/CreatePermissionModal";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useReducer, useState } from "react";
import PermissionTable from "./widgets/PermissionTable";
import {
  PermissionActionType,
  permissionReducer,
  PermissionTableActionTypes,
} from "./widgets/permissionTableStore";
import { permissionApi } from "@/store/permissionApi";
import { handleErrorResponse } from "@/utils/helper";
import PermissionFilter from "./widgets/PermissionFilter";
import { BiFilter } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
export default function PermissionsPage() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFitlerVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string | undefined>(
    undefined
  );

  const fitlerButtonController = useAnimation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [state, dispatch] = useReducer(permissionReducer, {
    currentPage: 1,
    isChecked: {},
    isSearch: false,
    permissions: {
      permissions: [],
      pages: undefined,
    },
    bulkDeleteLoading: {
      value: "initial",
    },
    deleteLoading: {},
    filterCategoryId: undefined,
  });
  const [search] = permissionApi.useSearchPermissionsMutation();
  const searchPermission = async (query: string) => {
    try {
      if (!query) {
        dispatch({
          type: PermissionTableActionTypes.SET_IS_SEARCH,
          payload: false,
        });
      }
      const response = await search({ query }).unwrap();
      dispatch({
        type: PermissionTableActionTypes.ADD_PERMISSIONS,
        payload: {
          permissions: response.data?.data!,
          pages: response.data?.last_page!,
        },
      });
      dispatch({
        type: PermissionTableActionTypes.SET_IS_SEARCH,
        payload: true,
      });
    } catch (error: any) {
      const message = handleErrorResponse(error);
    }
  };
  return (
    <div>
      <AnimatePresence>
        {modalOpen && <CreatePermissionModal setIsOpen={setModalOpen} />}
      </AnimatePresence>
      <GenericFilterNavbar
        buttonTitle={"Create Permissions"}
        searchMethod={searchPermission}
        setModalOpen={setModalOpen}
        searchLabel={"Type Permission name"}
      />
      <motion.button
        animate={fitlerButtonController}
        onClick={() => {
          if (isFitlerVisible) {
            setIsFilterVisible(false);
          } else {
            setIsFilterVisible(true);
          }
        }}
        type="button"
        className="flex items-center gap-2 mt-4"
      >
        <BiFilter className=" text-purple" />
        <p className="  font-[600] text-purple">Filter by</p>
        <IoIosArrowDown
          className={`${
            !isFitlerVisible ? "" : " rotate-180"
          } transition-all ease-in-out duration-150 text-purple `}
        />
      </motion.button>
      {isFitlerVisible && (
        <PermissionFilter
          dispatch={dispatch}
          categoryId={state.filterCategoryId}
        />
      )}
      <PermissionTable state={state} dispatch={dispatch} />
    </div>
  );
}
