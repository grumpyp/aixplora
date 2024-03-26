import Head from "next/head";

interface SEOConfigProps {
  name: string;
}

const SEOConfig = ({ name }: SEOConfigProps) => {
  const title = `${name}`;
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Revolutionizing file analysis with AI"
      />
      <link rel="icon" href="/favicon.svg" />

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content="https://aixplora.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Revolutionizing file analysis with AI"
      />
      <meta property="og:image" content="" />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="aixplora.app" />
      <meta property="twitter:url" content="https://aixplora.app" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content="Revolutionizing file analysis with AI"
      />
      <meta name="twitter:image" content="" />
    </Head>
  );
};

export default SEOConfig;
