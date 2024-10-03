"use client";
import CustomePagination from "@/utils/widgets/CustomePagination";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userIds, setUserIds] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState<Record<number, boolean>>({});
  const items = [1, 2, 3, 4];
  useEffect(() => {
    resetAllCheckbox();
  }, []);
  const resetAllCheckbox = () => {
    setIsChecked(
      items.reduce<Record<number, boolean>>((prev, current) => {
        prev[current] = false;
        return prev;
      }, {})
    );
  };
  const setAllcheckbox = () => {
    setIsChecked(
      items.reduce<Record<number, boolean>>((prev, current) => {
        prev[current] = true;
        return prev;
      }, {})
    );
  };
  return (
    <div>
      {/* <DashboardNavbar
        title={"Dashbaord / users"}
        Icon={<FaUser size={18} className=" fill-purple" />}
      /> */}
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={setModalOpen}
          filterStrings={["username", "email"]}
          buttonTitle={"Create User"}
        />
      </div>
      <div className="generic-table__container">
        <div className="generic-table__header">
          <h2>Admin Users</h2>
          {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            >
              Delete
            </button>
          )}
        </div>
        <table className="generic-table">
          <thead>
            <tr>
              <th>
                <input
                  checked={Object.values(isChecked).every(
                    (item) => item === true
                  )}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setAllcheckbox();
                    } else {
                      resetAllCheckbox();
                    }
                  }}
                  type="checkbox"
                />
              </th>
              <th className="sortable">
                <div className=" flex  items-center gap-2">
                  <p>username</p>
                  <FaSort className="sort-icon" />
                </div>
              </th>
              <th className="sortable">Return</th>
              <th className="sortable   ">
                <div className="flex items-center gap-2">
                  <p>Full Name</p>
                </div>
              </th>

              <th className="sortable">
                <div className=" flex  items-center gap-2">
                  <p>Rating</p>
                  <FaSort className="sort-icon" />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input
                      checked={isChecked[item]}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setUserIds((prev) => [...prev, item]);
                          setIsChecked((prev) => ({ ...prev, [item]: true }));
                        } else {
                          setUserIds((prev) => {
                            const newval = prev.filter((val) => val !== item);
                            return newval;
                          });
                          setIsChecked((prev) => ({ ...prev, [item]: false }));
                        }
                      }}
                      type="checkbox"
                    />
                  </td>
                  <td>Placeholder</td>
                  <td>Placeholder</td>
                  <td>Placeholder</td>
                  <td>Placeholder</td>
                  <td className=" w-[1rem]">
                    <div className=" flex justify-between gap-2">
                      <button className=" border-2 border-red-500 px-2  rounded-xl hover:bg-red-500 hover:text-white ">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className=" mt-8">
          <CustomePagination pageCount={5} handlePageClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
