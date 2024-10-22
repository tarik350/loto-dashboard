"use client";

import { adminUserApi } from "@/store/apis/adminUserApis";
import { roleApi } from "@/store/apis/roleApi";
import { RoleDto } from "@/utils/dto/roleDto";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import { debug, error } from "console";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidDownArrow } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { validate } from "uuid";
import { RoleInput } from "./RoleSearchbleInput";

type AdminUserFormSchema = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmpassword: string;
  selectedRole: RoleDto;
};
export default function CreateAdminUserForm() {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    setError,
    getValues,
    formState: { errors },
  } = useForm<AdminUserFormSchema>();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [showRoles, setShowRoles] = useState<boolean>(false);
  const [showCPassword, setShowCPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //MUTATIONS
  const [searchRole] = roleApi.useSearchRoleMutation();
  const [createAdminUser] = adminUserApi.useCreateAdminUserMutation();

  const onSearch = async (query: string) => {
    try {
      if (!query) {
        setRoles([]);
        return;
      }
      const response = await searchRole({ query }).unwrap();
      setRoles(response.data?.data!);
    } catch (error) {
      debugger;
    }
  };
  const onSubmit = async (data: AdminUserFormSchema) => {
    try {
      if (!data.selectedRole) {
        setError("selectedRole", { message: "Please select a role." });
        return;
      }

      const { selectedRole, ...payload } = data;

      const response = await createAdminUser({
        role_id: selectedRole.id,
        ...payload,
      }).unwrap();
      //todo show success message
    } catch (error) {
      //todo show error message
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="create-category__sidebar__container  m-auto"
    >
      <h2 className="heading-two text-center mb-4">Create Admin User</h2>
      <label className=" ">
        First Name
        <div>
          <input
            {...register("firstname", { required: true })}
            type="text"
            className=" "
            placeholder="First Name"
          />
          {errors.firstname && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Last Name
        <div>
          <input
            {...register("lastname", { required: true })}
            type="text"
            className=" "
            placeholder="Last Name"
          />
          {errors.lastname && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Role
        <div className=" relative">
          <RoleInput
            setShowRoles={setShowRoles}
            onSearch={onSearch}
            selectedRole={getValues("selectedRole")}
          />
          {errors.selectedRole && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
          <BiSolidDownArrow
            className="fill-purple text-purple absolute right-2 top-[.9rem]"
            size={20}
          />
          {showRoles && (
            <div className=" h-max w-full bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black">
              {roles.length === 0 && (
                <div className=" min-h-[5rem]  flex justify-center items-center">
                  <p className=" m-auto">No Roles with this name.</p>
                </div>
              )}
              {roles.length !== 0 && (
                <ul>
                  {roles.map((role) => (
                    <li
                      key={role.id}
                      onClick={() => {
                        setValue("selectedRole", role);
                        setShowRoles(false);
                        clearErrors("selectedRole");
                      }}
                    >
                      {role.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </label>
      <label className=" ">
        Email
        <div>
          <input
            {...register("email", { required: true })}
            type="email"
            className=""
            placeholder="Email"
          />
          {errors.email && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
        </div>
      </label>{" "}
      <label className=" ">
        Password
        <div className="relative">
          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            className=""
            placeholder="Password"
          />
          {errors.password && (
            <p className=" text-red-500 font-[500] ">required</p>
          )}
          <div
            className="absolute right-2 top-[.7rem] cursor-pointer "
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <FaRegEye size={"1.5rem"} className="fill-purple" />
            ) : (
              <FaRegEyeSlash size={"1.5rem"} className="fill-purple" />
            )}
          </div>
        </div>
      </label>{" "}
      <label className=" ">
        Confirm Password
        <div className="relative">
          <input
            {...register("confirmpassword", {
              required: {
                value: true,
                message: "required",
              },
              validate: (value: string) => {
                if (value !== watch("password")) {
                  return "Passwords do not match.";
                }
              },
            })}
            type={showCPassword ? "text" : "password"}
            className=""
            placeholder="Confirm Password"
          />
          {errors.confirmpassword && (
            <p className=" text-red-500 font-[500] ">
              {errors.confirmpassword.message}
            </p>
          )}
          <button
            type="button"
            className="absolute right-2 top-[.7rem] cursor-pointer "
            onClick={() => {
              setShowCPassword(!showCPassword);
            }}
          >
            {showCPassword ? (
              <FaRegEye size={"1.5rem"} className="fill-purple" />
            ) : (
              <FaRegEyeSlash size={"1.5rem"} className="fill-purple" />
            )}
          </button>
        </div>
      </label>
      <button type="submit" className="  mt-4 min-h-[3rem]">
        <p className=" gradient-text-color">
          {false ? (
            <div className=" flex justify-center items-center">
              <LoadingSpiner dimension={30} />
            </div>
          ) : (
            "Create Admin User"
          )}
        </p>
      </button>
    </form>
  );
}
