'use client'
import React from "react";
import { Table, TableCell, TableHead, TableRow } from "./Table";
import { Card } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import CustomInput from "./CustomInput";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TooltipButton from "./TooltipButton";
import { FaEdit, FaEye } from "react-icons/fa";
import Link from "next/link";

type Props = {
  data: Card[];
  id?: string
  fname?: string
  lname?: string
  cardid?: string
  group?: string
  class_name?: string
};

const schema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  card_number: z.string(),
  group: z.string(),
  class_name: z.string()
});

export type CardsSchemaData = z.infer<typeof schema>;

const CardsTable = ({ data, id, fname, lname, cardid, group, class_name }: Props) => {
  const router = useRouter();
  const path = usePathname()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: id || "",
      first_name: fname || "",
      last_name: lname || "",
      card_number: cardid || "",
      group: group || "",
      class_name: class_name || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CardsSchemaData) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("id", data.id);
    searchParams.set("fname", data.first_name);
    searchParams.set("lname", data.last_name);
    searchParams.set("cardid", data.card_number);
    searchParams.set("group", data.group);
    searchParams.set("classname", data.class_name);


    router.push(`${path}?${searchParams.toString()}`);
  };


  return (
    <div className="p-2 overflow-x-auto bg-surface rounded-lg border border-border">
      <Table>
        <TableHead>
          <TableCell className="min-w-[130px]">ID</TableCell>
          <TableCell className="min-w-[200px]">First name</TableCell>
          <TableCell className="min-w-[200px] flex-1">Last name</TableCell>
          <TableCell className="min-w-[120px] flex justify-center">
            Card id
          </TableCell>
          <TableCell className="min-w-[150px] flex justify-center">
            Group
          </TableCell>
          <TableCell className="min-w-[150px] flex justify-center">
            Class
          </TableCell>
          <TableCell className="min-w-[55px] flex justify-center">
            <FaEye />
          </TableCell>
          <TableCell className="min-w-[55px] flex justify-center">
            <FaEdit />
          </TableCell>
        </TableHead>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TableRow>
            <TableCell className="min-w-[130px]">
              <CustomInput
                register={register}
                name="id_employer"
                placeholder="ID"
                customClass="max-w-[114px]"
              />
            </TableCell>
            <TableCell className="min-w-[200px]">
              <CustomInput
                register={register}
                name="first_name"
                placeholder="First name"
                customClass="max-w-[184px]"
              />
            </TableCell>
            <TableCell className="min-w-[200px] flex-1 flex">
              <CustomInput
                register={register}
                name="last_name"
                placeholder="Last name"
                customClass="flex-1"
              />
            </TableCell>
            <TableCell className="min-w-[120px]">
              <CustomInput
                register={register}
                name="card_number"
                placeholder="Card ID"
                customClass="max-w-[104px]"
              />
            </TableCell>
            <TableCell className="min-w-[150px]">
              <CustomInput
                register={register}
                name="group"
                placeholder="Group"
                customClass="max-w-[134px]"
              />
            </TableCell>
            <TableCell className="min-w-[150px]">
              <CustomInput
                register={register}
                name="class_name"
                placeholder="Class"
                customClass="max-w-[134px]"
              />
            </TableCell>
            <TableCell className="min-w-[110px]">
              <button
                type="submit"
                className="w-full rounded-md border border-border py-1.5 appearance-none hover:cursor-pointer"
              >
                Submit
              </button>
            </TableCell>
          </TableRow>
        </form>

        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="min-w-[130px]">
              {item.id}
            </TableCell>
            <TableCell className="min-w-[200px]">{item.first_name}</TableCell>
            <TableCell className="min-w-[200px] flex-1">
              {item.last_name}
            </TableCell>
            <TableCell className="min-w-[120px] flex justify-center">
              {item.card_number}
            </TableCell>
            <TableCell className="min-w-[150px] flex justify-center">
              {capitalizeFirstLetter(item.group_name)}
            </TableCell>
            <TableCell className="min-w-[150px] flex justify-center">
              {item.class || '-'}
            </TableCell>
            <TableCell className="min-w-[55px] flex justify-center">
              <TooltipButton
                onClick={() => router.push(`/kommer/${item.id}`)}
                text="Details"
              >
                <FaEye />
              </TooltipButton>
            </TableCell>
            <TableCell className="min-w-[55px] flex justify-center">
              <TooltipButton text="Edit">
                <FaEdit />
              </TooltipButton>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

export default CardsTable;
