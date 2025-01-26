"use client";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import ItineraryList from "@/components/home/ItineraryList";
import { useSearchParams } from "next/navigation";

export default function ItineraryListPage() {
return(
      <div className="max-w-screen px-5 md:px-8 lg:px-12 xl:px-16">
        <Suspense>

          <ItineraryList typeParams={"explore-itinerary"} />
        </Suspense>
      </div>

);}

  // return (
  //   <Suspense >
  //     <div className="max-w-screen px-5 md:px-8 lg:px-12 xl:px-16">
  //       {cityParam && (
  //         <ItineraryList searchParams={cityParam} typeParams={"explore-itinerary"} />
  //       )}
  //     </div>
  //   </Suspense>
  // );
// }



// import React from 'react'

// function page() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default page

