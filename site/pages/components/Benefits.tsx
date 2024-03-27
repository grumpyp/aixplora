import React from "react";
import Container from "./Container";
import Image from "next/image";

import ill1 from "../../public/static/bene-1.svg";
import ill2 from "../../public/static/bene-2.svg";
import ill3 from "../../public/static/bene-3.svg";
import ill4 from "../../public/static/bene-4.svg";
import ill5 from "../../public/static/bene-5.svg";
import ill6 from "../../public/static/bene-6.svg";

const data = [
  {
    icon: ill1,
    title: "Save time and effort with intelligent analysis.",
    body: "Focus on what matters.  AIxplora automates tedious analysis, summarizing key points and identifying crucial information in seconds.",
  },
  {
    icon: ill2,
    title: "Gain deeper understanding of complex information.",
    body: "AIxplora goes beyond surface-level analysis, revealing hidden patterns and connections within your data.",
  },
  {
    icon: ill3,
    title: "Make data-driven decisions with confidence",
    body: "We provide the insights you need, empowering you to make data-driven choices with complete confidence.",
  },
  {
    icon: ill4,
    title: "Improve collaboration and knowledge sharing",
    body: "AIxplora Cloud fosters seamless collaboration by allowing teams to share insights and analyze data collectively. ",
  },
  {
    icon: ill5,
    title: "Enhance customer experience with AI-powered website responses",
    body: "AIxplora Widget delivers instant, accurate answers to customer queries directly on your website.",
  },
  {
    icon: ill6,
    title: "Always Learning: AIxplora gets smarter with use.",
    body: "Over time, the AI engine tailors its analysis to your specific needs and data, providing even more relevant insights. You can always extend the knowledge of AIxplora.",
  },
];

export default function Benefits() {
  return (
    <section className="benefits-bg">
      <Container className="py-20 " id="benefits">
        <div className=" max-w-[33.5rem] mb-8">
          <p className="font-bold mb-5 gradient-text">BENEFITS</p>
          <h1 className="mb-5">
            Unlock the True Potential{" "}
            <span className="opacity-40">of Your Data</span>
          </h1>
          <p className="opacity-50 lg:text-xl">
            We use advanced AI to unlock hidden insights, summarize key points,
            and streamline data management.
          </p>
        </div>

        <ul className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((benefit, ind) => {
            return (
              <li
                className="flex flex-col gap-3"
                key={benefit.title}
                data-aos="fade-up"
                data-aos-delay={`${ind * 50}`}
                data-aos-duration="1000"
              >
                <figure>
                  <Image src={benefit.icon} alt={`${benefit.title} icon`} />
                </figure>

                <h6 className="text-xl font-bold mb-2">{benefit.title}</h6>
                <p className="opacity-50 leading-loose">{benefit.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
