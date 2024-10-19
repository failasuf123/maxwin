'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import axios from 'axios'


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { FcGoogle } from 'react-icons/fc';

function Header() {
    const [users, setUsers] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const navigation = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUsers(JSON.parse(storedUser));
        }
    }, []);

    const login=useGoogleLogin({
        onSuccess:(codeResp)=>getUserProfile(codeResp),
        onError:(error)=>console.log(error),
      })

      const getUserProfile = (tokenInfo:any) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
          headers:{
            Authorization:`Bearer ${tokenInfo?.access_token}`,
            Accept:'Application/json'
          }
        }).then((response)=>{
          console.log(response)
          localStorage.setItem('user', JSON.stringify(response.data))
          setOpenDialog(false)
          window.location.reload();
        })
      }



    return (
        <div>
            <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
                <div>
                    <Link href={"/"} className="font-bold text-xl bg-gradient-to-r from-red-400 to-blue-400 text-transparent bg-clip-text hover:cursor-pointer">
                        <img src="/tripio-logo.png" height={40} width={120} alt="Tripio Logo"/>
                    </Link>
                </div>
                <div className=" ">
                    {users ?
                        <div className="flex items-center gap-2 md:gap-4 ">
                            <Link href="/mytrip">
                            <Button variant="outline" className="border-2 px-4 py-2 rounded-xl cursor-pointer hover:scale-95" >My Trip</Button>
                            </Link>
                            <Popover>
                                <PopoverTrigger>
                                    <img src={users?.picture} alt="" className="h-[35px] w-[35px] rounded-full"/>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 items-center flex justify-center">
                                    <Button 
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => {
                                            googleLogout();
                                            localStorage.clear();
                                            window.location.reload();
                                            // navigation.push("/")
                                        }}
                                        >
                                        Logout
                                    </Button>
                                </PopoverContent>
                            </Popover>

                        </div>
                        :
                        <div>
                            <Button 
                                onClick={() => {
                                    setOpenDialog(true);
                                }}
                                className="text-white bg-gray-800 px-4 py-2 rounded-xl cursor-pointer hover:scale-95"
                                >
                                Sign In
                            </Button>
                        </div>
                    }
                </div>
            </nav>
            <Dialog open={openDialog}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                    <h2 className="font-bold  text-lg mt-7">Sign In With Google</h2>
                    <p className=" mt-1">Sign In dengan aman menggunakan google authentication</p>
                    <Button 
                        // disabled={loading}
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
            </Dialog>
        </div>
    );
}

export default Header;

