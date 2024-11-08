"use client";

import { gameApi } from "@/store/apis/gameApis";
import { gameTicketStatus, gameTicketStatusTitle } from "@/utils/constants";
import {
  GameAnalyticsDto,
  GameDto,
  GameStatusEnum,
  TicketDto,
} from "@/utils/dto/gameDto";
import { UserDto } from "@/utils/dto/userDto";
import CustomButton from "@/utils/widgets/CustomButton";
import SearchWithDropdown from "@/utils/widgets/SearchWithDropDown";
import { Profile } from "assets/image/imageAsset";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { GenericDropdown } from "../../permissions/widgets/PermissionFilter";
import { queryByConstForUser, QueryByTypeForUser } from "../../users/page";
import { TicketCard } from "../widgets/GameCard";
import { AnimatePresence } from "framer-motion";
import SetWinningNumberModal from "@/utils/modals/SetWinningNumbersModal";

export default function GameDetailPage({
  params,
}: {
  params: { gameId: string };
}) {
  //STATES
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
  const [queryBy, setQueryBy] = useState<QueryByTypeForUser>("Name");
  const [selectedUser, setSelectedUser] = useState<number | undefined>(
    undefined
  );
  const [selectedTicket, setSelectedTicket] = useState<number | undefined>(
    undefined
  );
  const [showWinningNumberModal, setShowWinningNumberModal] =
    useState<boolean>(false);

  //mutations
  const [searchGameTicket] = gameApi.useSearchGameTicketMutation();
  const [getUserTickets] = gameApi.useGetUserTicketsInGameMutation();
  const [getTicketOwner] = gameApi.useGetTicketOwnerInGameMutation();
  const [searchUserInGame] = gameApi.useSearchUserInGameMutation();

  //queries
  const { data, isLoading, isSuccess, isFetching, refetch } =
    gameApi.useGetGameQuery({
      gameId: params.gameId,
    });

  //METHODS
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

  ///EFFECTS
  useEffect(() => {
    if (ticketStatusFilter) {
      onSearch();
    }
  }, [ticketStatusFilter]);

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
      if (selectedUser && userId === selectedUser) {
        refetch();
        setSelectedUser(undefined);
        return;
      }
      const response = await getUserTickets({
        gameId: parseInt(params.gameId),
        userId,
      }).unwrap();
      setSelectedUser(userId);
      setTickets(response.data?.tickets!);
    } catch (error) {}
  };

  const getUser = async (ticketNumber: number) => {
    try {
      if (selectedTicket && selectedTicket === ticketNumber) {
        setSelectedTicket(undefined);
        refetch();
        return;
      }
      const response = await getTicketOwner({
        gameId: parseInt(params.gameId),
        ticketNumber: ticketNumber,
      }).unwrap();
      setSelectedTicket(ticketNumber);
      setUsers(response.data!);
    } catch (error) {}
  };

  return (
    <main className="h-screen flex flex-col bg-gray-100 p-8">
      <AnimatePresence>
        {showWinningNumberModal && data?.data?.game && (
          <SetWinningNumberModal
            setIsOpen={setShowWinningNumberModal}
            game={{
              ...data.data.game,
              category: data.data.game.category,
            }}
            isOpen={showWinningNumberModal}
          />
        )}
      </AnimatePresence>
      <div className="flex h-full gap-4">
        <div className="flex flex-col overflow-y-auto w-2/3 xl:w-3/4 gap-4">
          <CustomButton
            label="Set Winners"
            icon={<FaPlusCircle />}
            onClick={() => {
              setShowWinningNumberModal(!showWinningNumberModal);
            }}
            bgColor="bg-purple"
            disabled={
              data?.data?.game.status !== GameStatusEnum.ALL_TICKETS_SOLD
            }
          />
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="text-xl font-semibold text-gray-700">
              Game ID:{" "}
              <span className="font-bold text-indigo-600">
                {data?.data?.game.id}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Game Name:</span>
                <span className="font-bold text-gray-900">
                  {data?.data?.game.name}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Game Category:</span>
                <span className="font-bold text-gray-900">
                  {data?.data?.game.category.title_en} (
                  <span className="italic text-gray-600">
                    {data?.data?.game.category.title_am}
                  </span>
                  )
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Game Total Ticket:</span>
                <span className="font-bold text-gray-900">
                  {data?.data?.game.category.ticket_count}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Game Status:</span>
                <span className="font-bold text-gray-900 uppercase">
                  {data?.data?.game.status.split("-").join(" ")}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Locked Tickets:</span>
                <span className="font-bold text-gray-900">
                  {analytics?.tickets_locked}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Sold Tickets:</span>
                <span className="font-bold text-gray-900">
                  {analytics?.tickets_sold}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Remaining Ticket:</span>
                <span className="font-bold text-gray-900">
                  {analytics?.total_tickets! - analytics?.tickets_sold!}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Users Who Bought Tickets:</span>
                <span className="font-bold text-gray-900">
                  {analytics?.unique_users}
                </span>
              </div>
            </div>
          </div>
          <div className=" flex justify-between">
            <div className="flex items-center gap-4 mt-4">
              <GenericDropdown<string>
                listItem={Object.keys(gameTicketStatusTitle)}
                selectedOption={ticketStatusFilter}
                title="Ticket Status"
                callback={(value: string) => {
                  const ticketStatus = gameTicketStatusTitle[value];
                  setTicketStatusFilter(ticketStatus);
                }}
              />
              <button
                onClick={() => {
                  setTicketStatusFilter(undefined);
                  setSelectedTicket(undefined);
                  setSelectedUser(undefined);
                  refetch();
                }}
                className="border border-purple rounded-lg px-4 py-2"
              >
                Clear Filter
              </button>
            </div>
            <input
              type="text"
              placeholder="Search for ticket"
              onChange={(event) => onSearch(event.target.value)}
              className="mt-4 p-2 border border-gray-300 rounded-lg "
            />
          </div>
          {tickets.length === 0 ? (
            <div className="flex items-center justify-center text-purple-600 text-lg mt-4">
              <p>No tickets found</p>
            </div>
          ) : (
            <ul className="grid xl:grid-cols-7 lg:grid-cols-4 gap-4 mt-4">
              {tickets.map((ticket, index) => (
                <TicketCard
                  className={`${
                    selectedTicket === ticket.ticket_number &&
                    "bg-purple text-white"
                  } transition-all ease-in-out duration-150`}
                  key={index}
                  ticket={ticket}
                  onClick={() => getUser(ticket.ticket_number)}
                />
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-md flex flex-col p-4 w-1/3 xl:w-1/4">
          <SearchWithDropdown
            onSearch={onUserSearch}
            queryBy={queryBy}
            setQueryBy={(value: QueryByTypeForUser) => setQueryBy(value)}
            dropdownList={queryByConstForUser}
          />
          <ul className="mt-4">
            {users.length === 0 && (
              <p className=" text-center">No user found.</p>
            )}
            {users?.map((user) => (
              <button
                type="button"
                onClick={() => {
                  getTickets(user.id);
                }}
                key={user.id}
                className={`flex items-center w-full gap-2 border-2 border-gray-300 my-1 rounded-xl px-2 py-1  cursor-pointer ${
                  selectedUser === user.id && " bg-purple  text-white "
                } transition-all ease-in-out duration-150`}
              >
                <img
                  src={user.profile_picture ?? Profile.src}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className=" flex flex-col justify-start items-start ">
                  <span>{user.full_name}</span>
                  <span className=" font-bol">{user.phone}</span>
                </div>
              </button>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
