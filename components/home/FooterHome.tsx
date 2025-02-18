import React from 'react';

function FooterHome() {
  return (
    <footer className="w-full h-24 bg-gray-100 flex items-center flex-col md:flex-row justify-between px-6 py-3 md:py-0">
      {/* Logo Dummy */}
      <div className="flex items-center space-x-2">
        <img className="w-36 md:w-44" src="/malib-logo-long.png" alt="" />
      </div>

      {/* Info Hak Cipta */}
      <div className="text-gray-600 text-xs md:text-sm">
        © {new Date().getFullYear()} Mauliburan. All rights reserved.
      </div>

      {/* Email */}
      <div className="text-gray-700 text-xs md:text-sm">
        Contact us: <a href="mauliburan.com@gmail.com" className="text-gray-6--">mauliburan.com@gmail.com</a>
      </div>
    </footer>
  );
}

export default FooterHome;
