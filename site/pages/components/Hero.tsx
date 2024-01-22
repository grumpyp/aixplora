import React from "react";
import { IconBrandApple, IconBrandWindows } from '@tabler/icons-react';

function Hero() {
    return (
        <section id="hero" className="hero mt-24 mb-12 gap-8 flex flex-row items-center mx-auto max-w-full">
            <div className="text flex flex-col gap-y-6 flex-1">
                <h1 className="hero_intro_text text-6xl font-bold">
                    AIxplora: Revolutionizing File Analysis
                </h1>
                <p className="text-lg">
                    Welcome to AIxplora, your advanced AI-powered desktop app for intelligent file analysis and data management.
                </p>
                <ul className="text-lg list-disc ml-5">
                    <li><strong>AIxplora Client:</strong> A private, on-premise solution using open-source AI models or optional OpenAI, ensuring full data privacy on your PC.</li>
                    <li><strong>AIxplora Cloud:</strong> Cloud-based knowledge sharing, ideal for collaborative learning and information exchange in groups or businesses.</li>
                    <li><strong>AIxplora Widget:</strong> Seamlessly integrate AIxplora's capabilities into your website, offering AI-powered responses to user queries.</li>
                    <li><strong>Universal File Integration:</strong> Effortlessly analyze any file type, from text to multimedia, without format restrictions.</li>
                    <li><strong>AI-Powered Insights:</strong> Utilize advanced AI for in-depth analysis and summarization, unlocking valuable insights.</li>
                </ul>
                <div className="buttons flex justify-evenly gap-x-1 items-center">
                    <div className="icon-button-container">
                        <IconBrandApple />
                        <a href="https://github.com/grumpyp/aixplora">
                            <button className="btn_3">
                                <span className="text">Download for Mac</span>
                            </button>
                        </a>
                    </div>
                    <div className="icon-button-container">
                        <IconBrandWindows />
                        <a href="https://www.dropbox.com/scl/fi/jnscprr2lvj1acr88xh09/AIxplora-Setup-0.0.2.exe?rlkey=0cl3xsmgqmzyo8o1rov08gcnl&dl=0">
                            <button className="btn_3">
                                <span className="text">Download for Windows</span>
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
