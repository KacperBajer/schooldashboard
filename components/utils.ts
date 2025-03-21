import { redirect } from "next/navigation";

export const redirectPath = (permissions: any) => {
  const path = Object.keys(permissions)
    .filter((key) => key.startsWith("can_see_") && permissions[key])
    .map((key) => key.replace("can_see_", "")).map((key) => key.replace("_section", ""))[0];

  if (!path) redirect('/no-access')
  redirect(`/${path}`)
};

export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function formatDate(date: Date) {
  const pad = (num: any, size: any) => num.toString().padStart(size, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  
  return `${hours}:${minutes} ${day}-${month}-${year}`;
}