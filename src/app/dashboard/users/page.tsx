"use client";
import CustomePagination from "@/utils/widgets/CustomePagination";
import style from "@/styles/table.module.css";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { useEffect, useReducer, useState } from "react";
import { FaSort } from "react-icons/fa";
import CreateAdminUserModal from "@/utils/modals/CreateAdminUserModal";
import { AnimatePresence } from "framer-motion";
import { adminUserApi } from "@/store/apis/adminUserApis";
import { ActionTypes, initialState, genericReducer } from "../roles/roleStore";
import { AdminUserDto } from "@/utils/dto/adminUserDto";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import { isFloat32Array } from "util/types";
import { recordTraceEvents } from "next/dist/trace";
import { RoleDto } from "@/utils/dto/roleDto";
import { RoleInput } from "./widgets/RoleSearchbleInput";
import { roleApi } from "@/store/apis/roleApi";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<AdminUserDto & { role?: RoleDto }>,
    initialState
  );

  //qeury and mutations
  const [searchAdminUser] = adminUserApi.useSearchAdminUserMutation();
  const [deleteAdminUser, { isLoading: deleteLoading }] =
    adminUserApi.useDeleteAdminUserMutation();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } =
    adminUserApi.useGetAdminUserQuery({ page: currentPage });

  useEffect(() => {
    if (isSuccess && data) {
      const fetchedAdminUsers = data.data?.data || [];
      const lastPage = data.data?.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: fetchedAdminUsers, lastPage },
      });
    }
  }, [isSuccess, data, isFetching]);
  const [showRoles, setShowRoles] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleDto[]>([]);

  const onAdminSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchAdminUser({ query }).unwrap();
      dispatch({
        type: ActionTypes.SET_SEARCH_RESULTS,
        payload: {
          entities: response.data?.data!,
          lastPage: response.data?.last_page,
        },
      });
    } catch (error) {
      debugger;
    }
  };
  const onDelete = async () => {
    const selectedAdmins = Object.keys(isChecked)
      .filter((item) => isChecked[parseInt(item)])
      .map((key) => parseInt(key));
    try {
      await deleteAdminUser({ ids: selectedAdmins }).unwrap();
      dispatch({ type: ActionTypes.DELETE_ENTITY, payload: selectedAdmins });
      //todo show success message
    } catch (error) {
      // todo show error message
      debugger;
    }
  };
  return (
    <div>
      <AnimatePresence>
        {modalOpen && <CreateAdminUserModal setIsOpen={setModalOpen} />}
      </AnimatePresence>
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={setModalOpen}
          buttonTitle={"Create Admin User"}
          searchMethod={onAdminSearch}
          searchLabel={"ID, Email , Name"}
        />
      </div>
      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Admin Users</h2>
          {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              onClick={onDelete}
              className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            >
              {deleteLoading ? <LoadingSpiner dimension={30} /> : "Delete"}
            </button>
          )}
        </div>
        <div className={style.table__container__fullheight}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>
                  <input
                    checked={
                      Object.values(isChecked).length > 0 &&
                      Object.values(isChecked).every((item) => item === true)
                    }
                    onChange={(event) => {
                      dispatch({
                        type: ActionTypes.SET_ALL_CHECKBOXES,
                        payload: event.target.checked,
                      });
                    }}
                    type="checkbox"
                  />
                </th>
                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>ID</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="sortable   ">
                  <div className="flex items-center gap-2">
                    <p>Full Name</p>
                  </div>
                </th>
                <th className="sortable">Email</th>
                <th className="sortable">Role</th>
                <th className="sortable">Email Verified</th>
                <th className="sortable">Suspended</th>

                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Created At</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody({
                data: entities,
                isLoading: isLoading || isFetching,
                isError,
                columns: [
                  {
                    render(record) {
                      return (
                        <input
                          checked={isChecked[record.id]}
                          type="checkbox"
                          onChange={() => {
                            dispatch({
                              type: ActionTypes.TOGGLE_CHECKBOX,
                              payload: record.id,
                            });
                          }}
                        />
                      );
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.id}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.firstname + " " + record.lastname}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.email}</p>;
                    },
                  },
                  {
                    render(record) {
                      return (
                        <div className=" relative">
                          <p>{record.role?.name}</p>
                          {/* <RoleInput
                            onSearch={onSearch}
                            setShowRoles={setShowRoles}
                            selectedRole={record.role!}
                          /> */}
                          {showRoles && (
                            <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
                              {roles.length === 0 && (
                                <div className=" min-h-[5rem]  flex justify-center items-center">
                                  <p className=" m-auto">
                                    No Roles with this name.
                                  </p>
                                </div>
                              )}
                              {roles.length !== 0 && (
                                <ul>
                                  {roles.map((role) => (
                                    <li
                                      key={role.id}
                                      onClick={() => {
                                        // setValue("selectedRole", role);
                                        setShowRoles(false);
                                        // clearErrors("selectedRole");
                                      }}
                                    >
                                      {role.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                      // return <p>{record.role?.name}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{!record.is_email_verified ? "No" : "Yes"}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{!record.is_suspended ? "No" : "Yes"}</p>;
                    },
                  },
                  {
                    render(record) {
                      return (
                        <p>{formatToReadableDateTime(record.created_at)}</p>
                      );
                    },
                  },
                ],
              })}
            </tbody>
          </table>
        </div>
        <div className=" mt-8">
          <CustomePagination
            pageCount={lastPage!}
            handlePageClick={({ selected }: { selected: number }) => {
              dispatch({
                type: ActionTypes.SET_CURRENT_PAGE,
                payload: selected + 1,
              });
              refetch();
            }}
          />
        </div>
      </div>
    </div>
  );
}
