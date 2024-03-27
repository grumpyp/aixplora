import React, { useState, useRef } from "react";
import Container from "./Container";

export default function VideoDemo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Container className="pt-20" id="videoDemo">
      <div className="p-8 gradient-bg rounded-3xl max-h-[39rem] overflow-hidden">
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
      </div>
    </Container>
  );
}
