"use client";
import React, { useEffect } from "react";
import TooltipButton from "./TooltipButton";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import CustomInput from "./CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

const schema = z.object({
  page: z.string().min(1, "Enter valid page"),
});

export type KommerTopBarSchemaData = z.infer<typeof schema>;

type Props = {
  page: string;
  pageCount: number
};

const KommerTopBar = ({ page, pageCount }: Props) => {
  const router = useRouter();
  const path = usePathname();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      page: page || "1",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: KommerTopBarSchemaData) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("p", data.page);

    router.push(`${path}?${searchParams.toString()}`);
  };
  
  useEffect(() => {
    setValue("page", page); 
  }, [page, setValue]);

  const nextPage = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const calcNextPage = (parseInt(page) + 1).toString();
  
    searchParams.set("p", calcNextPage);
    router.push(`${path}?${searchParams.toString()}`);
  };
  
  const prevPage = () => {
    if (parseInt(page) > 1) {
      const searchParams = new URLSearchParams(window.location.search);
      const calcPrevPage = (parseInt(page) - 1).toString();
  
      searchParams.set("p", calcPrevPage);
      router.push(`${path}?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex gap-1 mb-2 items-center">
      <TooltipButton disabled={page === '1'} text="Prev page">
        <IoCaretBack />
      </TooltipButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            } customClass="max-w-[60px] bg-surface text-center" register={register} name="page" />
      </form>
      <TooltipButton onClick={nextPage} disabled={Number(page) === pageCount} text="Next page">
        <IoCaretForward />
      </TooltipButton>
      <p className="text-gray-300 ml-2">page {page} of {pageCount}</p>
    </div>
  );
};

export default KommerTopBar;
