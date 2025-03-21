import React from "react";
import { MdClose } from "react-icons/md";
import CustomInput from "./CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "@/lib/user";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
};

const schema = z.object({
  username: z.string().min(1, "Enter username"),
  email: z.string().email("Enter valid email"),
  password: z.string().min(1, "Enter password"),
  confirmPassword: z.string().min(1, "Confirm password")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords does not match",
  path: ["confirmPassword"]
});

export type AddUserSchemaData = z.infer<typeof schema>;

const AddUserPopup = ({ handleClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "", email: "" },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AddUserSchemaData) => {
    const res = await createUser(data.email, data.username, data.password)
    if(res.status === 'error') {
      toast.error(res.error)
      return
    }
    toast.success('User created')
    handleClose()
  };

  return (
    <div className="fixed top-0 left-0 z-[30] w-full h-screen flex justify-center items-center bg-black/30">
      <div className="relative rounded-md p-4 w-[300px] bg-surface border border-border">
        <button
          onClick={handleClose}
          className="hover:cursor-pointer absolute top-1 right-1 p-1.5 rounded-md bg-secondary-background"
        >
          <MdClose className="" />
        </button>
        <p className="text-center font-bold text-3xl">Add user</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-5"
        >
          <CustomInput
            register={register}
            name="username"
            placeholder="Username"
            error={errors.username && errors.username.message}
          />
          <CustomInput
            register={register}
            name="email"
            placeholder="Email"
            error={errors.email && errors.email.message}
          />
          <CustomInput
            register={register}
            name="password"
            placeholder="Password"
            type="password"
            error={errors.password && errors.password.message}
          />
          <CustomInput
            register={register}
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
            error={errors.confirmPassword && errors.confirmPassword.message}
          />
          <button
            type="submit"
            className="w-full py-1.5 rounded-md bg-blue-600 mt-1 hover:cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserPopup;
