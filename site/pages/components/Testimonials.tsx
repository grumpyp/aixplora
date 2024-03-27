import React from "react";
import Container from "./Container";
import Image from "next/image";

import r1 from "../../public/static/r1.png";
import r2 from "../../public/static/r2.png";
import r3 from "../../public/static/r3.png";
import r4 from "../../public/static/r4.png";
import r5 from "../../public/static/r5.png";
import r6 from "../../public/static/r6.png";

const reviews = [
  {
    userImage: r1,
    userName: "Dr. Amelia Johnson",
    userTitle: "Research Scientist",
    comment:
      "AIxplora is a game-changer for my research work. Analyzing large datasets used to take days, now it's done in minutes. It's given me back valuable time to focus on what matters most - scientific discovery!",
  },
  {
    userImage: r2,
    userName: "David Moore",
    userTitle: "Esq., Attorney",
    comment:
      "As a lawyer, I deal with mountains of documents. AIxplora helps me quickly identify key points and relevant information across contracts, emails, and legal transcripts. It's a lifesaver for efficiency and accuracy!",
  },
  {
    userImage: r3,
    userName: "Sarah Li",
    userTitle: "Marketing Director, Tech Startup",
    comment:
      "Since implementing AIxplora Cloud, our marketing team has seen a dramatic increase in collaboration. We can now share insights and analyze data seamlessly, leading to faster campaign development and better results.",
  },
  {
    userImage: r4,
    userName: "Dr. Chen Wang",
    userTitle: "Head of Research, Pharmaceutica",
    comment:
      "AIxplora Cloud has transformed our research department. Sharing knowledge and fostering collaboration has never been easier. It's a fantastic tool for accelerating learning and innovation.",
  },
  {
    userImage: r5,
    userName: "Emily Jones",
    userTitle: "CEO",
    comment:
      "We integrated AIxplora Widget onto our customer support website, and it's been a huge hit! Customers can now get instant answers to their questions, 24/7. It's improved our customer satisfaction and reduced the workload on our support team.",
  },
  {
    userImage: r6,
    userName: "Michael Garcia",
    userTitle: "Founder",
    comment:
      "AIxplora Widget has made a significant difference on our website. Customers can now find the information they need quickly and easily, leading to a more positive user experience and increased sales conversions.",
  },
];

export default function Testimonials() {
  return (
    <Container className="py-20" id="testimonials">
      <div className="text-center mx-auto max-w-[33.5rem] mb-8">
        <p className="font-bold mb-5 gradient-text">TESTIMONIALS</p>
        <h1 className="mb-5">
          Don’t just take our word for it.{" "}
          <span className="opacity-40">Trust our customers</span>
        </h1>
        <p className="opacity-50 lg:text-xl">
          We’ve told you how AIxplora can help you, now it’s time to hear what
          our existing users are saying.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews?.map((review, ind) => {
          return (
            <li
              className="p-5 rounded-2xl bg-[#F8FAFF]"
              key={review.userName}
              data-aos="fade-up"
              data-aos-delay={`${ind * 50}`}
              data-aos-duration="1000"
            >
              <div className="mb-3 flex gap-3 items-center">
                <Image
                  src={review.userImage}
                  alt={`${review.userName} image]`}
                />

                <div>
                  <h6 className="mb-1 font-bold">{review.userName}</h6>
                  <p className="opacity-50">{review.userTitle}</p>
                </div>
              </div>

              <div>
                <p className="opacity-50 leading-loose">{review.comment}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
