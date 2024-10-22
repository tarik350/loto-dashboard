"use client";
import { permissionApi } from "@/store/apis/permissionApi";
import { roleApi } from "@/store/apis/roleApi";
import { handleErrorResponse, parseValidationErrors } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiListUl, BiPlus } from "react-icons/bi";

export default function CreateRolePage() {
  const { data, isSuccess } =
    permissionApi.useGetPermissionsWithCategoryQuery();
  const [isChecked, setIsChecked] = useState<Record<number, boolean>>({});
  const [createRole] = roleApi.useCreateRoleMutation();

  useEffect(() => {
    if (isSuccess && data) {
      let record: Record<number, boolean> = {};
      data.data?.data.forEach((element) => {
        let temp = element.permissions?.reduce<Record<number, boolean>>(
          (prev, current) => {
            prev[current.id] = false;
            return prev;
          },
          {}
        );
        record = { ...record, ...temp };
      });
      setIsChecked(record);
    }
  }, [isSuccess]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ roleName: string }>();

  const toggleCategory = (categoryId: number, checked: boolean) => {
    const permissions = data?.data?.data.find(
      (item) => item.id === categoryId
    )?.permissions;
    permissions?.forEach((item) => {
      setIsChecked((prev) => {
        return { ...prev, [item.id]: checked ? true : false };
      });
    });
  };
  const toggleAll = (checked: boolean) => {
    const updatedState = Object.keys(isChecked).reduce<Record<number, boolean>>(
      (prev, current) => {
        prev[parseInt(current)] = checked ? true : false;
        return prev;
      },
      {}
    );
    setIsChecked(updatedState);
  };
  const onSubmit = async ({ roleName }: { roleName: string }) => {
    const permissions = Object.keys(isChecked)
      .filter((item) => isChecked[parseInt(item)])
      .map((key) => parseInt(key));
    try {
      const response = await createRole({
        name: roleName,
        permissions,
      }).unwrap();
      if (response.status === 201) {
        alert("success");
      }
    } catch (error) {
      const messge = handleErrorResponse(error);
      alert(messge);
    }
  };
  return (
    <div className="  ">
      <h1 className=" leading-none text-[2rem] font-[600] mb-6">Create Role</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-screen  overflow-y-auto  pb-[10rem]"
      >
        <div className=" flex justify-between  items-end mb-4 ">
          <label className=" text-black font-[500]">
            {/* Role Name */}
            <div>
              <input
                {...register("roleName", {
                  required: {
                    value: true,
                    message: "Role name is required.",
                  },
                })}
                type="text"
                className="   w-[20rem] h-[3rem] bg-white border-purple border-2 text-black font-[400] px-4"
                placeholder="Role name"
              />
              {errors.roleName && (
                <p className=" text-red-500 font-[500] ">required</p>
              )}
            </div>
          </label>
          <button className="w-1/4 h-[3rem]  border-2 border-purple px-4 flex items-center justify-center gap-1">
            <BiPlus
              className=" fill-purple "
              size={25}
              strokeWidth={1}
              color="#9a0ae4"
            />

            <p className="font-bold text-purple text-opacity-70 hover:text-opacity-100  ease-in-out transition-all duration-150 ">
              Create Role
            </p>
          </button>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start items-center  mb-2">
            <BiListUl size={40} className=" p-0" />
            <h2 className=" leading-none text-[1.4rem] ">All Permissions</h2>
          </div>
          <div className=" flex items-center justify-center gap-2">
            <input
              checked={Object.keys(isChecked).every(
                (item) => isChecked[parseInt(item)]
              )}
              onChange={(e) => {
                toggleAll(e.target.checked);
              }}
              type="checkbox"
            />
            <p className="">Select All</p>
          </div>
        </div>
        <div className=" grid grid-cols-3  gap-4   ">
          {data?.data!.data.map((item, index) => (
            <div
              key={index}
              className="  subtle-container__background min-h-[20rem] border-2 border-purple border-opacity-30"
            >
              <div className=" flex items-center  justify-start gap-2 ">
                <input
                  checked={
                    data.data?.data.filter(
                      (category) => category.id === item.id
                    )[0].permissions?.length! > 0 &&
                    data.data?.data
                      .filter((category) => category.id === item.id)[0]
                      ?.permissions?.every(
                        (permission) => isChecked[permission.id]
                      )
                  }
                  onChange={(e) => {
                    toggleCategory(item.id, e.target.checked);
                  }}
                  type="checkbox"
                />
                <p className=" font-[500] text-[1.2rem]">{item.name}</p>
              </div>
              <div className=" bg-purple opacity-30 h-[2px] w-full mt-2 mb-6"></div>
              <ul className=" h-full flex flex-col gap-2">
                {item.permissions?.length === 0 && (
                  <p className=" items-center justify-center flex  font-[600] text-black h-[60%] w-full ">
                    No Permission for this Permission Category
                  </p>
                )}
                {item.permissions?.map((permission, PermissionIndex) => (
                  <div
                    key={PermissionIndex}
                    className="flex items-center justify-start gap-2"
                  >
                    <input
                      checked={isChecked[permission.id]}
                      onChange={() => {
                        setIsChecked((prev) => {
                          return {
                            ...prev,
                            [permission.id]: !prev[permission.id],
                          };
                        });
                      }}
                      type="checkbox"
                    />
                    <p>{permission.name.split("_").join(" ").toLowerCase()}</p>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
