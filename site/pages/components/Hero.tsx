import React from "react";
import Container from "./Container";
import Image from "next/image";
import heroImage from "../../public/static/aixplora-hero.png";
import bgBlurs from "../../public/static/bg-blurs.svg";
import { Parallax } from "react-scroll-parallax";
import useMediaQuery from "@/hooks/useMediaQuery";

function Hero() {
  const isWeb = useMediaQuery(1024);

  return (
    <section id="hero" className="min-h-screen relative">
      <Container>
        <div className="mx-auto text-center max-w-[54rem] relative z-[5]">
          <h1 className="mb-5">
            Never get stuck <span className="opacity-40">analyzing files</span>{" "}
            again. <span className="gradient-text">Let AIxplora help.</span>
          </h1>
          <p className="opacity-50 text-center mx-auto max-w-[35rem] mb-8 lg:text-xl ">
            AIxplora takes the grunt work out of file analysis, giving you back
            precious time
          </p>

          <div className="flex justify-center flex-col gap-3 lg:flex-row lg:items-center">
            <a href="https://github.com/grumpyp/aixplora">
              <button className="btn_1">Download for Mac</button>
            </a>

            <a href="https://www.dropbox.com/scl/fi/jnscprr2lvj1acr88xh09/AIxplora-Setup-0.0.2.exe?rlkey=0cl3xsmgqmzyo8o1rov08gcnl&dl=0">
              <button className="btn_2">Download for Windows</button>
            </a>
          </div>
        </div>

        <Parallax className="relative z-[5]" translateY={isWeb ? [10, -10] : [60, -60]}>
          <figure className="relative z-[5]">
            <Image src={heroImage} alt="AIxplora dashboard" />
          </figure>
        </Parallax>
      </Container>
      <figure className="absolute left-0 top-[10%] w-[100vw]">
        <Image src={bgBlurs} alt="blurs" />
      </figure>
    </section>
  );
}

export default Hero;
