import UserContext from '@/context/UserContext';
import { userInfo } from '@/utils/types';
import { updateUser } from '@/utils/util';
import React, { ChangeEvent, useContext, useRef, useState } from 'react';
import { errorAlert, successAlert } from '../others/ToastGroup';
import UserImg from '@/../public/assets/images/user-avatar.png';
import Image from 'next/image';

interface ModalProps {
  data: userInfo;
}

const Modal: React.FC<ModalProps> = ({ data }) => {
  const { setProfileEditModal, setImageUrl, setUser, user } = useContext(UserContext);
  const [index, setIndex] = useState<userInfo>(data);
  const [imagePreview, setImagePreview] = useState<string | null>(data.avatar || null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIndex({ ...index, [e.target.id]: e.target.value });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      const url = URL.createObjectURL(file);
      setFileName(file.name || ''); // Ensure it's always a string
      setImagePreview(url); // URL.createObjectURL always returns a string
    }
  };

  const sendUpdate = async () => {
    try {
      let uploadedUrl: string = index.avatar || ''; // Ensure it starts as a string

      if (imagePreview && imagePreview !== index.avatar) {
        const uploadResult = await uploadImage(imagePreview);
        uploadedUrl = uploadResult || ''; // If uploadImage returns false, fallback to an empty string
      }

      const updatedUser = {
        ...index,
        avatar: uploadedUrl,
      };

      const result = await updateUser(index._id, updatedUser);

      if (result.error) {
        errorAlert('Failed to save the data.');
      } else {
        successAlert('Successfully updated.');
        setUser(updatedUser);
        setProfileEditModal(false);
      }
    } catch (error) {
      errorAlert('An error occurred while updating your profile.');
    }
  };


  const uploadImage = async (image: string): Promise<string> => {
    // Your logic here
    const uploadSuccess = true; // Example logic
    return uploadSuccess ? 'uploaded-image-url' : '';
  };

  return (
    <div className="fixed w-full inset-0 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="flex w-full max-w-[300px] sm:max-w-xl flex-col p-6 rounded-md gap-3 bg-[#0b192f] border-[1px] border-[#64ffda] text-white relative">
        <button
          onClick={() => setProfileEditModal(false)}
          className="absolute top-2 right-2 text-[#64ffda]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-center text-2xl font-bold">Edit Profile</h2>
        <div className="w-full flex flex-col">
          <label className="block text-lg font-medium" htmlFor="name">
            Username:
          </label>
          <input
            className="w-full p-2 rounded-lg outline-none bg-transparent border-[1px] border-[#64ffda]"
            type="text"
            id="name"
            value={index.name || ''}
            onChange={handleChange}
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
              className="w-full p-2 rounded-lg outline-none bg-transparent border-[1px] border-[#64ffda] text-center text-white cursor-pointer hover:bg-white hover:text-black transition mx-auto flex"
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

          {imagePreview ? (
            <div className="w-48 h-48 rounded-lg overflow-hidden justify-center mx-auto border-[#64ffda] border-[1px]">
              <img
                src={imagePreview as string} // Ensure it's a string
                alt="Selected Preview"
                className="flex object-cover w-full h-full mx-auto"
              />
            </div>
          ) : (
            <div className="w-48 h-48 border rounded-lg overflow-hidden p-3">
              <Image
                src={UserImg}
                alt="Default Avatar"
                className="flex object-cover w-full h-full rounded-full mx-auto border-[#64ffda] border-[1px]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-around">
          <button
            className="mt-2 px-4 py-2 bg-custom-gradient text-white rounded-md"
            onClick={sendUpdate}
          >
            Save
          </button>
          <button
            className="mt-2 px-4 py-2 bg-custom-gradient text-white rounded-md"
            onClick={() => setProfileEditModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
