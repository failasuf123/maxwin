import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
      <div>
          <Link href={"/"} className="font-bold text-xl bg-gradient-to-r from-red-400 to-blue-400 text-transparent bg-clip-text hover:cursor-pointer">
            <img src="/tripio-logo.png" height={40} width={120}/>
          </Link>
      </div>
  )
}

export default Logo
