import React from "react";
import Image from "next/image";
import Link from 'next/link';
import { AiFillYoutube } from "react-icons/ai";
import { FaDiscord } from 'react-icons/fa';
import logo from '../../public/logo.png';

function Navbar() {
  return (
    <header id="header" className="navbar flex flex-row w-full justify-between items-center pt-4">
      <div className="flex items-center">
      <Link href="/">
        <div className="logo mr-2">
          <Image className="logo_image" src={logo} alt="logo" width={70} height={70}/>
        </div>
      </Link>
      </div>
      <div className="socials_callto_action flex flex-row items-center gap-x-6">
      <Link href="/blog">
      <span className="font-bold text-lg md:text-xl">Blog</span> 
      </Link>
        <div className="buttons flex justify-evenly gap-x-1 items-center">
          <a href="https://cloud.aixplora.app">
            <button className="btn_3">
              <span className="text">Try for free</span>
            </button>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
