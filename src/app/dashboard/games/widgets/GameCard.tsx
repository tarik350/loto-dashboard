import { TicketDto } from "@/utils/dto/gameDto";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

export function GameCard({
  id,
  soldTicketCount,
  ticketCount,
  status,
  name,
  className,
  onClick,
}: {
  id: number;
  name: string;
  status: string;
  soldTicketCount: number;
  ticketCount: number;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id">) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`/dashboard/games/${id}`);
      }}
      className={`game-card card ${className}`}
    >
      <p>ID {id}</p>
      <div>
        <p className="text-start">Name</p>
        <p className=" text-start">{name}</p>
      </div>

      <p>{status}</p>
      <p>
        Total sold Ticket{" "}
        <span>
          {soldTicketCount}/{ticketCount}
        </span>
      </p>
    </button>
  );
}

export const TicketCard = ({ ticket }: { ticket: TicketDto }) => {
  return (
    <div
      className={`ticket-card card ${
        ticket.status === "free"
          ? "ticket-free"
          : ticket.status === "sold"
          ? "ticket-sold"
          : "ticket-locked"
      }`}
    >
      <div>
        <p>{ticket.ticket_number}</p>
        <p>{ticket.status}</p>
      </div>
    </div>
  );
};
