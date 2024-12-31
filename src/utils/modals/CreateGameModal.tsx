"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { gameCategoryApis } from "@/store/apis/gameCategoryApis";
import { BiSolidDownArrow } from "react-icons/bi";
import { GameCategoryDto } from "../dto/createGameCategoryDto";
import LoadingSpiner from "../widgets/LoadingSpinner";
import ModalLayout from "./ModalLayout";
import { gameApi } from "@/store/apis/gameApis";

export default function CreateGameModal({
  setIsOpen,
  isOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  //states
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [categories, setCategories] = useState<GameCategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<GameCategoryDto | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  //mutations
  const [searchGameCategory, { isLoading }] =
    gameCategoryApis.useSearchGameCategoriesMutation();
  const [createGame, { isLoading: creatLoading }] =
    gameApi.useCreateGameMutation();
  const {
    formState: { errors },
    clearErrors,
    register,
    handleSubmit,
    setError,
  } = useForm<{ category: GameCategoryDto; name: string }>();

  const onSubmit = async (d: { category: GameCategoryDto; name: string }) => {
    if (!selectedCategory) {
      setError("category", {
        message: "required",
      });
      return;
    }
    try {
      const response = await createGame({
        categoryId: selectedCategory.id,
      }).unwrap();
      // debugger;
    } catch (error) {
      debugger;
    }
  };
  const onSearch = async (query: string) => {
    try {
      if (!query) {
        setCategories([]);
        return;
      }
      const response = await searchGameCategory({ query }).unwrap();
      setCategories(response.data?.data!);
    } catch (error) {
      debugger;
    }
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowCategories(false);
    }
  };

  const getDropdownContent = () => {
    if (isLoading) {
      return (
        <div className=" min-h-[5rem]  flex justify-center items-center">
          <div className=" m-auto">
            <LoadingSpiner dimension={30} />
          </div>
        </div>
      );
    } else if (categories.length === 0) {
      return (
        <div className=" min-h-[5rem]  flex justify-center items-center">
          <p className=" m-auto">No Game Category with this name.</p>
        </div>
      );
    } else {
      return (
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                setShowCategories(false);
                clearErrors();
                setInputValue(category.title_en + `(${category.title_am})`);
              }}
            >
              {category.title_en}
            </li>
          ))}
        </ul>
      );
    }
  };

  //hide drop down on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ModalLayout setIsOpen={setIsOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" create-category__sidebar__container min-w-full flex"
      >
        <h2 className=" heading-two  text-center mb-4">Create Game</h2>
        {/* <label className=" ">
          Game Name
          <div>
            <input
              {...register("name", { required: true })}
              type="text"
              className=" "
              placeholder="Name"
            />
            {errors.name && (
              <p className=" text-red-500 font-[500] ">required</p>
            )}
          </div>
        </label>{" "} */}
        <label className=" ">
          Game Category
          <div className="relative">
            <input
              type="text"
              placeholder="Search by category name"
              onChange={(event) => {
                if (!event.target.value) {
                  setShowCategories(false);
                  setInputValue("");
                  return;
                }
                setInputValue(event.target.value);
                onSearch(event.target.value);
                setSelectedCategory(null);
                setShowCategories(true);
              }}
              value={inputValue}
              className={selectedCategory ? "selected-dropdown" : "bg-white"}
            />
            <BiSolidDownArrow
              className="fill-purple text-purple absolute right-2 top-[.9rem]"
              size={20}
            />

            {showCategories && (
              <div
                ref={dropdownRef}
                className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black"
              >
                {getDropdownContent()}
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
          <p className=" gradient-text-color">Create Game</p>
        </button>
        <div className="tableFixHead"></div>
      </form>
    </ModalLayout>
  );
}
