"use client";
import CreatePermissionModal from "@/utils/modals/CreatePermissionModal";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { AnimatePresence } from "framer-motion";
import { useReducer, useState } from "react";
import PermissionTable from "./widgets/PermissionTable";
import {
  PermissionActionType,
  permissionReducer,
  PermissionTableActionTypes,
} from "./widgets/permissionTableStore";
import { permissionApi } from "@/store/permissionApi";
import { handleErrorResponse } from "@/utils/helper";
export default function PermissionsPage() {
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
      <div className=" mb-8">
        <GenericFilterNavbar
          dispatch={dispatch}
          setModalOpen={setModalOpen}
          filterStrings={["username", "email"]}
          buttonTitle={"Create Permissions"}
          searchMethod={searchPermission}
          state={state}
        />
      </div>
      <PermissionTable state={state} dispatch={dispatch} />
    </div>
  );
}
