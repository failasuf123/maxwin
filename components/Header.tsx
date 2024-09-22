import React from 'react'
import Logo from './Logo'

function Header() {
  return (
    <div>
        <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
            <Logo/>
            <div className="flex  items-center gap-4">
                {/* <ThemeModeButton /> */}
                {/* <UserButton afterSignOutUrl="/sign-in"/> */}
            </div>
        </nav>
      
    </div>
  )
}

export default Header
