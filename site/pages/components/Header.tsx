import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { useCallback, useState } from "react";

import hamburger from "../../public/icons/hamburger.svg";
import close from "../../public/icons/hamburger-close.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className={`relative my-4`}>
      <div
        className={`flex justify-between items-center max-w-7xl px-5 py-10 rounded-[2rem] mx-auto lg:(p-16)`}
      >
        <Link href="/">
          <div>
            <Image src={logo} alt="AIXplora logo" />
          </div>
        </Link>

        <div className=" hidden lg:block">
          <nav className="flex items-center gap-5">
            <Link href={"/blog"} className="navlink transition-all">
              Blog
            </Link>

            <a href="https://cloud.aixplora.app">
              <button className="btn_3">
                <span className="gradient-text">Try for free</span>
              </button>
            </a>
          </nav>
        </div>

        <div className="relative lg:hidden">
          <button onClick={toggleMenu}>
            <Image src={menuOpen ?  close : hamburger} alt="Menu" />
          </button>
        </div>
      </div>
    </header>
  );
}
