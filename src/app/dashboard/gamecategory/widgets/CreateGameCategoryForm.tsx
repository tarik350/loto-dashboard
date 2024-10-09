"use client";
import { createGameCategory } from "@/services/gameCategoryServices";
import { httpRequestStatus } from "@/utils/constants";
import { CreateGameCategoryRequestDto } from "@/utils/dto/createGameCategoryDto";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";

export default function CreateGameCategoryForm({
  refetch,
  isTitleVisible,
}: {
  refetch: () => void;
  isTitleVisible: boolean;
}) {
  const [createStatus, setCreateStatus] =
    useState<httpRequestStatus>("initial");
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<CreateGameCategoryRequestDto>();
  const [showDurationDropdown, setShowDurationDropdown] =
    useState<boolean>(false);
  const onSubmit = async (d: CreateGameCategoryRequestDto) => {
    if (!d.duration) {
      setError("duration", { message: "required" });
      return;
    }

    try {
      setCreateStatus("loading");
      const response = await createGameCategory(d);
      if (response.status === 201) {
        setCreateStatus("success");
        refetch();
      }
    } catch (err) {
      setCreateStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" m-auto   create-category__sidebar__container   overflow-auto  py-12"
    >
      <AnimatePresence>
        {isTitleVisible && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="heading-two text-center mb-4"
          >
            Create a Game Category
          </motion.h2>
        )}
      </AnimatePresence>
      <label className=" ">
        Game Title
        <div className=" ">
          <input
            type="text"
            {...register("title.en", { required: true })}
            className=" "
            placeholder="Game Category Title"
          />
          {errors.title?.en && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Game Title (Amharic)
        <div>
          <input
            {...register("title.am", { required: true })}
            type="text"
            className=" "
            placeholder="የጫዋታ እርእስ"
          />
          {errors.title?.am && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Game Duration
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDurationDropdown(!showDurationDropdown);
            }}
            className=" flex justify-between items-center "
          >
            <p
              className={`${
                getValues("duration") ? "text-black " : "text-gray-400"
              } font-[500]`}
            >
              {getValues("duration") ?? "Select Duration"}
            </p>
            <BiSolidDownArrow className="fill-purple text-purple" size={20} />
          </button>
          {showDurationDropdown && (
            <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
              <ul className="  ">
                {["Hourly", "Daily", "Weekly", "Monthly"].map((item, index) => {
                  return (
                    <li
                      onClick={() => {
                        setValue("duration", item.toLowerCase() as never);
                        clearErrors("duration");
                      }}
                      className=" "
                      key={index}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {errors.duration && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Winning Prize
        <p>
          <input
            {...register("winningPrize", { required: true })}
            type="number"
            placeholder="Winning prize"
          />
          {errors.winningPrize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </p>
      </label>
      <label className=" ">
        2nd Place prize
        <div>
          <input
            {...register("secondPlacePrize", { required: true })}
            type="number"
            className=" "
            placeholder="2nd place prize"
          />
          {errors.secondPlacePrize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        3nd Place prize
        <div>
          <input
            {...register("thirdPlacePrize", { required: true })}
            type="number"
            className=" "
            placeholder="3rd place prize"
          />
          {errors.thirdPlacePrize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        Ticket Price
        <div>
          <input
            {...register("ticketPrice", { required: true })}
            type="number"
            className=" "
            placeholder="Ticket price"
          />
          {errors.ticketPrice && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Number of Ticket
        <div>
          <input
            {...register("numberOfTicket", { required: true })}
            type="number"
            className=" "
            placeholder="Number of Ticket"
          />
          {errors.numberOfTicket && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <button type="submit" className="  mt-4 min-h-[3rem]">
        <p className=" gradient-text-color">
          {createStatus === "loading" ? (
            <div className=" flex justify-center items-center">
              <LoadingSpiner dimension={30} />
            </div>
          ) : (
            "Create Game Category"
          )}
        </p>
      </button>
    </form>
  );
}
