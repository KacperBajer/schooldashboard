import React from "react";
import { MdClose } from "react-icons/md";
import CustomInput from "./CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOrder, editOrder } from "@/lib/orders";
import { toast } from "react-toastify";
import { OrderItem } from "@/lib/types";

type Props = {
  mode: "add" | "edit";
  handleClose: () => void;
  item?: OrderItem;
};

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  href: z.string().url("Enter valid url"),
  amount: z
    .string()
    .min(1, "Enter valid amount")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Enter valid amount"
    ),
  cost: z
    .string()
    .min(1, "Enter valid price")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Enter valid price"
    ),
});

export type OrederSchemaData = z.infer<typeof schema>;

const AddOrderPopup = ({ mode, handleClose, item }: Props) => {
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: item?.name || "", href: item?.href || "", amount:  item?.amount.toString() || '', cost: item?.cost.toString() || '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: OrederSchemaData) => {
    if (mode === "edit" && item) {
      const res = await editOrder(item.id, data.name, data.href, Number(data.amount), Number(data.cost))
      if (res.status === "error") {
        toast.error(res.error);
        return;
      }
      toast.success("Order edited");
      handleClose();
      return
    }
    const res = await addOrder(
      data.name,
      data.href,
      Number(data.amount),
      Number(data.cost)
    );
    if (res.status === "error") {
      toast.error(res.error);
      return;
    }
    toast.success("Order added");
    handleClose();
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
        <p className="text-center font-bold text-3xl">
          {mode === "add" ? "Add" : "Edit"} order
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-5"
        >
          <CustomInput
            register={register}
            name="name"
            placeholder="Name"
            error={errors.name && errors.name.message}
          />
          <CustomInput
            register={register}
            name="href"
            placeholder="Url"
            error={errors.href && errors.href.message}
          />
          <CustomInput
            register={register}
            name="amount"
            placeholder="Amount"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            error={errors.amount && errors.amount.message}
          />
          <CustomInput
            register={register}
            name="cost"
            placeholder="Price"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
            }
            error={errors.cost && errors.cost.message}
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

export default AddOrderPopup;
