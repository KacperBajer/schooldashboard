import KommerTable from "@/components/KommerTable";
import KommerTopBar from "@/components/KommerTopBar";
import { getKommerUsers } from "@/lib/kommer";
import React from "react";

const page = async ({ params, searchParams }: any) => {
  const { p, lname, fname, id, cardid, group } = await searchParams;

  const kommerUsers = await getKommerUsers(
    Number(p) || 1,
    id,
    fname,
    lname,
    cardid,
    group
  );


  return (
    <div className="p-4 md:pl-0">
      <KommerTopBar page={p || '1'} pageCount={kommerUsers.pageCount} />
      <KommerTable
        cardid={cardid}
        fname={fname}
        group={group}
        id={id}
        lname={lname}
        data={kommerUsers.users}
      />
    </div>
  );
};

export default page;
