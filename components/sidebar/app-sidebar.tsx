"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  referensiBerwisata: {
    content:"Referensi Berwisata",
    list:[
    {
      title: "👣 Perjalanan Orang Lain",
      url: "#",

    },
    {
      title: "🛏️ Hotel",
      url: "#",
    },
    {
      title: "🏖️ Tempat Wisata",
      url: "#",
    },
  ]
  },
  rencanaPerjalanan: {
    content:"Rencana Perjalanan Kamu",
    list:[
    {
      title: "🤖 Buatan AI",
      url: `/dashboard/mytrip-ai`,

    },
    {
      title: "✍🏻 Dibuat Manual",
      url: `/dashboard/myexperience-trip`,
    },
    {
      title: "📬 Perjalanan yang Dibagikan",
      url: "#",
    },
    {
      title: "📖 Bookmark",
      url: "#",
    },
    ]
  },
  buatPerjalanan: {
    content:"Buat Rencana Perjalanan",
    list:[
    {
      title: "🪄 Buat Menggunakan AI",
      url: "#",
    },
    {
      title: "✨ Buat Secara Manual",
      url: "#",
    },
    {
      title: "🗺️ Bagikan Pengalaman Kamu",
      url: "#",

    },
  ]
  },
  projects: [
    {
      name: "🤖 Buatan AI",
      url: "#",
    },
    {
      name: "✍🏻 Dibuat Manual",
      url: "#",
    },
    {
      name: "Perjalanan Dibagikan",
      url: "#",
    },
    {
      name: "📖 Bookmark",
      url: "#",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain content={data.referensiBerwisata.content} items={data.referensiBerwisata.list} />
        <NavMain content={data.rencanaPerjalanan.content} items={data.rencanaPerjalanan.list} />
        <NavMain content={data.buatPerjalanan.content} items={data.buatPerjalanan.list} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
