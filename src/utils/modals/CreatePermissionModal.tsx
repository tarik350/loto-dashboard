"use client";

import { getGameCategory } from "@/services/gameCategoryServices";
import { createGame } from "@/services/gameServices";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";
import { httpRequestStatus } from "../constants";
import { CreateGameCategoryResponseDto } from "../dto/createGameCategoryDto";
import LoadingSpiner from "../widgets/LoadingSpinner";
import ModalLayout from "./ModalLayout";
import { authenticatedGet, authenticatedPost } from "../apiServiceHelper";
import { GenericResponse } from "../types";
import { settingDto } from "../dto/settingDto";
import Skeleton from "react-loading-skeleton";

type PermissionPayload = { category: string; name: string };
export default function CreatePermissionModal({
  setIsOpen,
}: {
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

  const [permissionCategories, setPermissionCategories] = useState<string[]>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
    clearErrors,
    setError,
  } = useForm<PermissionPayload>();

  const onSubmit = async (d: PermissionPayload) => {
    try {
      const response = await authenticatedPost({
        url: "/api/admin/permission",
        body: d,
        method: "POST",
      });
      console.log(d);
      const data: GenericResponse<string> = await response.json();
      if (data.status === 200) {
      }
    } catch (error) {}
  };

  useEffect(() => {
    reset();
    (async () => {
      try {
        setFetchStatus("loading");
        const response = await getGameCategory();
        const res = await authenticatedGet({
          url: "/api/admin/settings",
        });
        const settings: GenericResponse<settingDto> = await res.json();

        if (settings) {
          setPermissionCategories(settings.content?.permissionCategories!);
        }
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
        style={{
          height: "60%",
          //   width: "100%",
        }}
        className="  flex justify-center items-center  w-full  "
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" create-category__sidebar__container min-w-full flex"
        >
          <h2 className=" heading-two  text-center mb-4">Create Permission</h2>
          <label className=" ">
            Permission Category
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
                      ? `${getValues("category")}`
                      : "Select Game Category"}
                  </p>
                  <BiSolidDownArrow
                    className="fill-purple text-purple"
                    size={20}
                  />
                </button>
              )}
              {showDurationDropdown && permissionCategories.length > 0 && (
                <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
                  <ul className="  ">
                    {permissionCategories.map((item, index) => {
                      return (
                        <li
                          onClick={() => {
                            setValue("category", item);
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
              {errors.category && (
                <p className=" text-red-500 font-[500] ">required</p>
              )}
            </div>
          </label>{" "}
          <label className=" ">
            Permission Name
            <p>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Permission Name"
              />
              {errors.name && (
                <p className=" text-red-500 font-[500] ">required</p>
              )}
            </p>
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
