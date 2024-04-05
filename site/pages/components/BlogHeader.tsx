import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillYoutube } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import logo from "../../public/logo.svg";
import bg from "../../public/static/header-bg.svg";
import Container from "./Container";

function BlogHeader() {
  return (
    <header
      id="header"
      className="navbar flex flex-row w-full justify-between items-center pt-4"
    >
      <Image
        src={bg}
        width={0}
        height={0}
        alt=""
        className="absolute top-0 left-0 z-0"
      />
      <Container className="flex flex-row w-full justify-between items-center pt-4">
        <div className="flex items-center z-10">
          <Link href="/">
            <Image src={logo} alt="logo" width={50} height={50} />
          </Link>
        </div>
        <div className="socials_callto_action flex flex-row items-center gap-x-6 z-10">
          <Link href={"https://cloud.aixplora.app/register"} className="font-bold ">
            Register
          </Link>
          <Link
            href={"https://cloud.aixplora.app/login"}
            passHref
            className="buttons btn_3 flex justify-evenly gap-x-1 items-center"
          >
            Login
          </Link>
        </div>
      </Container>
    </header>
  );
}

export default BlogHeader;
