import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogCardProps } from "./BlogCard1";

export default function BlogCard2({
  author,
  authorImage,
  date,
  href,
  id,
  thumbnail,
  title,
}: BlogCardProps) {
  return (
    <Link href={href ?? ""} passHref>
      <article className="group w-[100%] flex flex-col items-start gap-10 my-7  lg:max-w-[24rem]">
        <span className="relative w-full h-[21em]">
          <Image
            src={thumbnail}
            layout="fill"
            objectFit="cover"
            alt={`Thumbnail image ${title}`}
            className="rounded-2xl transition-all"
          />
        </span>

        <aside className="flex flex-col gap-3">
          <h4 className="text-[#182336] text-lg font-bold lg:text-xl">
            {title}
          </h4>

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
