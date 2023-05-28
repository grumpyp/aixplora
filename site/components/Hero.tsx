import React from "react";
import "../styles/styles.css";

function Hero() {
  return (
    <section id="hero" className="hero px-96 mt-32 flex flex-row max-xl:px-48">
      <div className="text flex flex-col gap-y-6 flex-5">
        <h1 className="hero_intro_text text-6xl font-bold">
          Experience Intelligent
          <br />
          <span className="hero_text"> File Analysis</span>
        </h1>
        <p className="text-lg w-2/3">
          Discover the future of file analysis with our AI-powered desktop app.
          Effortlessly analyze files, unlock valuable insights, and make
          informed decisions. Experience the power of AI today - try it now and
          revolutionize the way you understand your data.
        </p>
        <div className="buttons flex flex-row gap-x-3 items-center">
          <a href="https://github.com/grumpyp/aixplora"><button className="btn_1">
            <span className="text">Try it</span>
          </button></a>

          <a href="https://discord.gg/M2AuGZvgHq"><button className="btn_2">
            <span className="text">Join us</span>
          </button></a>
        </div>
      </div>
      <div className="illustration flex-2">
        <div className="card">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="card-inner"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
