import React from "react";
import { AiFillYoutube } from "react-icons/ai";
import { FaDiscord } from 'react-icons/fa';

function Footer() {
  return (
    <div className="mt-8">
      <footer className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg">
        <div className="footer-left flex flex-col">
          <a href="#" className="mb-2">Documentation</a>
          <a href="mailto:info@aixplora.app">Contact</a>
        </div>
        <div className="footer-right flex flex-row items-center gap-x-6">
          <a href="https://discord.gg/M2AuGZvgHq">
            <FaDiscord className="cursor-pointer" size="28px"/>
          </a>
          <a href="https://www.youtube.com/@patrick-gerard/videos">
            <AiFillYoutube className="cursor-pointer" size="28px"/>
          </a>
        </div>
      </footer>
      <div className="text-center text-white mt-4">© 2024 AIxplora. All rights reserved.</div>
    </div>
  );
}

export default Footer;
