import React, { useState, useRef } from "react";
import Container from "./Container";
import { FaPause, FaPlay } from "react-icons/fa";

export default function VideoDemo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Container className="pt-20" id="videoDemo"
    data-aos="fade-up"
    >
      <div className="relative p-8 gradient-bg rounded-3xl max-h-[39rem] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="relative rounded-2xl shadow-2xl cursor-pointer"
          onPlay={(e) => {
            setPlaying(true);
          }}
          onPause={(e) => setPlaying(false)}
          onClick={(e) => {
            playing ? videoRef.current?.pause() : videoRef.current?.play();
          }}
          ref={videoRef}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="absolute bottom-4 left-4 p-3 bg-black rounded-xl text-white shadow cursor-pointer"
          onClick={(e) => {
            playing ? videoRef.current?.pause() : videoRef.current?.play();
          }}
          title={playing ? "pause" : "play"}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </div>
      </div>
    </Container>
  );
}
