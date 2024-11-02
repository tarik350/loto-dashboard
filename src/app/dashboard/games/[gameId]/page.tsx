"use client";

import { gameApi } from "@/store/apis/gameApis";
import { gameTicketStatus, gameTicketStatusTitle } from "@/utils/constants";
import { TicketDto } from "@/utils/dto/gameDto";
import { useEffect, useReducer, useState } from "react";
import { GenericDropdown } from "../../permissions/widgets/PermissionFilter";
import Echo from "laravel-echo";
import Pusher, { Options } from "pusher-js";
import {
  ActionTypes,
  genericReducer,
  initialState,
} from "../../roles/roleStore";
import { TicketCard } from "../widgets/GameCard";

interface UserDto {
  id: number;
  full_name: string;
  phone: string;
  profile_picture: null;
  phone_verified: number;
  created_at: string;
  updated_at: string;
  balance: number;
}
// interface TicketDto {
//   id: number;
//   game_id: number;
//   ticket_number: number;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   user_id: number;
//   lock_expires_at: string;
//   sold_at: null;
// }

export default function GameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  const [ticketStatusFilter, setTicketStatusFilter] = useState<
    gameTicketStatus | undefined
  >(undefined);
  const [{ currentPage, lastPage, entities }, dispatch] = useReducer(
    genericReducer<TicketDto>,
    initialState
  );
  const [searchGameTicket] = gameApi.useSearchGameTicketMutation();
  const { data, isLoading, isSuccess, isFetching, refetch } =
    gameApi.useGetGameQuery({
      gameId: params.gameId,
    });
  useEffect(() => {
    if (isSuccess && data) {
      const tickets = data.data?.tickets || [];
      //   const lastPage = data.data?.l;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: tickets },
      });
    }
  }, [isSuccess, data, isFetching]);
  const onSearch = async (query?: string) => {
    try {
      if (!query && !ticketStatusFilter) {
        refetch();
        return;
      }

      const response = await searchGameTicket({
        query,
        gameId: data?.data?.id!,
        ticketStatus: ticketStatusFilter,
      }).unwrap();
      dispatch({
        type: ActionTypes.SET_SEARCH_RESULTS,
        payload: {
          entities: response.data!,
        },
      });
    } catch (error) {
      // todo show error message
    }
  };
  useEffect(() => {
    if (ticketStatusFilter) {
      onSearch();
    }
  }, [ticketStatusFilter]);

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      client: new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`, {
        cluster: "NaN",
        wsPath: process.env.NEXT_PUBLIC_PUSHER_APP_PATH,
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST,
        wssPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT!) ?? 443,
        wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT!) ?? 80,
        forceTLS:
          (process.env.NEXT_PUBLIC_PUSHER_SCHEME ?? "https") === "https",
        enableStats: false,
        enabledTransports: ["ws", "wss"],
      }),
    });

    const channel = echo.channel("ticket-lock");
    const soldChannel = echo.channel("ticket-sold");

    channel.listen(
      ".ticket.locked",
      ({ ticket, user }: { ticket: TicketDto; user: UserDto }) => {
        console.log("WebSocket handshake successful");
        // alert(`${user.full_name} has bought ticket ${ticket.ticket_number}`);
        refetch();
      }
    );

    soldChannel
      .subscribed(() => {
        console.log("subscribed to locked channel");
      })
      .listen(
        ".ticket.sold",
        ({ tickets, user }: { tickets: TicketDto[]; user: UserDto }) => {
          refetch();
        }
      );
    return () => {
      echo.disconnect();
    };
  }, []);

  return (
    <div className=" bg-black bg-opacity-5 h-screen flex gap-8 p-8 ">
      <div className="flex flex-col   w-[65%] xl:w-[75%] gap-8">
        <div className="flex w-full gap-4">
          <div className="  bg-softLavender border-[1px] border-purple border-opacity-20 min-h-[10rem] flex-grow  rounded-xl"></div>
        </div>
        <div className="flex justify-between items-end">
          <div className=" flex gap-2">
            <GenericDropdown<string>
              listItem={Object.keys(gameTicketStatusTitle)}
              selectedOption={ticketStatusFilter}
              title={"Ticket Status"}
              callback={(value: string) => {
                const ticketStatus = gameTicketStatusTitle[value];
                setTicketStatusFilter(ticketStatus);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setTicketStatusFilter(undefined);
                refetch();
              }}
              className=" border-2  border-purple  rounded-xl px-2 py-1 min-w-max flex justify-between items-center gap-4"
            >
              Clear Filter
            </button>
          </div>
          <input
            type="text"
            onChange={(event) => {
              onSearch(event.target.value);
            }}
            placeholder={"Search for ticket"}
            className="  search-input"
          />
        </div>
        {entities.length === 0 && (
          <div className=" flex-grow  flex justify-center items-center bg-softLavender rounded-2xl  ">
            <p className=" m-auto text-purple text-center ">
              <p className="font-light">No tickets found</p>
              {ticketStatusFilter && (
                <p className=" block  font-bold ">
                  {" with status "}
                  <span className="your-custom-class ">
                    {ticketStatusFilter}
                  </span>
                </p>
              )}
            </p>
          </div>
        )}

        <ul className=" grid xl:grid-cols-7 lg:grid-cols-4   w-full gap-2    overflow-y-auto ">
          {entities.length !== 0 &&
            entities.map((ticket, index) => {
              return <TicketCard ticket={ticket} />;
            })}
        </ul>
      </div>
      <div className="  bg-softLavender border-[1px] border-purple border-opacity-20 flex-grow rounded-xl"></div>
    </div>
  );
}
