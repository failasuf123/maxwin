// @/components/PageNotFound.tsx 
import { MdErrorOutline } from "react-icons/md";

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        <MdErrorOutline className="text-red-500 text-7xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Maaf, halaman yang Anda cari tidak tersedia 
        </p>
        <a
          href="/"
          className="inline-block bg-gray-800 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
