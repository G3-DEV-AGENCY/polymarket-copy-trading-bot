"use client"
import * as React from "react";
import { Range } from "react-range";
import { BiSolidUpArrow } from "react-icons/bi";

interface SellTaxRangeProps {
  header: string;
  setSelectRange: (tokenNumber: number[]) => void;
}

const SellTaxRange: React.FC<SellTaxRangeProps> = ({ header, setSelectRange }) => {
  const [values, setValues] = React.useState<number[]>([20, 80]); // Two values for min and max

  const handleChangeRange = (e: number[]) => {
    setValues(e)
    setSelectRange(e)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <label className="text-lg font-semibold text-white">
        {header}
      </label>
      <Range
        step={1}
        min={0}
        max={100}
        values={values}
        onChange={(values) => handleChangeRange(values)}
        renderTrack={({ props, children }) => {
          const [min, max] = values;

          return (
            <div
              {...props}
              className="relative h-1 w-full bg-white rounded"
            >
              <div
                style={{
                  position: "absolute",
                  left: `${min}%`,
                  right: `${100 - max}%`,
                  backgroundColor: "#64ffda",
                }}
                className="h-1 rounded"
              />
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="flex flex-col items-center justify-center text-[#64ffda] font-semibold gap-1 outline-none"
          >
            <div className="text-sm">
              {index === 0 ? `${values[0]}%` : `${values[1]}%`}
            </div>
            <BiSolidUpArrow
              className="text-2xl"
              style={{ color: "#64ffda" }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default SellTaxRange;
