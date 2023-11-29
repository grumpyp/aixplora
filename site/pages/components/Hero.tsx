import React from "react";
import {IconBrandApple, IconBrandWindows} from '@tabler/icons-react';

function Hero() {
    return (
        <section id="hero" className="hero mt-24 mb-12 gap-8 flex flex-row items-center mx-auto max-w-full">
            <div className="text flex flex-col gap-y-6 flex-1">
                <h1 className="hero_intro_text text-6xl font-bold">
                    Experience Intelligent
                    <br/>
                    <span className="hero_text"> File Analysis</span>
                </h1>
                <p className="text-lg">
                    Discover the future of file analysis with our AI-powered desktop app.
                    Effortlessly analyze files, unlock valuable insights, and make
                    informed decisions. Experience the power of AI today - try it now and
                    revolutionize the way you understand your data.
                </p>
                <div className="buttons flex justify-evenly gap-x-1 items-center">
                    <a href="https://cloud.aixplora.app">
                        <button className="btn_3">
                            <span className="text">Cloud access</span>
                        </button>
                    </a>

                    <div className="icon-button-container">
                        <IconBrandApple/>
                        <a href="#">
                            <button className="btn_3">
                                <span className="text">Download</span>
                            </button>
                        </a>
                    </div>

                    <div className="icon-button-container">
                        <IconBrandWindows/>
                        <a href="https://www.dropbox.com/scl/fi/jnscprr2lvj1acr88xh09/AIxplora-Setup-0.0.2.exe?rlkey=0cl3xsmgqmzyo8o1rov08gcnl&dl=0">
                            <button className="btn_3">
                                <span className="text">Download</span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
            <div className="illustration max-w-3xl">
                <div className="card">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="card-inner">
                       <video autoPlay loop muted >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
