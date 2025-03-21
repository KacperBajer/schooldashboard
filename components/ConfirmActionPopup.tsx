"use client"
import { checkPassword } from "@/lib/user";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "./CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  handleClose: () => void;
  action: () => void;
  name: string
};

const schema = z.object({
  password: z.string().min(1, 'Enter your password')
})

export type ConfirmActionSchemaData = z.infer<typeof schema>

const ConfirmActionPopup = ({ handleClose, action, name }: Props) => {
  const [password, setPassword] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const onSubmit = async (data: ConfirmActionSchemaData) => {
    const isValidPassword = await checkPassword(data.password)
    if (!isValidPassword) {
      toast.error('incorrect password')
      return
    }
    action()
    handleClose()
  }

  return (
    <div className="fixed top-0 left-0 z-[60] w-full h-screen flex justify-center items-center bg-black/30">
      <div
        className="rounded-md p-4 w-[300px] bg-surface border border-border"
        ref={boxRef}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-center text-xl mb-1 font-semibold">Authentication required</p>
          <p className="text-center mb-3 text-sm text-gray-300">To confirm {name} action please enter your password!</p>
          <CustomInput
            register={register}
            placeholder="Password"
            name="password"
            type="password"
          />
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 rounded-md py-1.5 hover:cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmActionPopup;