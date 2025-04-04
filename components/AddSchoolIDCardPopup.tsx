"use client";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import CustomInput from "./CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectBox from "./SelectBox";
import { convertToBase64, peselDecode } from "@/lib/utils";
import { schoolIDStudentCard, schoolIDTeacherCard } from "@/lib/schoolIDCard";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
};

const studentSchema = z.object({
  firstName: z.string().min(1, "Enter first name"),
  lastName: z.string().min(1, "Enter last name"),
  PESEL: z.string().min(11, "Enter valid PESEL").max(11, "Enter valid PESEL"),
  ID: z.string().min(1, "Enter ID"),
  relaseDate: z.string().min(1, "Enter relase date"),
});

const teacherSchema = z.object({
  firstName: z.string().min(1, "Enter first name"),
  lastName: z.string().min(1, "Enter last name"),
  ID: z.string().min(1, "Enter ID"),
  relaseDate: z.string().min(1, "Enter relase date"),
});

export type StudentSchemaData = z.infer<typeof studentSchema>;
export type TeacherSchemaData = z.infer<typeof teacherSchema>;

const AddSchoolIDCardPopup = ({ handleClose }: Props) => {
  const [mode, setMode] = useState<"teacher" | "student" | null>(null);

  return (
    <div className="fixed top-0 left-0 z-[30] w-full h-screen flex justify-center items-center bg-black/30">
      <div className="relative rounded-md p-4 w-[300px] bg-surface border border-border">
        <button
          onClick={handleClose}
          className="hover:cursor-pointer absolute top-1 right-1 p-1.5 rounded-md bg-secondary-background"
        >
          <MdClose className="" />
        </button>
        {!mode && (
          <div>
            <p className="text-center font-bold text-3xl mb-5">Choose mode</p>
            <button
              onClick={() => setMode("student")}
              className="w-full bg-primary-background rounded-md py-1.5 hover:cursor-pointer border border-border hover:bg-blue-600 transition-all duration-300 ease-in-out mb-2"
            >
              Student
            </button>
            <button
              onClick={() => setMode("teacher")}
              className="w-full bg-primary-background rounded-md py-1.5 hover:cursor-pointer border border-border hover:bg-blue-600 transition-all duration-300 ease-in-out"
            >
              Teacher
            </button>
          </div>
        )}
        {mode === "student" && <StudentForm />}
        {mode === "teacher" && <TeacherForm />}
      </div>
    </div>
  );
};

const StudentForm = () => {
  const [selectedSchoolType, setSelectedSchoolType] = useState(
    "Liceum ogólnokształcące"
  );
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      PESEL: "",
      relaseDate: "",
      ID: "",
    },
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data: StudentSchemaData) => {
    if (!image) return;
    const imageBase64 = await convertToBase64(image);
    const res = await schoolIDStudentCard(
      data.firstName,
      data.lastName,
      peselDecode(data.PESEL),
      data.PESEL,
      selectedSchoolType,
      data.relaseDate,
      data.ID,
      imageBase64
    );
    if (res === "err") {
      toast.error("Something went wrong");
      return;
    }
    const blob = new Blob([res]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${data.firstName}_${data.lastName}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center font-bold text-3xl mb-5">Student data</p>
      <Dropzone
        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="border border-border rounded-md bg-primary-background">
            <div {...getRootProps()} className="p-4 hover:cursor-pointer">
              <input required {...getInputProps()} />
              {image ? (
                <Image
                  alt=""
                  src={URL.createObjectURL(image)}
                  width={200}
                  height={200}
                  className="w-full h-fit rounded-md"
                />
              ) : (
                <p className="text-center">Image</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <CustomInput
        register={register}
        name="firstName"
        placeholder="First name"
        customClass="mt-2"
        error={errors.firstName && errors.firstName.message}
      />
      <CustomInput
        register={register}
        name="lastName"
        placeholder="Last name"
        customClass="mt-2"
        error={errors.lastName && errors.lastName.message}
      />
      <CustomInput
        register={register}
        name="PESEL"
        placeholder="PESEL"
        customClass="mt-2"
        error={errors.PESEL && errors.PESEL.message}
      />
      <CustomInput
        register={register}
        name="ID"
        placeholder="ID"
        customClass="mt-2"
        error={errors.ID && errors.ID.message}
      />
      <CustomInput
        register={register}
        name="relaseDate"
        placeholder="Release date"
        customClass="mt-2"
        error={errors.relaseDate && errors.relaseDate.message}
      />
      <SelectBox
        selected={selectedSchoolType}
        setSelected={setSelectedSchoolType}
        options={[
          "Liceum ogólnokształcące",
          "Technikum",
          "Szkoła branżowa I stopnia",
        ]}
        customClass="mt-2"
      />
      <button
        type="submit"
        className="w-full py-1.5 rounded-md bg-blue-600 hover:cursor-pointer appearance-none mt-3"
      >
        Download templates
      </button>
    </form>
  );
};

const TeacherForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      ID: "",
      relaseDate: "",
    },
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = async (data: TeacherSchemaData) => {
    if (!image) return;
    const imageBase64 = await convertToBase64(image);
    const res = await schoolIDTeacherCard(
      data.firstName,
      data.lastName,
      data.relaseDate,
      data.ID,
      imageBase64
    );
    if (res === "err") {
      toast.error("Something went wrong");
      return;
    }
    const blob = new Blob([res]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${data.firstName}_${data.lastName}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center font-bold text-3xl mb-5">Teacher data</p>
      <Dropzone
        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="border border-border rounded-md bg-primary-background">
            <div {...getRootProps()} className="p-4 hover:cursor-pointer">
              <input required {...getInputProps()} />
              {image ? (
                <Image
                  alt=""
                  src={URL.createObjectURL(image)}
                  width={200}
                  height={200}
                  className="w-full h-fit rounded-md"
                />
              ) : (
                <p className="text-center">Image</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <CustomInput
        register={register}
        name="firstName"
        placeholder="First name"
        customClass="mt-2"
        error={errors.firstName && errors.firstName.message}
      />
      <CustomInput
        register={register}
        name="lastName"
        placeholder="Last name"
        customClass="mt-2"
        error={errors.lastName && errors.lastName.message}
      />
      <CustomInput
        register={register}
        name="ID"
        placeholder="ID"
        customClass="mt-2"
        error={errors.ID && errors.ID.message}
      />
      <CustomInput
        register={register}
        name="relaseDate"
        placeholder="Release date"
        customClass="mt-2"
        error={errors.relaseDate && errors.relaseDate.message}
      />
      <button
        type="submit"
        className="w-full py-1.5 rounded-md bg-blue-600 hover:cursor-pointer appearance-none mt-3"
      >
        Download templates
      </button>
    </form>
  );
};

export default AddSchoolIDCardPopup;
