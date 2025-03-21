import React, { InputHTMLAttributes } from "react";

type Props = {
    checked: boolean
    onChange: () => void
    disabled: boolean
} & InputHTMLAttributes<HTMLInputElement>

const Toggle = ({checked, onChange, disabled, ...props}: Props) => {
  return (
    <label className={`inline-flex items-center ${disabled ? "cursor-default" :  "cursor-pointer"}`}>
      <input disabled={disabled} {...props} type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="relative w-11 h-6 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );
};

export default Toggle;
