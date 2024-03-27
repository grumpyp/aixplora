import "./styles/globals.css";
import type { AppProps } from "next/app";
import { ParallaxProvider } from "react-scroll-parallax";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({});
    AOS.refresh();
  });


  return (
    <ParallaxProvider>
      <Component {...pageProps} />
    </ParallaxProvider>
  );
}
