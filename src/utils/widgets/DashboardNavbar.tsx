import { SvgProps } from "../types";

export default function DashboardNavbar({
  title,
  Icon,
}: {
  title: string;
  Icon: React.ReactElement;
}) {
  return (
    <div className="flex gap-2 items-center  mb-4    ">
      {Icon}
      <p className=" font-[600] text-purple">{title}</p>
    </div>
  );
}
