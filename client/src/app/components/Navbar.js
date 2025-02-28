import React from "react";
import Link from "next/link";

const Navbar = () => {

    const handleLogout = () => {
        sessionStorage.removeItem("jwt"); // ❌ ลบ JWT ออกจาก sessionStorage
        axData.jwt = null; // ❌ อัปเดต axData
        router.push("/login"); // 🔥 กลับไปหน้า Login
      };
      
    return (
        <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md py-4 bg-white md:top-0 lg:max-w-full">
            <div className="px-10">
                <div className="flex items-center justify-between">
                    <div className="flex shrink-0">
                        <Link href="/dashboard" className="flex items-center">
                            <h2 className="font-bold text-3xl text-gray-700">
                                CAR{" "}
                                <span className="bg-[#FF8295] text-white px-2 rounded-md">
                                    TALLY
                                </span>
                            </h2>
                        </Link>
                        <p className="sr-only">Website Title</p>
                    </div>
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                        
                    </div>
                    <div className="flex items-center justify-end gap-3">
                    <a aria-current="page"
                            className="inline-block rounded-lg px-2 py-1 text-lg font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                            href="#">วิดีโอย้อนหลัง</a>
                        <a className="inline-block rounded-lg px-2 py-1 text-lg font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                            href="#">การวิเคราะห์</a>
                        {/* <a className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                            href="/login">Sign in</a> */}
                        <a
                            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            href="/login" onClick={handleLogout}
                        >
                            ลงชื่อออก
                        </a>
                    </div>
                </div>
            </div>
        </header>
        // <nav className="bg-yellow-50 border-b border-gray-200 fixed z-30 w-full">
        //     <div className="px-3 py-3 lg:px-5 lg:pl-3">
        //         <div className="flex items-center justify-between">
        //             <div className="flex items-center justify-start">
        //                 <button
        //                     id="toggleSidebarMobile"
        //                     aria-expanded="true"
        //                     aria-controls="sidebar"
        //                     className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
        //                 >
        //                     <svg
        //                         id="toggleSidebarMobileHamburger"
        //                         className="w-6 h-6"
        //                         fill="currentColor"
        //                         viewBox="0 0 20 20"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <path
        //                             fillRule="evenodd"
        //                             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        //                             clipRule="evenodd"
        //                         ></path>
        //                     </svg>
        //                     <svg
        //                         id="toggleSidebarMobileClose"
        //                         className="w-6 h-6 hidden"
        //                         fill="currentColor"
        //                         viewBox="0 0 20 20"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <path
        //                             fillRule="evenodd"
        //                             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        //                             clipRule="evenodd"
        //                         ></path>
        //                     </svg>
        //                 </button>

        // <Link href="/dashboard">
        //     <h2 className="font-bold text-3xl">
        //         CAR{" "}
        //         <span className="bg-[#FF8295] text-white px-2 rounded-md">
        //             TALLY
        //         </span>
        //     </h2>
        // </Link>
        //             </div>
        //             <div className="flex items-center">
        //                 <div className="hidden lg:flex items-center"></div>
        //                 <Link
        //                     href="#"
        //                     className="hidden sm:inline-flex ml-5 text-white bg-[#FF8295] hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3"
        //                 >
        //                     Login
        //                 </Link>
        //             </div>
        //         </div>
        //     </div>
        // </nav>
    );
};

export default Navbar;
