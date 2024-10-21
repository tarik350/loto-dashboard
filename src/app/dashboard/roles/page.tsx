"use client";
import { roleApi } from "@/store/apis/roleApi";
import style from "@/styles/table.module.css";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import useCheckboxState from "@/utils/hooks/useCheckboxState";
import CustomePagination from "@/utils/widgets/CustomePagination";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
export default function RolesPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isError, isLoading, isFetching, isSuccess, refetch } =
    roleApi.useGetAllRolesQuery({
      page: currentPage,
    });
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const { isChecked, setAllCheckboxes, toggleCheckbox } =
    useCheckboxState(roleIds);
  const [deleteRole] = roleApi.useDeleteRoleMutation();

  useEffect(() => {
    if (isSuccess && data) {
      setRoleIds(data.data?.data.map((item) => item.id)!);
    }
  }, [isSuccess]);

  const router = useRouter();

  const onDelete = async () => {
    const roles = Object.keys(isChecked)
      .filter((item) => isChecked[parseInt(item)])
      .map((key) => parseInt(key));
    try {
      const response = await deleteRole({ roles }).unwrap();
      debugger;
    } catch (error) {
      debugger;
    }
  };
  return (
    <div>
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={() => {
            router.push("/dashboard/roles/create-role");
          }}
          buttonTitle={"Create Role"}
          searchMethod={() => {}}
          searchLabel={"Type role name"}
        />
      </div>

      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Roles</h2>
          {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              onClick={onDelete}
              className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            >
              Delete
            </button>
          )}
        </div>
        <div className={style.table__container__fullheight}>
          <table className={style.table}>
            <thead>
              <tr>
                <th>
                  <input
                    checked={Object.values(isChecked).every(
                      (item) => item === true
                    )}
                    onChange={(event) => {
                      setAllCheckboxes(event.target.checked);
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
                    <p>Role Name</p>
                  </div>
                </th>

                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Created At</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {renderTableBody({
                data: data?.data?.data!,
                isLoading: isLoading || isFetching,
                isError,
                columns: [
                  {
                    render(record) {
                      return (
                        <input
                          checked={isChecked[record.id]}
                          type="checkbox"
                          onChange={(event) => {
                            toggleCheckbox(record.id);
                          }}
                        />
                      );
                    },
                  },
                  {
                    render(record) {
                      return <div>{record.id}</div>;
                    },
                  },
                  {
                    render(record) {
                      return <div>{record.name}</div>;
                    },
                  },
                  {
                    render(record) {
                      return (
                        <div>{formatToReadableDateTime(record.updated_at)}</div>
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
            pageCount={data?.data?.last_page!}
            handlePageClick={({ selected }: { selected: number }) => {
              setCurrentPage(selected + 1);
              refetch();
            }}
          />
        </div>
      </div>
    </div>
  );
}
