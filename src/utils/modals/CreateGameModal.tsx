"use client";
import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";
import { httpRequestStatus } from "../constants";
import LoadingSpiner from "../widgets/LoadingSpinner";
import Skeleton from "react-loading-skeleton";
import { getGameCategory } from "@/services/gameCategoryServices";
import { CreateGameCategoryResponseDto } from "../dto/createGameCategoryDto";
import { createGame } from "@/services/gameServices";
import { ImTelegram } from "react-icons/im";

export default function CreateGameModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const [showDurationDropdown, setShowDurationDropdown] =
    useState<boolean>(false);
  const [createStatus, setCreateStatus] =
    useState<httpRequestStatus>("initial");
  const [fetchStatus, setFetchStatus] = useState<httpRequestStatus>("initial");
  const [gameCategories, setGameCategories] = useState<
    CreateGameCategoryResponseDto[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
    clearErrors,
    setError,
  } = useForm<{ category: CreateGameCategoryResponseDto }>();
  const onSubmit = async ({
    category,
  }: {
    category: CreateGameCategoryResponseDto;
  }) => {
    if (!category) {
      setError("category", {
        message: "You have to select a game category",
      });
      return;
    }
    try {
      setCreateStatus("loading");
      const response = await createGame({
        gameCategoryId: category.id,
      });
      if (response.status === 201) {
        setCreateStatus("success");
      }
      debugger;
    } catch (error) {
      setCreateStatus("error");
      debugger;
    }
  };

  useEffect(() => {
    reset();
    (async () => {
      try {
        setFetchStatus("loading");
        const response = await getGameCategory();
        if (response.status === 200) {
          setFetchStatus("success");
          setGameCategories(response.content!);
        }
      } catch (error) {
        setFetchStatus("error");
      }
    })();
  }, []);

  return (
    <ModalLayout setIsOpen={setIsOpen}>
      <div
        style={{ height: "60%" }}
        className="  flex justify-center items-center  min-w-[20rem]"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" create-category__sidebar__container min-w-full flex"
        >
          <h2 className=" heading-two  text-center mb-4">Create Game</h2>
          <label className=" ">
            Game Category
            <div className="relative">
              {fetchStatus === "loading" ? (
                <Skeleton baseColor="#d1d5db" height={50} />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowDurationDropdown(!showDurationDropdown);
                  }}
                  className=" flex justify-between items-center "
                >
                  <p
                    className={`${
                      getValues("category") ? "text-black " : "text-gray-400"
                    } font-[500]`}
                  >
                    {getValues("category")
                      ? `${getValues("category").title.en} ( ${
                          getValues("category").title.am
                        } )`
                      : "Select Game Category"}
                  </p>
                  <BiSolidDownArrow
                    className="fill-purple text-purple"
                    size={20}
                  />
                </button>
              )}
              {showDurationDropdown && (
                <div className="  w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
                  {gameCategories.length === 0 ? (
                    <div className=" min-h-dropdown  flex justify-center items-center ">
                      <p className=" m-auto  gradient-text-color">
                        No Category yet
                      </p>
                    </div>
                  ) : (
                    <table className="dropdown-table">
                      <thead>
                        <tr>
                          <th>Ticket count</th>
                          <th>Title</th>
                          <th>Winning Prizes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameCategories.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              index !== gameCategories.length - 1 ? "row" : ""
                            }
                            onClick={() => {
                              clearErrors("category");
                              setValue("category", item);
                            }}
                          >
                            <td>{item.numberOfTicket}</td>
                            <td>
                              <span className="block">• {item.title.en}</span>{" "}
                              <br />
                              <span className="block">
                                • {item.title.am}
                              </span>{" "}
                            </td>
                            <td>
                              <span className="block">
                                1• {item.winningPrize}
                              </span>{" "}
                              <br />
                              <span className="block">
                                2• {item.secondPlacePrize}
                              </span>{" "}
                              <br />
                              <span className="block">
                                3• {item.thirdPlacePrize}
                              </span>{" "}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              {errors.category && (
                <p className=" text-red-500 font-[500] ">
                  {errors.category.message}
                </p>
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
                "Create Game"
              )}
            </p>
          </button>
        </form>
      </div>
    </ModalLayout>
  );
}
