import React from 'react';
import { AppSidebar } from "@/components/sidebar/app-sidebar"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function Sidebar() {
    return (
        // <SidebarProvider>
        <>
          <AppSidebar />
         
        </>
      )
}

export default Sidebar
