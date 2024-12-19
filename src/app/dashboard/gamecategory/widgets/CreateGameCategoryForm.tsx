"use client";
import { gameCategoryApis } from "@/store/apis/gameCategoryApis";
import styles from "@/styles/modalform.module.css";
import { GameCategoryRequestDto } from "@/utils/dto/createGameCategoryDto";
import { decimalToHexColor, hexToDecimalColor } from "@/utils/helper";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import { AnimatePresence, color, motion } from "framer-motion";
import { watch } from "fs";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";

export default function CreateGameCategoryForm({
  isTitleVisible,
}: {
  isTitleVisible: boolean;
}) {
  const [forgroundColor, setforegroundColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

  const [showForgroundPicker, setShowForgroundPicker] =
    useState<boolean>(false);
  const [showBackgroundPicker, setShowBackgroundPickte] =
    useState<boolean>(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    getValues,
    setError,
    watch,
    clearErrors,
  } = useForm<GameCategoryRequestDto>();
  const [showgame_durationDropdown, setShowgame_durationDropdown] =
    useState<boolean>(false);
  const [createGameCategory, { isLoading }] =
    gameCategoryApis.useCreateGameCategoryMutation();
  const onSubmit = async (data: GameCategoryRequestDto) => {
    if (!data.game_duration) {
      setError("game_duration", { message: "required" });
      return;
    }

    if (!data.fg_color) {
      setError("fg_color", { message: "required" });
      return;
    }

    if (!data.bg_color) {
      setError("bg_color", { message: "required" });
      return;
    }
    if (!data.avatar) {
      setError("avatar", { message: "required" });
      return;
    }

    data.avatar = "https://example.com";

    try {
      const response = await createGameCategory(data).unwrap();
      debugger;
    } catch (err) {
      debugger;
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("avatar", "");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="   create-category__sidebar__container   "
    >
      <h2 className="heading-two text-center mb-4 ">Create Game Category</h2>
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
      <div className={styles.videoUploadWrapper}>
        <label className="block text-sm font-medium">
          Upload Winning Image
        </label>
        <input
          type="file"
          accept="image/*" // Changed from video/* to image/*
          onChange={handleImageChange} // Update the handler to handle image changes
          className={styles.videoUploadInput}
        />
        {errors.avatar && <p className={styles.errorText}>requried</p>}
        {imagePreview && (
          <div className={`${styles.videoPreview}`}>
            <img
              className={styles.videoElement}
              src={imagePreview}
              alt="Preview"
            />
            <button
              type="button"
              className="bg-white rounded-xl text-purple font-bold mt-2"
              onClick={handleRemoveImage} // Update the handler to remove the image
            >
              Remove image
            </button>
          </div>
        )}
      </div>
      <label className=" ">
        Game Title
        <div className=" ">
          <input
            type="text"
            {...register("title_en", { required: true })}
            className=" "
            placeholder="Game Category Title"
          />
          {errors.title_en && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Game Title (Amharic)
        <div>
          <input
            {...register("title_am", { required: true })}
            type="text"
            className=" "
            placeholder="የጫዋታ እርእስ"
          />
          {errors.title_am && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Game game_duration
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowgame_durationDropdown(!showgame_durationDropdown);
            }}
            className=" flex justify-between items-center "
          >
            <p
              className={`${
                getValues("game_duration") ? "text-black " : "text-gray-400"
              } font-[500]`}
            >
              {getValues("game_duration") ?? "Select game_duration"}
            </p>
            <BiSolidDownArrow className="fill-purple text-purple" size={20} />
          </button>
          {showgame_durationDropdown && (
            <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
              <ul className="  ">
                {["Hourly", "Daily", "Weekly", "Monthly"].map((item, index) => {
                  return (
                    <li
                      onClick={() => {
                        setValue("game_duration", item.toLowerCase() as never);
                        clearErrors("game_duration");
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
          {errors.game_duration && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        Forground Color
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowForgroundPicker(!showForgroundPicker);
            }}
            className=" flex justify-between items-center "
          >
            <p className={` font-[500] text-gray-400 `}>
              Select Forground Color
            </p>
            <div
              className={`w-[2rem] h-[2rem] `}
              style={{
                backgroundColor: decimalToHexColor(watch("fg_color")),
              }}
            ></div>
          </button>
          {showForgroundPicker && (
            <div className=" w-full  absolute top-[3.5rem]">
              <ColorPicker
                color={forgroundColor}
                setColor={(color) =>
                  setValue("fg_color", hexToDecimalColor(color))
                }
              />
            </div>
          )}
          {errors.fg_color && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        Background Color
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowBackgroundPickte(!showBackgroundPicker);
            }}
            className=" flex justify-between items-center "
          >
            <p className={` font-[500] text-gray-400 `}>
              Select Background Color
            </p>
            <div
              className={`w-[2rem] h-[2rem] `}
              style={{
                backgroundColor: decimalToHexColor(watch("bg_color")),
              }}
            ></div>
          </button>
          {showBackgroundPicker && (
            <div className=" w-full  absolute top-[3.5rem]">
              <ColorPicker
                color={backgroundColor}
                setColor={(color) =>
                  setValue("bg_color", hexToDecimalColor(color))
                }
              />
            </div>
          )}
          {errors.fg_color && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        Winning Prize
        <p>
          <input
            {...register("winning_prize", { required: true })}
            type="number"
            placeholder="Winning prize"
          />
          {errors.winning_prize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </p>
      </label>
      <label className=" ">
        2nd Place prize
        <div>
          <input
            {...register("second_winning_prize", { required: true })}
            type="number"
            className=" "
            placeholder="2nd place prize"
          />
          {errors.second_winning_prize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        3nd Place prize
        <div>
          <input
            {...register("third_winning_prize", { required: true })}
            type="number"
            className=" "
            placeholder="3rd place prize"
          />
          {errors.third_winning_prize && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <label className=" ">
        Ticket Price
        <div>
          <input
            {...register("ticket_price", { required: true })}
            type="number"
            className=" "
            placeholder="Ticket price"
          />
          {errors.ticket_price && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Number of Ticket
        <div>
          <input
            {...register("ticket_count", { required: true })}
            type="number"
            className=" "
            placeholder="Number of Ticket"
          />
          {errors.ticket_count && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>
      <button type="submit" className="  mt-4 min-h-[3rem] mb-12">
        <p className=" gradient-text-color">
          {isLoading ? (
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

function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <HexColorPicker
      className="min-w-full"
      style={{
        borderRadius: "40px",
        zIndex: "100",
      }}
      color={color}
      onChange={setColor}
      onClick={(e) => e.preventDefault()}
    />
  );
}
