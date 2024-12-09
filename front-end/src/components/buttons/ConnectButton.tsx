"use client";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { successAlert, errorAlert, infoAlert } from "@/components/others/ToastGroup";
import base58 from "bs58";
import UserContext from "@/context/UserContext";
import { confirmWallet, walletConnect } from "@/utils/util";
import { userInfo } from "@/utils/types";
import { useRouter } from "next/navigation";
import { RiExchangeDollarLine } from "react-icons/ri";
import { VscDebugDisconnect } from "react-icons/vsc";
import { TbMoodEdit } from "react-icons/tb";

export const ConnectButton: FC = () => {
  const { user, setUser, login, setLogin, isLoading, setIsLoading } =
    useContext(UserContext);
  const { publicKey, disconnect, connect, signMessage } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const router = useRouter()

  const tempUser = useMemo(() => user, [user]);
  useEffect(() => {
    const handleClick = async () => {
      if (publicKey && !login) {
        const updatedUser: userInfo = {
          name: publicKey.toBase58().slice(0, 6),
          wallet: publicKey.toBase58(),
          isLedger: false,
        };
        await sign(updatedUser);
      }
    };
    handleClick();
  }, [publicKey, login]); // Removed `connect`, `wallet`, and `disconnect` to prevent unnecessary calls
  const sign = async (updatedUser: userInfo) => {
    try {
      const connection = await walletConnect({ data: updatedUser });
      if (!connection) return;
      if (connection.nonce === undefined) {
        const newUser = {
          name: connection.name,
          wallet: connection.wallet,
          _id: connection._id,
          avatar: connection.avatar,
        };
        setUser(newUser as userInfo);
        setLogin(true);
        return;
      }

      const msg = new TextEncoder().encode(
        `Nonce to confirm: ${connection.nonce}`
      );

      const sig = await signMessage?.(msg);
      const res = base58.encode(sig as Uint8Array);
      const signedWallet = { ...connection, signature: res };
      const confirm = await confirmWallet({ data: signedWallet });

      if (confirm) {
        setUser(confirm);
        setLogin(true);
        setIsLoading(false);
      }
      successAlert("Message signed.");
    } catch (error) {
      errorAlert("Sign-in failed.");
    }
  };

  const logOut = async () => {
    if (typeof disconnect === "function") {
      await disconnect();
    }
    // Initialize `user` state to default value
    setUser({} as userInfo);
    setLogin(false);
    localStorage.clear();
  };
  const handleToProfile = (id: string) => {
    router.push(id)
  }
  return (
    <div>
      <button className=" rflex flex-row gap-1 items-center justify-end text-white p-2 rounded-full border-[1px] border-[#64ffda] bg-none group relative ">
        {login && publicKey ? (
          <>
            <div className="flex items-center justify-center gap-2 text-[16px] lg:text-md">
              {(user.avatar !== undefined) && <img
                src={user.avatar}
                alt="Token IMG"
                className="rounded-full"
                width={35}
                height={35}
              />}
              <div className="">
                {publicKey.toBase58().slice(0, 4)}....
                {publicKey.toBase58().slice(-4)}
              </div>
              <TbMoodEdit onClick={() => handleToProfile(`/profile/${tempUser._id}`)} className="text-2xl" />
            </div>
            <div className="w-full absolute right-0 -bottom-[88px] hidden rounded-lg group-hover:block px-3">
              <ul className="border-[0.75px] border-[#64ffda] rounded-lg bg-none object-cover overflow-hidden bg-[#0D1524] ">
                <li>
                  <div
                    className="flex flex-row gap-1 items-center mb-1 text-primary-100 text-md p-2 hover:bg-white/10"
                    onClick={() => setVisible(true)}
                  >
                    <RiExchangeDollarLine />
                    Change Wallet
                  </div>
                </li>
                <li>
                  <div
                    className="flex gap-1 items-center text-primary-100 text-md p-2 hover:bg-white/10"
                    onClick={logOut}
                  >
                    <VscDebugDisconnect />
                    Disconnect
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center gap-1 text-md"
            onClick={() => setVisible(true)}
          >
            Connect Wallet
          </div>
        )}
      </button>
    </div>
  );
};
