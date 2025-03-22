"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Playlist } from "@/lib/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { downloadSongs, getNotProtectedPlaylist } from "@/lib/radio";
import SelectPlaylistBox from "./SelectPlaylistBox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./CustomInput";

type Props = {
  handleClose: () => void;
};
const schema = z.object({
  url: z.string().url("Enter valid url"),
});

export type ImportSongSchemaData = z.infer<typeof schema>;

const ImportSongPopup = ({ handleClose }: Props) => {
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<Playlist[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const res = await getNotProtectedPlaylist();
        setData(res);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };
    getPlaylists();
  }, []);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      url: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ImportSongSchemaData) => {
    setIsLoading(true);
    const res = await downloadSongs(selected, data.url);
    if (res === "err") {
      toast.error("Something went wrong with importing");
      return;
    }
    toast.success("Imported");
    router.push("/1");
    setIsLoading(false);
    handleClose();
  };

  const handlePlaylistsChange = (id: number) => {
    selected.includes(id.toString())
      ? setSelected((prev) => prev.filter((item) => item !== id.toString()))
      : setSelected((prev) => [...prev, id.toString()]);
  };

  return (
    <div className="fixed top-0 left-0 z-40 w-full h-screen flex justify-center items-center bg-black/30">
      <div
        ref={boxRef}
        className="p-4 w-[350px] bg-surface rounded-md border border-border text-sm text-gray-200"
      >
        <p className="text-3xl font-bold text-center text-white mb-6">
          Import song
        </p>
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {data?.map((item) => (
            <SelectPlaylistBox
              key={item.id}
              selected={selected.includes(item.id.toString())}
              setSelected={() => handlePlaylistsChange(item.id)}
              data={item}
            />
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput name="url" register={register} placeholder="Url" error={errors.url && errors.url.message} />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 rounded-md bg-blue-600 hover:cursor-pointer font-bold py-1.5 px-4`}
          >
            {isLoading ? "Adding up..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImportSongPopup;
