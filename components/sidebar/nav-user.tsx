"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";
import {saveUserToFirestore} from "@/components/service/signin/saveUserToFirestore"
import {updateUserProfilePictureIfChanged} from "@/components/service/signin/updateUserProfilePictureIfChanged"
import {
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FcGoogle } from "react-icons/fc";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const [users, setUsers] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigation = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsers(JSON.parse(storedUser));
    }
  }, []);



  const login = useGoogleLogin({
    onSuccess: (codeResp) => getUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const getUserProfile = async (tokenInfo: any) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      );
  
      const userData = response.data;
      console.log("User Response:", response);
  
      // Simpan data user ke localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.getItem("user")
  
      localStorage.setItem("user", JSON.stringify(response.data));
      const userDataGet = response.data;
      const userId = userDataGet.id;
      const username = userDataGet.name;
      console.log(
        `username:${username} \n
        userId:${userId}`
      )
      // Simpan data user ke Firestore (jika belum ada)
      await saveUserToFirestore(userData);
  
      // Perbarui URL foto profil di Firestore jika berbeda
      await updateUserProfilePictureIfChanged(userData.id, userData.picture);
  
      // Tutup dialog setelah proses selesai
      setOpenDialog(false);
  
      // Reload halaman setelah semua proses selesai
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  

  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {users ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-9 w-9 rounded-xl">
                  <AvatarImage src={users?.picture} alt={users?.name} />
                  <AvatarFallback className="rounded-lg">
                    <img src="/default-picture.png" alt="default" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight md:hidden">
                  <span className="truncate font-semibold">{users?.name}</span>
                  <span className="truncate text-xs">{users?.email}</span>
                </div>
                {/* <ChevronsUpDown className="ml-auto size-4" /> */}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={users?.picture} alt={users?.name} />
                    <AvatarFallback className="rounded-lg">
                      <img src="/default-picture.png" alt="" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {users?.name}
                    </span>
                    <span className="truncate text-xs">{users?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                  // navigation.push("/")
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center justify-center bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  <div className="h-8 wi-8 rounded-lg flex items-center">
                    <FcGoogle className="h-6 w-6" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Sign In</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        )}
      </SidebarMenuItem>
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white w-96 p-6 rounded-lg shadow-lg">
            {/* Tombol X di pojok kanan atas */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenDialog(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">Sign In With Google</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sign In dengan aman menggunakan Google Authentication.
            </p>
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-gray-900 rounded hover:bg-blue-600"
              onClick={() => login()}
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Sign In With Google
            </button>
          </div>
        </div>
      )}

      {/* <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <h2 className="font-bold  text-lg mt-7">Sign In With Google</h2>
              <p className=" mt-1">
                Sign In dengan aman menggunakan google authentication
              </p>
              <Button
                className="w-full mt-5"
                onClick={() => login()}
              >
                <>
                  <FcGoogle className="mr-3 h-6 w-6" /> Sign In With Google
                </>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </SidebarMenu>
  );
}
