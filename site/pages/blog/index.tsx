import Image from "next/image";
import Link from "next/link";
import { getSortedPostsData } from "../../utils/posts";

import Footer from "@/pages/components/Footer";
import { PostsPageProps } from "../../utils/types";
import CTACard from "../components/CTACard";
import Header from "../components/BlogHeader";
import { Fragment } from "react";
import SEOConfig from "../components/SEOConfig";
import Container from "../components/Container";
import BlogCard1 from "../components/BlogCard1";
import BlogCard2 from "../components/BlogCard2";

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function PostsPage({ allPostsData }: PostsPageProps) {
  return (
    <Fragment>
      <SEOConfig name="Blog" />
      <main className="min-h-screen overflow-hidden p-6 sm:px-16 md:px-20 lg:px-24">
        <Header />

        <Container className="mt-12 lg:mt-20">
          <h1 className="text-[#182336] mb-10">Blog</h1>

          <ul className="relative z-[4]">
            {allPostsData
              .filter((_, idx) => idx === 0)
              .map(
                (
                  { id, date, title, thumbnail, author, intro, authorImage },
                  idx
                ) => {
                  const href = `/posts/${id}`;
                  return (
                    <li key={id}>
                      <BlogCard1
                        {...{
                          id,
                          date,
                          href,
                          title,
                          thumbnail,
                          author,
                          authorImage,
                          intro,
                        }}
                      />
                    </li>
                  );
                }
              )}
          </ul>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 relative z-[4]">
            {allPostsData
              .filter((_, idx) => idx > 0)
              .map(
                (
                  { id, date, title, thumbnail, author, intro, authorImage },
                  idx
                ) => {
                  const href = `/posts/${id}`;

                  return (
                    <li key={id}>
                      <BlogCard2
                        {...{
                          id,
                          date,
                          href,
                          title,
                          thumbnail,
                          author,
                          authorImage,
                        }}
                      />
                    </li>
                  );
                }
              )}
          </ul>
        </Container>

        <CTACard />
        <Footer />
      </main>
    </Fragment>
  );
}
