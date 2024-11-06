"use client";

import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormSchema = {
  email: string;
};

export default function ForgotPasswordView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>();
  const router = useRouter();
  const onSubmit = async ({ email }: FormSchema) => {
    try {
      //todo make a request for initiating password reset
    } catch (error) {}
  };
  return (
    <div className=" h-screen w-screen   flex  bg-softLavender">
      <div className="  m-auto w-[28rem] ">
        <div>
          <h1 className=" text-center font-bold text-[2rem] mb-12">
            EDIL DASHBOARD
          </h1>
          <div
            className="shadow-2xl  border-[.2rem]  border-white
                  py-[4rem] rounded-3xl"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              method="post"
              className="login-form my-auto   w-full px-[3rem]   "
            >
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
              <p className=" text-gray-600  font-[300]  mt-8 mb-2">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    router.push("login");
                  }}
                  className=" text-[1rem]     text-purple font-bold cursor-pointer hover:text-opacity-80  transition-all ease-in-out duration-150"
                >
                  Login
                </span>
              </p>
              <button className=" w-full  bg-purple  text-white py-4 rounded-xl font-[500]">
                {false ? (
                  <LoadingSpiner
                    dimension={30}
                    backgroundColor="white"
                    forgroundColor="white"
                  />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
