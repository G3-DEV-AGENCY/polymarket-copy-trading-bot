"use client";
import { FC, useContext, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import UserContext from "@/context/UserContext";
import TimeTranding from "../buttons/TimeTranding";
import { CiFilter } from "react-icons/ci";
import switchOn from "@/../public/assets/images/switch-on.png";
import switchOff from "@/../public/assets/images/switch-off.png";
import { BiSearchAlt } from "react-icons/bi";
import { coinInfo } from "@/utils/types";
import FilterListButton from "../others/FilterListButton";

const FilterList: FC = () => {
  // const {
  //   filterState,
  //   setFilterState,
  //   nsfwFilterState,
  //   setNsfwFilterState,
  // } = useContext(UserContext);

  const [filterState, setFilterState] = useState<boolean>(false)
  const [nsfwFilterState, setNsfwFilterState] = useState<boolean>(false)

  const [token, setToken] = useState("");



  const searchToken = () => { };

  return (
    <div className="w-full gap-4 h-full flex flex-col text-white px-2 pt-4">
      <div className="flex flex-col md:flex-row gap-3">
        <TimeTranding />
        <FilterListButton />
      </div>
      <div className="flex flex-col sm2:flex-row w-full h-full gap-4 justify-between">
        <div className="hidden sm2:flex flex-row items-center">
          <div
            onClick={() => setFilterState(false)}
            className={`border-b-[2px] px-4 py-1 text-base cursor-pointer ${filterState ? "border-b-[#143F72]" : "border-b-[#64ffda]"
              }`}
          >
            Following
          </div>
          <div
            onClick={() => setFilterState(true)}
            className={`border-b-[2px] px-4 py-1 text-base cursor-pointer ${filterState ? "border-b-[#64ffda]" : "border-b-[#143F72]"
              }`}
          >
            Terminal
          </div>
        </div>
        <div className="w-full flex flex-col xs:flex-row gap-2">
          <div className="min-w-[169px] flex flex-row items-center gap-2 px-3 py-1 border-[1px] border-[#64ffda] rounded-lg mx-auto">
            Include NSFW
            {<Image
              src={nsfwFilterState ? switchOn : switchOff}
              alt=""
              onClick={() => setNsfwFilterState(!nsfwFilterState)}
              className="cursor-pointer"
            />}
          </div>
          <div className="w-full max-w-[720px] flex flex-row items-center gap-1 pl-2 border-[1px] border-[#64ffda] rounded-lg text-white">
            <BiSearchAlt className="text-4xl text-[#64ffda]" />
            <input
              type="text"
              value={token}
              placeholder=" Search for Token"
              onChange={(e) => setToken(e.target.value)}
              className=" bg-grey-400 w-full py-1 outline-none bg-transparent"
            />
            <button
              className="w-[100px] h-[40px] rounded-r-lg px-2 bg-slate-800 active:bg-opacity-70 bg-custom-gradient"
              onClick={searchToken}
            >
              Search
            </button>
          </div>
        </div>
        <div className="sm2:hidden flex flex-row items-center mx-auto">
          <div
            onClick={() => setFilterState(false)}
            className={`border-b-[2px] px-4 py-1 text-base cursor-pointer ${filterState ? "border-b-[#143F72]" : "border-b-[#2C8DFE]"
              }`}
          >
            Following
          </div>
          <div
            onClick={() => setFilterState(true)}
            className={`border-b-[2px] px-4 py-1 text-base cursor-pointer ${filterState ? "border-b-[#2C8DFE]" : "border-b-[#143F72]"
              }`}
          >
            Terminal
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterList;
