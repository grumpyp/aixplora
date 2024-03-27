import React from "react";

import Container from "./Container";

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



        
      </Container>
    </section>
  );
}
