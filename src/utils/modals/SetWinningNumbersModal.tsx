import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GameCategoryDto } from "../dto/createGameCategoryDto";
import { GameDto } from "../dto/gameDto";
import styles from "@/styles/modalform.module.css";

import ModalLayout from "./ModalLayout";
import { winningTicketApi } from "@/store/apis/winningTicketApi";

type WinningNumberFormSchema = {
  first: number;
  second: number;
  third: number;
  video?: string;
};

export default function SetWinningNumberModal({
  setIsOpen,
  game,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  game: GameDto & { category: GameCategoryDto };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = useForm<WinningNumberFormSchema>();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null); // Store selected file

  const winningNumberValues = [watch("first"), watch("second"), watch("third")];

  // Handle video file change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && file.type.startsWith("video")) {
      // Revoke the previous preview URL to release memory
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      // Update video file state and create a new preview URL
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setValue("video", previewUrl);
      clearErrors("video");
    }
  };
  // Handle removing the video
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);

    // Clear the file input's value by creating a new reference
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    // Reset form value for video
    reset({ ...reset, video: undefined });
  };

  useEffect(() => {
    console.log(videoPreview);
    // debugger;
  }, [videoPreview]);

  const [setWinningNumbers] = winningTicketApi.useSetWinningTicketMutation();

  const onSubmit = async (data: WinningNumberFormSchema) => {
    try {
      const { first, second, third, video } = data;
      if (!data.video) {
        setError("video", {
          message: "Please provide a video of the winning process",
        });
        return;
      }
      const video_url = video?.replace("blob:", "")!;
      const reponse = await setWinningNumbers({
        gameId: game.id!,
        first: first,
        second: second,
        third: third,
        video_url,
      }).unwrap();
    } catch (error) {}
  };

  return (
    <ModalLayout setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h2 className={styles.heading}>Game ID: {game.id}</h2>
          <h2 className={styles.subheading}>
            Set Winning Number for Game:{" "}
            <span className="text-white">{game.name}</span>
          </h2>
          <p className={styles.note}>
            Please note that this action is irreversible. Ensure the correct
            winning numbers are provided for this game.
          </p>

          {/* Winning Number Inputs */}
          <div className={styles.inputWrapper}>
            <label className="block text-sm font-medium">
              First Place Winning Number
            </label>
            <input
              {...register("first", {
                required: { value: true, message: "This field is required" },
                min: { value: 1, message: "Value can not be less than 1." },
                max: {
                  value: game.category.ticket_count,
                  message: `Value can not exceed ${game.category.ticket_count}`,
                },
                validate: (value: number) => {
                  const isDuplicate =
                    winningNumberValues.filter((v) => v === value).length > 1;

                  if (isDuplicate) {
                    return `Value cannot be the same as one of the other winning numbers.`;
                  }
                  return undefined;

                  // const second = getValues("second");
                  // const third = getValues("third");
                  // if (value === second) {
                  //   return "Value can not be the same as the second winning value.";
                  // }
                  // if (value === third) {
                  //   return "Value can not be the same the third winning value";
                  // }
                },
              })}
              type="number"
              className={styles.inputField}
              placeholder="Enter First Place Winner"
            />
            {errors.first && (
              <p className={styles.errorText}>{errors.first.message}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className="block text-sm font-medium">
              Second Place Winning Number
            </label>
            <input
              {...register("second", {
                required: { value: true, message: "This field is required" },
                min: { value: 1, message: "Value can not be less than 1." },
                max: {
                  value: game.category.ticket_count,
                  message: `Value can not exceed ${game.category.ticket_count}`,
                },
                validate: (value: number) => {
                  const isDuplicate =
                    winningNumberValues.filter((v) => v === value).length > 1;

                  if (isDuplicate) {
                    return `Value cannot be the same as one of the other winning numbers.`;
                  }
                  return undefined;
                },
              })}
              type="number"
              className={styles.inputField}
              placeholder="Enter Second Place Winner"
            />
            {errors.second && (
              <p className={styles.errorText}>{errors.second.message}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className="block text-sm font-medium">
              Third Place Winning Number
            </label>
            <input
              {...register("third", {
                required: { value: true, message: "This field is required" },
                min: { value: 1, message: "Value can not be less than 1." },
                max: {
                  value: game.category.ticket_count,
                  message: `Value can not exceed ${game.category.ticket_count}`,
                },
                validate: (value: number) => {
                  const isDuplicate =
                    winningNumberValues.filter((v) => v === value).length > 1;

                  if (isDuplicate) {
                    return `Value cannot be the same as one of the other winning numbers.`;
                  }
                  return undefined;
                },
              })}
              type="number"
              className={styles.inputField}
              placeholder="Enter Third Place Winner"
            />
            {errors.third && (
              <p className={styles.errorText}>{errors.third.message}</p>
            )}
          </div>

          {/* Video Upload */}
          <div className={styles.videoUploadWrapper}>
            <label className="block text-sm font-medium">
              Upload Winning Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className={styles.videoUploadInput}
            />
            {errors.video && (
              <p className={styles.errorText}>{errors.video.message}</p>
            )}
            {videoPreview && (
              <div className={`${styles.videoPreview} `}>
                <video className={styles.videoElement} controls>
                  <source
                    key={videoPreview}
                    src={videoPreview}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  className=" bg-white rounded-xl text-purple  font-bold px-4 py-[2rem]  h-[2rem] mt-2"
                  onClick={handleRemoveVideo}
                >
                  Remove video
                </button>
              </div>
            )}
          </div>

          {/* Full-width Button */}
          <div className={styles.submitButtonWrapper}>
            <button type="submit" className={styles.submitButton}>
              <p className="gradient-text-color">Save Winning Numbers</p>
            </button>
          </div>
        </form>
      </div>
    </ModalLayout>
  );
}
