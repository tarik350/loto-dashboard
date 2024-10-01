"use client";
import { deleteGameCategory } from "@/services/gameCategoryServices";
import { httpRequestStatus } from "@/utils/constants";
import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";
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
  const getTableContent = () => {
    if (fetchStatus === "loading") {
      return (
        <tr>
          <td className="p-5 text-center bg-purple-50" colSpan={8}>
            <div className=" flex justify-center items-center">
              <LoadingSpiner dimension={30} />
            </div>
          </td>
        </tr>
      );
    } else if (response && response.length === 0) {
      return (
        <tr>
          <td className="p-5 text-center bg-purple-50" colSpan={8}>
            <p className="font-[600] text-gray-500">No category for now</p>
          </td>
        </tr>
      );
    } else {
      return response?.map((item, index) => (
        <tr key={index} className="text-center">
          <td className="p-3">{item.id}</td>
          {/* max-w-[15rem] */}
          <td className="p-3 flex flex-col justify-start items-start  text-start">
            <span className="block">• {item.title.en}</span>
            <span className="block">• {item.title.am}</span>{" "}
          </td>
          <td className="p-3">{item.winningPrize}</td>
          <td className="p-3">{item.secondPlacePrize}</td>
          <td className="p-3">{item.thirdPlacePrize}</td>
          <td className="p-3">{item.ticketPrice}</td>
          <td className="p-3">{item.numberOfTicket}</td>
          <td className="p-3">
            {/* Add edit button or action */}
            <button className="bg-blue-500 text-white p-1 rounded">Edit</button>
          </td>
          <td className="p-3">
            {/* Add delete button or action */}
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
              }}
              className="bg-red-500 text-white p-1 rounded w-[3.4rem] h-full"
            >
              {deleteLoading[item.id] ? (
                <LoadingSpiner
                  dimension={20}
                  forgroundColor="#9a0ae4"
                  backgroundColor="white"
                />
              ) : (
                "Delete"
              )}
            </button>
          </td>
        </tr>
      ));
    }
  };
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
      <tbody className="">{getTableContent()}</tbody>
    </table>
  );
}
