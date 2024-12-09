import { HiOutlinePuzzle } from "react-icons/hi";
import { TbWorld } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

interface CoinBlogProps {
  text: string;
  data: string | number;
}

export const DataCard: React.FC<CoinBlogProps> = ({ text, data }) => {

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 py-3 rounded-lg border-[1px] border-[#64ffda]">
      <p className="font-medium">{text}</p>
      <p className="font-semibold">
        {data}
      </p>
    </div>
  );
};
