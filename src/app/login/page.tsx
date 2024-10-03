"use client";

import {
  sendEmailVerification,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { auth } from "../../utils/firebase/firebaseConfig";
import * as api from "@/utils/apiServiceHelper";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = async (d: any) => {
    try {
      const { email, password } = d;
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!credential.user.emailVerified) {
        setModalMessage("Verify your email");
        sendEmailVerification(credential.user);
        setShowModal(true);
      } else {
        const token = await credential.user.getIdToken();
        localStorage.setItem("token", token);
        router.push("/dashboard");
      }
    } catch (e) {
      setModalMessage("Wrong credentials please try again");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="login-form my-auto   w-full px-[3rem] "
    >
      {showModal && modalMessage && (
        <div className="modal" onClick={handleModalToggle}>
          <div className="modal-content" onClick={handleModalClick}>
            <p className=" font-[700] text-lg text-red-500">{modalMessage}</p>
          </div>
        </div>
      )}
      <h1 className=" text-[33px] font-[600] mb-12">
        Welcome to Admin Dashboard
      </h1>
      <div className="">
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
          className={` ${
            errors.email ? "form-container__input__error" : ""
          }  login-input`}
          type="email"
          placeholder=""
          id="email"
        />
        {errors.email && (
          <span className="error-message">
            {errors.email.message?.toString()}
          </span>
        )}
      </div>

      <div className="relative">
        <label htmlFor="password" className="text-xs font-normal">
          Password:
        </label>

        <div className="relative">
          <input
            {...register("password", {
              required: {
                value: true,
                message: "requried",
              },
            })}
            className={` ${
              errors.password && "form-container__input__error"
            }  login-input`}
            type={showPassword ? "text" : "password"}
            placeholder=""
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
        )}
      </div>
      <p
        onClick={() => {
          router.push("register");
        }}
        className=" text-[18px] font-[200]  mt-8 mb-2 "
      >
        new here,{" "}
        <span className=" text-black font-[500] hover:  transition-all ease-in-out duration-300 cursor-pointer">
          Create account
        </span>
      </p>
      <button className=" w-full  bg-purple  text-white py-4 rounded-xl font-[500]">
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
