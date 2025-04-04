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

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export function peselDecode(pesel: string) {

  let year=parseInt(pesel.substring(0,2),10);
  let month = parseInt(pesel.substring(2,4),10)-1;
  let day = parseInt(pesel.substring(4,6),10);

  if(month>80) {
    year = year + 1800;
    month = month - 80;
  }
  else if(month > 60) {
    year = year + 2200;
    month = month - 60;
  }
  else if (month > 40) {
    year = year + 2100;
    month = month - 40;
  }
  else if (month > 20) {
    year = year + 2000;
    month = month - 20;
  }
  else
  {
    year += 1900;
  }

  let birthday=new Date();
  birthday.setFullYear(year, month, day);
  const dayFormated = String(birthday.getDate()).padStart(2, '0');
  const monthFormated = String(birthday.getMonth() + 1).padStart(2, '0');
  return `${dayFormated}.${monthFormated}.${birthday.getFullYear()}`
}

export const convertToBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
