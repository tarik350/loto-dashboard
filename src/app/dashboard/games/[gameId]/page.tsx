"use client";

import { gameApi } from "@/store/apis/gameApis";
import { ul } from "framer-motion/client";
import { useEffect } from "react";
import { TicketCard } from "../widgets/GameCard";

export default function GameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  const { data, isLoading, isSuccess } = gameApi.useGetGameQuery({
    gameId: params.gameId,
  });
  useEffect(() => {
    if (isSuccess && data) {
      console.log(data);
    }
  }, [isSuccess, isLoading]);
  return (
    <div className=" bg-black bg-opacity-5 h-screen flex gap-8 p-8 ">
      <div className="flex flex-col   w-[65%] xl:w-[75%] gap-8">
        <div className="flex w-full gap-4">
          <div className="  bg-softLavender border-[1px] border-purple border-opacity-20 min-h-[10rem] flex-grow  rounded-xl"></div>
        </div>
        <div className="">
          <input
            type="text"
            onChange={(event) => {}}
            placeholder={"Search for ticket"}
            className="  search-input"
          />
        </div>

        <ul className=" grid xl:grid-cols-7 lg:grid-cols-4   w-full gap-2    overflow-y-auto ">
          {data?.data?.tickets.map((ticket, index) => {
            return <TicketCard ticket={ticket} />;
          })}
        </ul>
      </div>
      <div className="  bg-softLavender border-[1px] border-purple border-opacity-20 flex-grow rounded-xl"></div>
    </div>
  );
}
