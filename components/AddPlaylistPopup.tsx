"use client";
import { addPlaylist } from "@/lib/radio";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  handleClose: () => void;
};

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  description: z.string().min(1, "Enter description"),
});

export type AddPlaylistSchemaData = z.infer<typeof schema>;

const AddPlaylistPopup = ({ handleClose }: Props) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AddPlaylistSchemaData) => {
    const res = await addPlaylist(data.name, data.description);
    if (res === "err") {
      toast.error("Failed to create playlist");
      return;
    }
    toast.success("Created playlist");
    handleClose();
  };

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
  }, []);

  return (
    <div className="fixed top-0 left-0 z-40 w-full h-screen flex justify-center items-center bg-black/30">
      <div
        ref={boxRef}
        className="p-4 w-[350px] bg-surface rounded-md border border-border text-sm text-gray-200"
      >
        <p className="text-center text-3xl font-bold mb-6">New playlist</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            name="name"
            register={register}
            error={errors.name && errors.name.message}
            placeholder="Name"
          />
          <CustomInput
            name="description"
            register={register}
            error={errors.description && errors.description.message}
            placeholder="Description"
            customClass="mt-2"
          />
          <button
            type="submit"
            className="w-full py-1.5 px-4 outline-none appearance-none bg-blue-700 rounded-md mt-3 font-bold hover:cursor-pointer hover:bg-blue-800 duration-300 transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlaylistPopup;
