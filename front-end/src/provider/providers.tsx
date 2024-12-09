"use client";
import React, { ReactNode, useState } from "react";
import { PageProvider } from "@/contexts/PageContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletProvider";
import { QueryClientProvider, QueryClient } from "react-query";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "@/contexts/ModalProvider";
import UserContext from "@/context/UserContext";
import { msgInfo, userInfo } from "@/utils/types";
import "dotenv/config.js";
import LoginContext from "@/context/CoinContex";
import { useWallet } from "@solana/wallet-adapter-react";
import SocketProvider from "@/contexts/SocketContext";

export const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [user, setUser] = useState<userInfo>({} as userInfo);
  const [login, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('/*.png');
  const [isCreated, setIsCreated] = useState(false);
  const [messages, setMessages] = useState<msgInfo[]>([]);
  const [coinId, setCoinId] = useState<string>('');
  const [newMsg, setNewMsg] = useState<msgInfo>({} as msgInfo);
  const [solPrice, setSolPrice] = useState<number>(0);
  const [profileEditModal, setProfileEditModal] = useState<boolean>(false);
  const [postReplyModal, setPostReplyModal] = useState<boolean>(false);

  return (
    <SolanaWalletProvider>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <PageProvider>
            <UserContext.Provider
              value={{
                solPrice,
                setSolPrice,
                newMsg,
                setNewMsg,
                coinId,
                setCoinId,
                messages,
                setMessages,
                isCreated,
                setIsCreated,
                imageUrl,
                setImageUrl,
                user,
                setUser,
                login,
                setLogin,
                isLoading,
                setIsLoading,
                profileEditModal,
                setProfileEditModal,
                postReplyModal,
                setPostReplyModal
              }}
            >
              <SocketProvider>
                {children}
              </SocketProvider>
              <ToastContainer pauseOnFocusLoss={false} theme="colored" />
            </UserContext.Provider>
          </PageProvider>
        </ModalProvider>
      </QueryClientProvider>
    </SolanaWalletProvider>
  );
}
