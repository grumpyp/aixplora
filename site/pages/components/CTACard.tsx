import React from "react";
import Container from "./Container";
import Image from "next/image";
import ctaBg from "../../public/static/cta-bg.svg";
import mac from "../../public/icons/mac-alt.svg";
import windows from "../../public/icons/windows-alt.svg";

export default function CTACard() {
  return (
    <Container className="py-8 ">
      <section
        className="cta-bg relative overflow-hidden rounded-[2rem] px-3 py-[2.5rem] lg:py-[5rem]"
        data-aos="flip-left"
        data-aos-duration="800"
      >
        <div className="flex flex-col justify-center text-center items-center gap-10 relative z-[5]">
          <h3 className="text-white mx-auto max-w-[31rem] ">
            <span className="opacity-40">
              Ready to Extract Meaning from Your Files?
            </span>{" "}
            Get Started with <span className="gradient-text">AIxplora.</span>
          </h3>

          <div className="flex justify-center flex-col gap-3 lg:flex-row lg:items-center">
            <a href="https://github.com/grumpyp/aixplora">
              <button className="w-full btn_1_alt">
                <Image src={mac} alt="mac" />
                Download for Mac
              </button>
            </a>

            <a href="https://www.dropbox.com/scl/fi/jnscprr2lvj1acr88xh09/AIxplora-Setup-0.0.2.exe?rlkey=0cl3xsmgqmzyo8o1rov08gcnl&dl=0">
              <button className="w-full btn_2_alt">
                <Image src={windows} alt="windows" />
                Download for Windows
              </button>
            </a>
          </div>
        </div>

        <figure className="absolute w-full top-[-50%]">
          <Image style={{ width: "100%" }} src={ctaBg} alt="bg" />
        </figure>
      </section>
    </Container>
  );
}
