"use client";

import { winningTicketApi } from "@/store/apis/winningTicketApi";
import Skeleton from "react-loading-skeleton";
import style from "@/styles/table.module.css";
import CustomePagination from "@/utils/widgets/CustomePagination";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import { FaSort } from "react-icons/fa";
import GameDetails from "@/utils/widgets/GameDetailCard";
import videoPreviewStyles from "@/styles/modalform.module.css";

export default function CompletedGameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  const { data, isLoading, isFetching, isSuccess, error, isError } =
    winningTicketApi.useGetWinningTicketsForGameQuery({
      gameId: parseInt(params.gameId),
    });
  return (
    <div className="flex flex-col h-screen">
      <div className=" m-8">
        {isLoading && (
          <Skeleton baseColor="#d1d5db" className="w-full h-[15rem]" />
        )}
        {data && <GameDetails game={data.data?.game!} />}
        <div className={style.table__container__highlight}>
          <div className="generic-table__header">
            <h2>Winning Tickets</h2>
          </div>
          {isLoading && (
            <Skeleton
              baseColor="#d1d5db"
              className="w-full h-[12rem] rounded-xl"
            />
          )}
          <div className={style.table__container__fullheight}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th className="sortable">
                    <div className=" flex  items-center gap-2">
                      <p>ID</p>
                      <FaSort className="sort-icon" />
                    </div>
                  </th>
                  <th>
                    <div className=" flex  items-center gap-2">
                      <p>Winner ID</p>
                      <FaSort className="sort-icon" />
                    </div>
                  </th>
                  <th>Winner Name</th>

                  <th>Place</th>
                  <th>winning Prize</th>
                  <th>Winning Ticket Number</th>

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
                  data: data?.data?.tickets!,
                  isLoading: isLoading || isFetching,
                  isError,
                  columns: [
                    {
                      render(record) {
                        return <p>{record.id}</p>;
                      },
                    },
                    {
                      render(record) {
                        return <p>{record.ticket.owner.id}</p>;
                      },
                    },
                    {
                      render(record) {
                        return <p>{record.ticket.owner.full_name}</p>;
                      },
                    },
                    {
                      render(record) {
                        return <p>{record.place}</p>;
                      },
                    },
                    {
                      render(record) {
                        const prizes = {
                          first: data?.data?.game.category.winning_prize,
                          second:
                            data?.data?.game.category.second_winning_prize,
                          third: data?.data?.game.category.third_winning_prize,
                        };

                        // Ensure record.place is one of the expected keys
                        return (
                          <p className=" font-bold">
                            {prizes[record.place as keyof typeof prizes]} BIRR
                          </p>
                        );
                      },
                    },
                    {
                      render(record) {
                        return <p>{record.ticket.ticket_number}</p>;
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
        </div>
        {isLoading && (
          <Skeleton baseColor="#d1d5db" className="h-[12rem] w-1/3" />
        )}
        <div className={`${videoPreviewStyles.videoPreview} `}>
          <video className={videoPreviewStyles.videoElement} controls>
            <source
              key={data?.data?.game.winning_video_url ?? ""}
              src={data?.data?.game.winning_video_url ?? ""}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* This div will stick to the bottom */}
      <div className="flex items-center gap-2 mt-auto m-8">
        <button
          type="button"
          className="bg-green text-black font-bold  rounded-full w-[12rem] h-[3rem]"
        >
          Mark As Audited
        </button>
        <button
          type="button"
          className="bg-primary font-bold text-white rounded-full w-[12rem] h-[3rem]"
        >
          Report
        </button>
      </div>
    </div>
  );
}
