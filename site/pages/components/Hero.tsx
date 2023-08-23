import React from "react";

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
                    <a href="https://github.com/grumpyp/aixplora">
                        <button className="btn_1">
                            <span className="text">Try it</span>
                        </button>
                    </a>

                    <a href="https://discord.gg/M2AuGZvgHq">
                        <button className="btn_2">
                            <span className="text">Join us</span>
                        </button>
                    </a>

                    <a href="mailto:info@aixplora.app?subject=AIxplora%20cloud&body=Hi%20there,%0A%0AI'd%20like%20to%20request%20access%20to%20the%20AIxplora%20cloud.%0A%0AMy%20team%20has%20X%20members,%20here%20are%20the%20emails:%0A%0Aexample@example.com%20-%20WRITE%20ACCESS%0Aexample2@example.com%20-%20READ%20ACCESS%0A%0AThank%20you,%0AX">
                        <button className="btn_3">
                            <span className="text">Request Cloud access</span>
                        </button>
                    </a>
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
