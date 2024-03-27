import React from "react";
import { AiFillYoutube, AiFillGithub } from "react-icons/ai";
import { FaAngleRight, FaDiscord } from "react-icons/fa";
import Container from "./Container";
import { IconAlignBoxTopRight } from "@tabler/icons-react";

function Footer() {
  return (
    <footer className="pt-8 pb-20">
      <Container className="flex flex-col gap-8 justify-center lg:flex-row lg:justify-between items-center ">
        <div className=" flex gap-5">
          <a href="#" className="navlink flex gap-1 items-center">
            Documentation
            <FaAngleRight opacity={0.5} />
          </a>

          <a
            className="navlink flex gap-1 items-center"
            href="mailto:info@aixplora.app"
          >
            Contact
            <FaAngleRight opacity={0.5} />
          </a>
        </div>

        <div className=" flex flex-row items-center gap-x-6">
          <a href="https://discord.gg/M2AuGZvgHq" className="hover:opacity-50">
            <FaDiscord className="cursor-pointer" size="28px" />
          </a>
          <a
            href="https://www.youtube.com/@patrick-gerard/videos"
            className="hover:opacity-50"
          >
            <AiFillYoutube className="cursor-pointer" size="28px" />
          </a>
          <a
            href="https://github.com/grumpyp/aixplora"
            className="hover:opacity-50"
          >
            <AiFillGithub className="cursor-pointer" size="28px" />
          </a>
        </div>

        <div className="text-center opacity-50">
          © 2024 AIxplora. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
