"use client";
import Cookies from "js-cookie";
import { passwordStrength } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCustomToken,
} from "firebase/auth";
import { auth, db } from "@/utils/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

import * as api from "@/utils/apiServiceHelper";
import { GenericResponse } from "@/utils/types";
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCPassword, setShowCPassword] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [termsErrorMessage, showTermsErrorMessage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };
  const handleSignup = async (d: any) => {
    if (!checkboxRef?.current?.checked) {
      showTermsErrorMessage(true);
      return;
    } else {
      showTermsErrorMessage(false);
    }
    const { email, password, fullName: username } = d;
    try {
      setLoading(true);
      const resposen = await api.post({
        url: "/api/admin/signup",
        method: "POST",
        body: { email, password, username },
      });
      const data: GenericResponse<string> = await resposen.json();
      if (data.status === 201 && data.data) {
        const credential = await signInWithCustomToken(auth, data.data);
        if (!credential.user.emailVerified) {
          sendEmailVerification(credential.user);
          setModalMessage("please verify your email and login again");
          setShowModal(true);
          return;
        }

        const token = await credential.user.getIdToken();

        Cookies.set("token", token);
      }

      // const credential = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );

      // if (credential.user) {
      //   //what if auth is successful but adding to firestore is not?
      //   await setDoc(doc(db, "admins", credential.user.uid), {
      //     fullName,
      //     email,
      //     password,
      //   });

      //   Cookies.set("loggedIn", "true");
      //   Cookies.set("uid", credential.user.uid);
      //   router.push("/dashboard");
      // }
    } catch (error) {
      setModalMessage("Error while registering a user");
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setScore(passwordStrength(getValues("password")));
  }, [watch("password"), setScore, passwordStrength, getValues]);
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <form
      onSubmit={handleSubmit(handleSignup)}
      className="  signup-form  w-full  my-auto px-[3rem] "
    >
      {showModal && modalMessage && (
        <div className="modal" onClick={handleModalToggle}>
          <div className="modal-data" onClick={handleModalClick}>
            <p className=" font-[700] text-lg text-red-500">{modalMessage}</p>
          </div>
        </div>
      )}
      <h1 className=" text-[33px] font-[600] mb-12">
        New here, Please Register
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8">
          <div className="w-full basis-full">
            <label htmlFor="fullName" className="text-xs font-normal">
              First Name:
            </label>
            <input
              {...register("fullName", {
                required: {
                  value: true,
                  message: "requried",
                },
                pattern: {
                  value: /^[A-Za-z]+(?:\s[A-Za-z]+)?$/,
                  message: "Please provide a valid name",
                },
              })}
              id="fullName"
              type="text"
              placeholder="First name"
            />
            {errors.fullName && (
              <span className="error-message">
                {errors.fullName.message?.toString()}
              </span>
            )}
          </div>
        </div>
        {/* <div className="flex flex-col">
    <label htmlFor="companyname" className="text-xs font-normal">
      Company name:
    </label>
    <input
      type="text"
      placeholder="Company name"
      {...register("companyName", {
        required: { value: true, message: "required" },
      })}

      // onChange={setEmail}
    />
    {errors.companyName && (
      <span className="error-message">
        {errors.companyName.message?.toString()}
      </span>
    )}
  </div> */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8">
          <div className="w-full basis-full">
            <label htmlFor="email" className="text-xs font-normal">
              Email address:
            </label>
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "requried",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "please provide a valid email address",
                },
              })}
              type="text"
              placeholder="Email"
              id="email"
            />
            {errors.email && (
              <span className="error-message">
                {errors.email.message?.toString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-8 relative">
          <div className="w-full basis-1/2 relative">
            <label htmlFor="password" className="text-xs font-normal">
              Password:
            </label>
            <div className="relative">
              <input
                className=""
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: { value: true, message: "requried" },

                  // pattern: {
                  // value:
                  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#`~"'±§|/])[A-Za-z\d@$!%*?&#`~"'±§|/]{8,}$/,
                  //   message: "Please follow the rules for setting the password",
                  // },
                })}
                placeholder="Password"
                id="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-6 top-2/4 -translate-y-2/4"
              >
                {showPassword ? (
                  <FaRegEye size={"1.5rem"} />
                ) : (
                  <FaRegEyeSlash size={"1.5rem"} />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">
                {errors.password.message?.toString()}
              </span>
            )}{" "}
            {/* {watch("password") && (
              <PasswordSBar
                score={score}
                className="mt-4 w-full flex flex-col "
              />
            )} */}
          </div>

          <div className="w-full basis-1/2 relative self-baseline">
            <label htmlFor="confirmPassword" className="text-xs font-normal">
              Confirm Password:
            </label>

            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: { value: true, message: "required" },
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
                id="confirmPassword"
              />
              <button
                type="button"
                onClick={toggleCPasswordVisibility}
                className="absolute right-6 top-2/4 -translate-y-2/4"
              >
                {showCPassword ? (
                  <FaRegEye size={"1.5rem"} />
                ) : (
                  <FaRegEyeSlash size={"1.5rem"} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword.message?.toString()}
              </span>
            )}
          </div>
        </div>

        <div className=" ">
          <div className="flex items-center ">
            <input
              id="checkbox"
              ref={checkboxRef}
              className=" w-5 h-5 rounded-none  text-violet "
              type="checkbox"

              // checked={isChecked}
            />
            <label
              htmlFor="checkbox"
              className="ml-2 select-none text-deepNavy text-left text-[14px] font-primaryLight leading-normal font-normal"
              style={{ marginTop: "0", marginBottom: "0" }}
            >
              {"I have read and agreed on the "}
              <a
                href="#"
                className="underline cursor-pointer hover:text-violet transition-all ease-in-out duration-100 "
              >
                Terms & Conditions
              </a>
            </label>
          </div>
          {termsErrorMessage && (
            <span className=" error-message__light ">
              You have to agree with the terms and conditions
            </span>
          )}
        </div>

        <button
          className="w-full  bg-purple text-white text-sm md:text-base p-4 heading-five rounded-xl flex items-center justify-center"
          type="submit"
        >
          {loading ? "Loading..." : "Signup"}
        </button>
      </div>
    </form>
  );
}
