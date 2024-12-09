"use client"
import React, { ChangeEvent, useRef, useState } from "react";

interface ImageUploadProps {
  header: string;
  setFilePreview: (filePreview: string | null) => void;
  type: string;
  setFileUrl: (fileUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ header, setFilePreview, setFileUrl, type }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("No file selected");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFilePreview(URL.createObjectURL(file)); // Pass the file name or URL to the parent
      setFileUrl(URL.createObjectURL(file))
    } else {
      setSelectedFileName("No file selected");
      setFilePreview(null);
      setFileUrl(null)
    }
  };

  return (
    <div className="w-full flex flex-col justify-between gap-6">
      <div className="w-full justify-between flex flex-col items-start gap-2">
        <label className="block text-lg font-semibold text-white">{header}</label>
        <input
          type="file"
          accept={type}
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-full h-full flex flex-row justify-between gap-4 items-center">
          <div className="w-full py-2 px-3 bg-gray-800 rounded-lg min-h-10 text-white border-[#64ffda] border-[1px]">
            {selectedFileName}
          </div>
          <button
            className="py-2 px-4 bg-gray-700 text-white rounded-lg border-[#64ffda] border-[1px]"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse...
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;