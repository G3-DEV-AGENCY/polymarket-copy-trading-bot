import UserContext from '@/context/UserContext';
import { coinInfo, replyInfo, tradeInfo, userInfo } from '@/utils/types';
import { postReply, updateUser, uploadImage } from '@/utils/util';
import React, { ChangeEvent, useContext, useMemo, useRef, useState } from 'react';
import { errorAlert, successAlert } from '../others/ToastGroup';
import ImgIcon from "@/../public/assets/images/imce-logo.jpg";

import Image from 'next/image';

interface ModalProps {
  data: coinInfo;
}

const ReplyModal: React.FC<ModalProps> = ({ data }) => {
  const { postReplyModal, setPostReplyModal, user } = useContext(UserContext);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const replyPost = async () => {
    let reply: replyInfo;
    if (imageUrl) {
      const url = await uploadImage(imageUrl);
      if (url && user._id) {
        console.log("user._id: ", user._id)
        console.log("url: ", url)

        reply = {
          coinId: data._id,
          sender: user._id,
          msg: msg,
          img: url
        }
      }
    } else {
      if (user._id) {
        reply = {
          coinId: data._id,
          sender: user._id,
          msg: msg,
        }
      }
    }
    handleModalToggle();
    await postReply(reply);
  }

  const handleModalToggle = () => {
    setPostReplyModal(!postReplyModal);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        successAlert('Please select a valid image file.');
        return;
      }
      const url = URL.createObjectURL(file);
      setFileName(file.name || ''); // Ensure it's always a string
      setImageUrl(url); // URL.createObjectURL always returns a string
    }
  };

  const uploadImage = async (image: string): Promise<string> => {
    // Your logic here
    const uploadSuccess = true; // Example logic
    return uploadSuccess ? 'uploaded-image-url' : '';
  };


  return (
    <div className='fixed w-full inset-0 flex items-center justify-center z-50 backdrop-blur-md'>
      <div className="flex w-full max-w-[300px] sm:max-w-xl flex-col p-6 rounded-md gap-3 bg-[#140B56] border-[1px] border-white text-white relative">
        <h2 className="text-center text-2xl font-bold">Post Reply</h2>
        <div className=" w-full px-2 flex flex-col">
          <label
            htmlFor="COMMIT  py-[20px]"
            className="block mb-2 text-sm font-medium text-white"
          >
            Commit :
          </label>
          <textarea
            id="msg"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none bg-transparent border-[1px] border-[#143F72] "
            placeholder="Add commit ..."
            required
          />
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between gap-3 md:pr-6">
          <div>
            <label
              htmlFor="fileUpload"
              className="block text-lg font-medium mb-2 text-white"
            >
              Upload Image:
            </label>
            <label
              htmlFor="fileUpload"
              className="w-full p-2 rounded-lg outline-none bg-transparent border-[1px] border-white text-center text-white cursor-pointer hover:bg-white hover:text-black transition mx-auto flex"
            >
              {fileName || 'Choose an Image'}
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>

          {imageUrl ? (
            <div className="w-48 h-48 border rounded-lg overflow-hidden justify-center mx-auto">
              <img
                src={imageUrl as string} // Ensure it's a string
                alt="Selected Preview"
                className="flex object-cover w-full h-full mx-auto"
              />
            </div>
          ) : (
            <div className="w-48 h-48 border rounded-lg overflow-hidden p-3">
              <Image
                src={ImgIcon}
                alt="Default Avatar"
                className="flex object-cover w-full h-full rounded-full mx-auto"
              />
            </div>
          )}
        </div>
        <div className="flex justify-around p-3">
          <button onClick={replyPost} className="mt-2 px-4 py-2 bg-custom-gradient text-white rounded-md">POST</button>
          <button onClick={handleModalToggle} className="mt-2 px-4 py-2 bg-custom-gradient text-white rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
