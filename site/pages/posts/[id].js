import { useRouter } from 'next/router';
import Image from 'next/image';
import { getPostData, getAllPostIds } from '../../utils/posts';
import Header from '../components/BlogHeader'
import SEOConfig from '../components/SEOConfig'
import Footer from "../components/Footer";
import styles from './Post.module.css';
import Container from '../components/Container';
import { getSortedPostsData } from '../../utils/posts';
import { Fragment } from 'react';
import BlogCard2 from "../components/BlogCard2"

export async function getStaticProps({ params }) {
  const allPostsData = await getSortedPostsData();
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
      allPostsData
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData, allPostsData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }


  console.log({allPostsData})



    // Helper function to create the markup for dangerouslySetInnerHTML
  const createMarkup = (html) => ({ __html: html });

  return (
    <Fragment>
        <Header />
    <SEOConfig name={`${postData.title} | AIxplora blog`} />
    <Container>
      <main className="relative min-h-screen overflow-hidden z-[5] mx-auto pt-12 max-w-[50rem]">
        <div className={styles.main}>
          <article className={styles.article}>
            <h1  className={styles.title}>{postData.title}</h1>

                           <span  className="flex items-center gap-2 mb-6">
            <span className="relative w-12 h-12 rounded-full overflow-hidden ">
              <Image
                src={postData?.authorImage}
                layout="fill"
                objectFit="cover"
                alt={`${postData?.author} image`}
              />
            </span>
            <h5>{postData?.author}</h5>
            <small className="text-[#031400]">{postData?.date}</small>
          </span>
          
            <div className={"w-full"}>
              <Image
                src={postData.thumbnail}
                alt={`Thumbnail image of ${postData.title}`}
                width={800}
                height={400}
                className='relative h-[25rem] w-[100%] lg:w-[50rem] rounded-[2rem]'
                style={{
                  objectFit: 'cover'
                }}

              />


            </div> <br/>
            
            <div className={styles.content} dangerouslySetInnerHTML={createMarkup(postData.contentHtml)} />
              {/* <ReactMarkdown remarkPlugins={[remarkHtml, rehypeRaw]}>{postData.contentHtml}</ReactMarkdown> */}
              {/* the above gives a particular error that removes the render. */}
            
          </article>
        </div>
      </main>


      <section className='mt-12 lg:mt-20'>

        <h2 className='mb-5  text-2xl lg:text-4xl'>Read more</h2>

  <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 relative z-[4]">
            {allPostsData
              ?.filter((_, idx) => idx < 3)
              ?.map(
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

      </section>
    </Container>
        <Footer />
    </Fragment>
  );
}
