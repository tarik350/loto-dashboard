"use client";
import { deleteGameCategory } from "@/services/gameCategoryServices";
import { httpRequestStatus } from "@/utils/constants";
import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";
import { getTableContentForGameCategory } from "@/utils/helper";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";

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
  const onDelete = async (id: string) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [id]: true }));
      const response = await deleteGameCategory({ id });
      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      debugger;
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
    <table className="min-w-full table-auto border-collapse border-spacing-0 mt-6 category-table">
      <thead>
        <tr className="text-white bg-purple rounded-xl text-center">
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
  );
}
