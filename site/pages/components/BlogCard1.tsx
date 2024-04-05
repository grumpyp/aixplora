import React from "react";
import Link from "next/link";
import Image from "next/image";

export type BlogCardProps = {
  id: string;

  href: string;

  title: string;

  thumbnail: string;

  authorImage: string;

  author: string;

  date: string;

  intro?: string;
};

export default function BlogCard1({
  author,
  authorImage,
  date,
  href,
  id,
  thumbnail,
  title,
  intro,
}: BlogCardProps) {
  return (
    <Link href={href ?? ""} passHref>
      <article className="group flex flex-col items-center gap-10 my-7 lg:flex-row">
        <span className="relative w-[100%]  h-[300px]">
          <Image
            src={thumbnail}
            layout="fill"
            objectFit="cover"
            alt={`Thumbnail image ${title}`}
            className="rounded-2xl transition-all"
          />
        </span>

        <aside className="flex flex-col gap-5">
          <h3 className="text-[#182336]">{title}</h3>
          <p className="text-[#182336]">{intro}</p>

          <span className="flex items-center gap-2">
            <span className="relative w-12 h-12 rounded-full overflow-hidden ">
              <Image
                src={authorImage}
                layout="fill"
                objectFit="cover"
                alt={`${author} image`}
              />
            </span>
            <h5>{author}</h5>
            <small className="text-[#031400]">{date}</small>
          </span>
        </aside>
      </article>
    </Link>
  );
}
