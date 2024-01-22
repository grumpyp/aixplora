import React from "react";
import Image from "next/image";
import { AiFillYoutube } from "react-icons/ai";
import { FaDiscord } from 'react-icons/fa';
import logo from '../../public/logo.png';

function Navbar() {
  return (
    <header id="header" className="navbar flex flex-row w-full justify-between items-center pt-4">
      <div className="logo">
        <Image className="logo_image" src={logo} alt="logo" width={70} height={70}/>
      </div>
      <div className="socials_callto_action flex flex-row items-center gap-x-6">
        <a href="https://discord.gg/M2AuGZvgHq"><FaDiscord color="white" className="cursor-pointer" size={"28px"}/></a>
        <a href="https://www.youtube.com/@patrick-gerard/videos"><AiFillYoutube color="white" className="cursor-pointer" size={"28px"}/></a>
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
