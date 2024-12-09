"use client";
import HomePage from "@/components/home";

export default function Home() {

  return (
    <div className="w-full h-full min-h-[calc(100vh-100px)] flex flex-col">
      <div className="max-w-[1240px] mx-auto w-full">
        <HomePage />
      </div>
    </div>
  );
}
