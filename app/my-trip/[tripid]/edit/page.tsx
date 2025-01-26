"use client";

import EditMain from "@/components/edit/EditMain";
import React from "react";


interface PageProps {
  params: Promise<{
    tripid: string;
  }>;
}
const Page: React.FC<PageProps> = ({ params }) => {
  const { tripid } = React.use(params);

  return (
    <EditMain tripidProps={tripid} typeProps={"editTrip"}  />
  );
};

export default Page;