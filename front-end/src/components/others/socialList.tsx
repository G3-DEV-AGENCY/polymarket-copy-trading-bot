"use client"
import { coinInfo } from "@/utils/types";
import { FC, useContext, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const SocialList: FC = () => {

	return (
		<div className="flex flex-row gap-4 px-2 justify-center">
			<p className="text-2xl text-[#64ffda] bg-[#64ffda]/30 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/30 p-2 cursor-pointer rounded-full border-[1px] border-[#143F72]">
				<TbWorld />
			</p>
			<p className="text-2xl text-[#64ffda] bg-[#64ffda]/30 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/30 p-2 cursor-pointer rounded-full border-[1px] border-[#143F72]">
				<FaXTwitter />
			</p>
			<p className="text-2xl text-[#64ffda] bg-[#64ffda]/30 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/30 p-2 cursor-pointer rounded-full border-[1px] border-[#143F72]">
				<FaTelegramPlane />
			</p>
		</div>
	);
};

export default SocialList;
