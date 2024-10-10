"use client";
import { deleteGameCategory } from "@/services/gameCategoryServices";
import { httpRequestStatus } from "@/utils/constants";
import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";
import { getTableContentForGameCategory } from "@/utils/helper";
import { useEffect, useState } from "react";
import style from "@/styles/table.module.css";
import CustomePagination from "@/utils/widgets/CustomePagination";

export default function GameCategoryTable({
  response,
  fetchStatus,
  refetch,
}: {
  response: CreateGameCategoryResponseDto[] | undefined;
  fetchStatus: httpRequestStatus;
  refetch: () => void;
}) {
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [isChecked, setIsChecked] = useState<Record<number, boolean>>({});

  const onDelete = async (id: string) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [id]: true }));
      const response = await deleteGameCategory({ id });
      if (response.status === 200) {
        refetch();
      }
    } catch (error: any) {
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };
  useEffect(() => {
    if (response) {
      response.reduce((acc: Record<string, boolean>, item) => {
        acc[item.id] = false;
        return acc;
      }, {});
    }
  }, [response]);

  return (
    <div className={style.table__container__highlight}>
      <div className=" flex justify-between">
        <h2>Game categories</h2>
        <button
          type="button"
          className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
        >
          Delete
        </button>
        {/* {Object.values(isChecked).some((item) => item === true) && (
        
        )} */}
      </div>
      <div className={`${style.table__container__fullheight} `}>
        <table className={style.table}>
          <thead>
            <tr className="text-white bg-purple rounded-xl text-center">
              <th className="p-3">
                <input type="checkbox" />
              </th>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Winning Prize</th>
              <th className="p-3">2nd Place Prize</th>
              <th className="p-3">3rd Place Prize</th>
              <th className="p-3">Ticket Price</th>
              <th className="p-3">Total Tickets</th>
              <th className="p-3 w-10"></th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="">
            {getTableContentForGameCategory({
              response,
              onDelete,
              deleteLoading,
              fetchStatus,
            })}
          </tbody>
        </table>
      </div>
      <div className=" mt-8">
        <CustomePagination pageCount={5} handlePageClick={() => {}} />
      </div>
    </div>
  );
}
