import { BiRightArrow } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";

export function GameLoadingShimmer() {
  return (
    <div className="mx-8 mb-8">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <div className="flex justify-between items-center">
            <Skeleton className="w-[12rem] h-[3rem]" />
            <button
              type="button"
              className="flex gap-2 items-center justify-center text-white bg-purple px-4 py-1 rounded-3xl"
            >
              <p className="font-[600]">more</p>
              <BiRightArrow strokeWidth={2} size={12} />
            </button>
          </div>
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <Skeleton
                key={item}
                containerClassName="w-full h-[20rem]"
                inline={true}
                className="w-full h-[20rem] my-4 mr-4 border-2"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
