import { Oval } from "react-loader-spinner";

export default function LoadingSpiner({
  dimension,
  forgroundColor,
  backgroundColor,
}: {
  dimension: number;
  forgroundColor?: string;
  backgroundColor?: string;
}) {
  return (
    <div className=" flex justify-center items-center">
      <Oval
        height={dimension}
        width={dimension}
        color={forgroundColor ?? "#9a0ae4"}
        secondaryColor={backgroundColor ?? "#8A2BE2"}
        strokeWidth={10}
        ariaLabel="loading"
      />
    </div>
  );
}
