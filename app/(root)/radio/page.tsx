'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/radio/1')
  })

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="bg-surface border border-border p-4 rounded-lg flex-1 flex flex-col max-h-[calc(100vh-134px)]"></div>
    </div>
  );
};

export default page;
