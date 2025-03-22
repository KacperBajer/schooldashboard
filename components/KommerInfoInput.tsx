import React from "react";

type Props = {
    name: string
    value: string
}

const KommerInfoInput = ({name, value}: Props) => {
  return (
    <div>
      <p className="ml-1 mb-1 text-xs text-gray-300">{name}</p>
      <div className="border border-border rounded-md px-3 py-1 bg-secondary-background/40 w-full max-w-[350px]">
        <p>{value}</p>
      </div>
    </div>
  );
};

export default KommerInfoInput;
