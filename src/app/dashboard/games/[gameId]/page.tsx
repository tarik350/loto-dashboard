"use client";

import { gameApi } from "@/store/apis/gameApis";
import { gameTicketStatus, gameTicketStatusTitle } from "@/utils/constants";
import { GameAnalyticsDto, GameDto, TicketDto } from "@/utils/dto/gameDto";
import { UserDto } from "@/utils/dto/userDto";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { GenericDropdown } from "../../permissions/widgets/PermissionFilter";
import { TicketCard } from "../widgets/GameCard";
import Games from "../page";
import { userApi } from "@/store/apis/userApi";
import { queryByConstForUser, queryByTypeForUser } from "../../users/page";
import { BiFilter } from "react-icons/bi";

export default function GameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  const [ticketStatusFilter, setTicketStatusFilter] = useState<
    gameTicketStatus | undefined
  >(undefined);
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [users, setUsers] = useState<
    Pick<UserDto, "phone" | "full_name" | "id" | "profile_picture">[]
  >([]);
  const [analytics, setAnalytics] = useState<GameAnalyticsDto | undefined>(
    undefined
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [queryBy, setQueryBy] = useState<queryByTypeForUser>("Name");

  const [searchGameTicket] = gameApi.useSearchGameTicketMutation();
  const [getUserTickets] = gameApi.useGetUserTicketsInGameMutation();
  const [getTicketOwner] = gameApi.useGetTicketOwnerInGameMutation();
  const [searchUserInGame] = gameApi.useSearchUserInGameMutation();
  const { data, isLoading, isSuccess, isFetching, refetch } =
    gameApi.useGetGameQuery({
      gameId: params.gameId,
    });
  useEffect(() => {
    if (isSuccess && data) {
      const tickets = data.data?.game.tickets || [];
      const users = data.data?.users;
      const analytics = data.data?.analytic;

      setTickets(tickets);
      setUsers(users!);
      setAnalytics(analytics);
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
        gameId: data?.data?.game.id!,
        ticketStatus: ticketStatusFilter,
      }).unwrap();
      setTickets(response.data!);
    } catch (error) {
      // todo show error message
    }
  };
  const onUserSearch = async (query?: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchUserInGame({
        query,
        query_by:
          queryBy === "Name"
            ? "full_name"
            : queryBy === "ID"
            ? "searchable_id"
            : "phone",
        gameId: parseInt(params.gameId),
      }).unwrap();
      setUsers(response.data!);
    } catch (error) {}
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
      ({
        ticket,
        user,
        game,
      }: {
        ticket: TicketDto;
        user: UserDto;
        game: GameDto;
      }) => {
        console.log("WebSocket handshake successful");
        console.log(game);
        if (parseInt(params.gameId) === game.id) {
          refetch();
        }
        // alert(`${user.full_name} has bought ticket ${ticket.ticket_number}`);
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

  const getTickets = async (userId: number) => {
    try {
      const response = await getUserTickets({
        gameId: parseInt(params.gameId),
        userId,
      }).unwrap();
      setTickets(response.data?.tickets!);
      // debugger;
    } catch (error) {
      // debugger;
    }
  };

  const getUser = async (ticketNumber: number) => {
    try {
      const response = await getTicketOwner({
        gameId: parseInt(params.gameId),
        ticketNumber: ticketNumber,
      }).unwrap();
      setUsers(response.data!);
      // debugger;
    } catch (error) {
      //if 404 ticket has no woner
      // debugger;
    }
  };
  return (
    <div className=" bg-black bg-opacity-5 h-screen flex gap-8 p-8 ">
      <div className="flex flex-col   w-[65%] xl:w-[75%] gap-8">
        <div className="flex w-full gap-4">
          <div className="  game-detail">
            <p>
              Game ID <span>{data?.data?.game.id}</span>
            </p>
            <div>
              <p>
                Game Name: <span>{data?.data?.game.name}</span>
              </p>

              <p>
                Game Category:{" "}
                <span className="">
                  {data?.data?.game.category.title_en}(
                  {data?.data?.game.category.title_am})
                </span>
              </p>
              <p>
                Game Total Ticket:{" "}
                <span>{data?.data?.game.category.ticket_count}</span>
              </p>
            </div>
            <div>
              <p>
                Total Locked Tickets: <span>{analytics?.tickets_locked}</span>
              </p>
              <p>
                Total Sold Tickets: <span>{analytics?.tickets_sold}</span>
              </p>
              <p>
                Total Remaining Ticket:{" "}
                <span>
                  {analytics?.total_tickets! - analytics?.tickets_sold!}
                </span>
              </p>
              <p>
                Total users who bought the ticket:{" "}
                <span>{analytics?.unique_users}</span>
              </p>
            </div>
          </div>
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
        {tickets.length === 0 && (
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
          {tickets.length !== 0 &&
            tickets.map((ticket, index) => {
              return (
                <TicketCard
                  ticket={ticket}
                  onClick={() => {
                    getUser(ticket.ticket_number);
                  }}
                />
              );
            })}
        </ul>
      </div>
      <div className="  bg-softLavender border-[1px] border-purple border-opacity-20 flex-grow rounded-xl">
        <div className=" flex justify-center w-full ">
          <input
            type="text"
            className=" border-2 border-purple  w-full rounded-l-xl  px-4 outline-none "
            onChange={(event) => {
              onUserSearch(event.target.value);
            }}
            placeholder="Search User"
          />
          <div className=" relative">
            <button
              type="button"
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
              className="h-[3rem] bg-purple rounded-r-xl  px-2 text-white flex gap-2  justify-center items-center"
            >
              <p>{queryBy}</p>
              <BiFilter />
            </button>
            {showDropdown && (
              <ul className=" absolute z-50 min-w-max bg-purple text-white font-[600] w-full mt-2 border-2  border-softLavender">
                {queryByConstForUser.map((value, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setQueryBy(value);
                        setShowDropdown(false);
                      }}
                      className={`${
                        index !== queryByConstForUser.length - 1 &&
                        "border-b-[1px] border-white"
                      } py-[.5rem] px-2 cursor-pointer  hover:bg-white  hover:text-purple transition-all ease-in-out duration-150  `}
                    >
                      {value}{" "}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <ul className=" h-full w-full overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center p-2">
          {/* <input
            type="text"
            onChange={(event) => {
              onUserSearch(event.target.value);
            }}
            placeholder={"Search for user"}
            className="  search-input mb-4"
          /> */}
          {users &&
            users.map((user, index) => (
              <li
                onClick={() => {
                  getTickets(user.id);
                }}
                key={index}
                className=" bg-gray-400 rounded-xl w-full mx-4 p-4  cursor-pointer mb-2"
              >
                <p className=" text-black fongn-bold">{user.full_name}</p>
                <p>{user.phone}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
