import { msgInfo, userInfo } from "@/utils/types";

interface MessageFormProps {
  msg: msgInfo;
}

export const MessageForm: React.FC<MessageFormProps> = ({ msg }) => {
  return (
    <div className="py-2 flex flex-col">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center px-1">
          <img
            src={(msg.sender as userInfo)?.avatar}
            alt="Token IMG"
            className="rounded-full"
            width={32}
            height={32}
          />
          <div className="text-sm text-gray-300">
            {msg.sender && (msg.sender as userInfo).name}
          </div>
          {msg.time && <div className="text-sm text-gray-300">{msg.time.toString()}</div>}
        </div>
        <div className="flex flex-row w-full border-[1px] border-[#143F72] rounded-lg object-cover overflow-hidden gap-1 items-start justify-start">
          {msg.img !== undefined && (
            <img
              src={msg.img}
              className="mr-5"
              alt="Token IMG"
              width={200}
              height={300}
            />
          )}
          <div className="w-full h-full flex flex-col text-white font-semibold py-3 text-sm px-3">
            {msg.msg}
          </div>
        </div>
      </div>
    </div>
  );
};
