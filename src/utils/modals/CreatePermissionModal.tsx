"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";
import LoadingSpiner from "../widgets/LoadingSpinner";
import ModalLayout from "./ModalLayout";

import { permissionApi } from "@/store/apis/permissionApi";
import Skeleton from "react-loading-skeleton";
import {
  CategoryDto,
  PermissionDto,
  PermissionRequestDto,
} from "../dto/permissionDto";

// type PermissionPayload = { categoryId: PermissionCategoryDto; name: string };
export default function CreatePermissionModal({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) {
  //query
  const { data, isLoading, isSuccess, isError, error } =
    permissionApi.useGetPermissionCategoriesQuery();

  //mutation
  const [createPermission, { isLoading: createLoading }] =
    permissionApi.useCreatePermissionMutation();

  //states
  const [permissionCategories, setPermissionCategories] = useState<
    CategoryDto[] | undefined
  >(undefined);
  const [showCategoryDropdown, setShowCategoryDropdown] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDto | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<PermissionRequestDto>();

  const onSubmit = async (data: PermissionRequestDto) => {
    try {
      const { categoryId, description, name } = data;
      if (!categoryId) {
        setError("categoryId", { message: "required" });
        return;
      }
      const response = await createPermission({
        categoryId,
        description,
        name,
      }).unwrap();
      if (response.status === 200) {
        //todo show success some thing
      }
    } catch (error) {
      //todo show error something
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      setPermissionCategories(data.data!);
    }
  }, [isSuccess, data]);
  const getDropdownView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-centers py-12">
          <LoadingSpiner dimension={30} />
        </div>
      );
    }

    if (permissionCategories && permissionCategories.length === 0) {
      return (
        <div className="flex justify-center items-centers py-12">
          <p className=" font-[500]  text-gray-400">No Categries found</p>
        </div>
      );
    }
    if (permissionCategories && permissionCategories.length > 0) {
      return (
        <ul className="  ">
          {permissionCategories?.map((item, index) => {
            return (
              <li
                onClick={() => {
                  setValue("categoryId", item.id);
                  clearErrors("categoryId");
                  setSelectedCategory(item);
                }}
                className=" "
                key={index}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      );
    }
  };

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
              {isLoading ? (
                <Skeleton baseColor="#d1d5db" height={50} />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                  }}
                  className=" flex justify-between items-center "
                >
                  <p
                    className={`${
                      selectedCategory ? "text-black " : "text-gray-400"
                    } font-[500]`}
                  >
                    {selectedCategory
                      ? `${selectedCategory.name}`
                      : "Select Game Category"}
                  </p>
                  <BiSolidDownArrow
                    className="fill-purple text-purple"
                    size={20}
                  />
                </button>
              )}
              {showCategoryDropdown && (
                <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
                  {getDropdownView()}
                </div>
              )}

              {errors.categoryId && (
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
          <label className=" ">
            Permission Description
            <p>
              <input
                {...register("description", { required: false })}
                type="text"
                placeholder="Permission Description (optional) "
              />
              {/* {errors.description && (
                <p className=" text-red-500 font-[500] ">required</p>
              )} */}
            </p>
          </label>
          <button type="submit" className="  mt-4 min-h-[3rem]">
            <p className=" gradient-text-color">
              {createLoading ? (
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
