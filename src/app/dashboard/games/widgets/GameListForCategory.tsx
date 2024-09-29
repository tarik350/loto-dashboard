import { BiRightArrow } from "react-icons/bi";

export default function GameListForCategory({ title }: { title: string }) {
  return (
    <div>
      <div className=" flex  justify-between mt-6 mb-4">
        <p className=" text-[1.5rem] font-[600]">{title}</p>
        <button
          type="button"
          className=" flex gap-2 items-center justify-center text-white bg-purple px-4 py-1 rounded-3xl "
        >
          <p className=" font-[600] ">more</p>
          <BiRightArrow strokeWidth={2} size={12} />
        </button>
      </div>
      <div className="  ">
        <div className=" bg-gray-100 rounded-xl w-full min-h-[16rem] flex ">
          <p className=" m-auto  text-purple font-[600]  text-center">
            NO Games found! <br />{" "}
            <span className=" font-[200]">For {title}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
