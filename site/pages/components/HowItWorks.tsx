import React from "react";
import Container from "./Container";
import Image from "next/image";
import ill1 from "../../public/static/hiw-1.svg";
import ill2 from "../../public/static/hiw-2.svg";
import ill3 from "../../public/static/hiw-3.svg";
import ill4 from "../../public/static/hiw-4.svg";
import ill5 from "../../public/static/hiw-5.svg";

const data = [
  {
    illustration: ill1,
    title: "AI-Powered Insights",
    body: "Get in-depth summaries, identify key data points, and uncover hidden patterns.",
  },
  {
    illustration: ill2,
    title: "Data Privacy (For Client)",
    body: "Keep your data secure with on-premise storage and open-source AI models (optional OpenAI integration available).",
  },
  {
    illustration: ill3,
    title: "Universal File Integration",
    body: "Analyze any file type, from documents and emails to videos and audio.",
  },
  {
    illustration: ill4,
    title: "Cloud-Based Knowledge Sharing",
    body: "Foster collaboration and share insights seamlessly within teams or businesses.",
  },
  {
    illustration: ill5,
    title: "Seamless Integration",
    body: "Embed AIxplora's capabilities directly into your website, empowering users with AI-powered answers.",
  },
];

export default function HowItWorks() {
  return (
    <Container className="py-20" id="howItWorks">
      <div className="text-center mx-auto max-w-[33.5rem] mb-8">
        <p className="font-bold mb-5 gradient-text">HOW IT WORKS</p>
        <h1 className="mb-5">
          Effortless Analysis,{" "}
          <span className="opacity-40">Powerful Results</span>
        </h1>
        <p className="opacity-50 lg:text-xl">
          We use advanced AI to unlock hidden insights, summarize key points,
          and streamline data management.
        </p>
      </div>

      <section>
        <ul
          className="flex flex-col w-full gap-5 mb-5 lg:flex-row"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {data
            ?.filter((_, ind) => ind <= 2)
            .map((card) => {
              return (
                <li
                  key={card?.title}
                  className="group w-full rounded-2xl overflow-hidden border border-[#E0E6F2]"
                >
                  <figure className="overflow-hidden w-full">
                    <Image
                      className="transition-all group-hover:scale-110"
                      style={{ width: "100%" }}
                      src={card?.illustration}
                      alt={card.title}
                    />

                    <div className="p-5 lg:p-6">
                      <h6 className="text-xl font-bold mb-2">{card.title}</h6>
                      <p className="opacity-50 leading-loose">{card.body}</p>
                    </div>
                  </figure>
                </li>
              );
            })}
        </ul>
        <ul
          className="flex flex-col w-full gap-5  lg:flex-row"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {data
            ?.filter((_, ind) => ind > 2)
            .map((card) => {
              return (
                <li
                  key={card?.title}
                  className="group w-full rounded-2xl overflow-hidden border border-[#E0E6F2]"
                >
                  <figure className="overflow-hidden w-full">
                    <Image
                      className="transition-all group-hover:scale-110"
                      style={{ width: "100%" }}
                      src={card?.illustration}
                      alt={card.title}
                    />

                    <div className="p-5 lg:p-6">
                      <h6 className="text-xl font-bold mb-2">{card.title}</h6>
                      <p className="opacity-50 leading-loose">{card.body}</p>
                    </div>
                  </figure>
                </li>
              );
            })}
        </ul>
      </section>
    </Container>
  );
}
