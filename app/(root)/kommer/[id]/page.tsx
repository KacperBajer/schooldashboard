import KommerInfoInput from "@/components/KommerInfoInput";
import { getKommerUser, getKommerUsers, getPermissions } from "@/lib/kommer";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params, searchParams }: any) => {
  const { id } = await params;
  if (!id) redirect("/kommer");

  const kommerUser = await getKommerUser(id);
  const permisions = await getPermissions(kommerUser.PIN as string)
  const group = await getKommerUsers(1, kommerUser.PIN as string)

  return (
    <div className="p-4 md:pl-0 min-h-screen">
      <div className="rounded-md bg-surface border border-border p-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <section className="flex flex-col gap-2">
          <KommerInfoInput name="Employer number" value={kommerUser.PIN || '-'} />
          <KommerInfoInput name="First name" value={kommerUser.EName || '-'} />
          <KommerInfoInput name="Last name" value={kommerUser.lastname || '-'} />
          <KommerInfoInput name="Gender" value={kommerUser.Gender || '-'} />
          <KommerInfoInput name="Card number type" value={kommerUser.card_number_type || '-'} />
          <KommerInfoInput name="Card number" value={kommerUser.Card || '-'} />
          <KommerInfoInput name="Password" value={kommerUser.Password || '-'} />
          <KommerInfoInput name="Group" value={`${group.users[0]?.departmentNumber} ${group.users[0]?.departmentName}`} />
          <KommerInfoInput name="Door delay" value={kommerUser.delayed_door_open || '-'} />
          <KommerInfoInput name="Self password" value={kommerUser.selfpassword || '-'} />
          <KommerInfoInput name="Super user" value={kommerUser.acc_super_auth || '-'} />
          <KommerInfoInput name="Permissions" value={kommerUser.level_name || '-'} />
          <KommerInfoInput name="All permissions" value={permisions ? "Yes" : "No"} />
        </section>
        <section className="flex flex-col gap-2">
            <KommerInfoInput name="City" value={kommerUser.City || '-'} />
            <KommerInfoInput name="PESEL" value={kommerUser.identitycard || '-'} />
            <KommerInfoInput name="Phone" value={kommerUser.Tele || '-'} />
            <KommerInfoInput name="Hire type (RCP czy cos takiego)" value={kommerUser.hiretype || '-'} />
            <KommerInfoInput name="Emptype (RCP admin czy cos takiego)" value={kommerUser.emptype || '-'} />
            <KommerInfoInput name="RCP password" value={kommerUser.FPHONE || '-'} />
            <KommerInfoInput name="Additional information" value={kommerUser.Mobile || '-'} />
            <KommerInfoInput name="Birthday" value={kommerUser.Birthday || '-'} />
            <KommerInfoInput name="Email" value={kommerUser.email || '-'} />
            <KommerInfoInput name="Hired day" value={kommerUser.Hiredday || '-'} />
            <KommerInfoInput name="Home address" value={kommerUser.homeaddress || '-'} />
            <KommerInfoInput name="Hire address" value={kommerUser.Address || '-'} />
        </section>
      </div>
    </div>
  );
};

export default page;
