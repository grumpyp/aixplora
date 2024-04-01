import { useRouter } from 'next/router';
import Image from 'next/image';
import { getPostData, getAllPostIds } from '../../utils/posts';
import Header from '../components/Header'
import SEOConfig from '../components/SEOConfig'
import Footer from "../components/Footer";
import styles from './Post.module.css';

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  console.log('postData.contentHtml:', postData.contentHtml);
  console.log(postData)
  return {
    props: {
      postData,
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

export default function Post({ postData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <SEOConfig name={`${postData.title} | AIxplora blog`} />
      <main className="min-h-screen overflow-hidden p-6 sm:px-16 md:px-20 lg:px-24">
        <Header />
        <div className={styles.main}>
          <article className={styles.article}>
            <h1  className={styles.title}>{postData.title}</h1>
            <p className={styles.date}>{postData.date}</p>
            <div className={"w-full"}>
              <Image
                src={postData.headerImage}
                alt={`Thumbnail image of ${postData.title}`}
                layout='responsive'
                width={800}
                height={400}
              />
            </div> <br/>
            
            <div className={"text-[#374151]"} dangerouslySetInnerHTML={{__html:postData.contentHtml}} />
              {/* <ReactMarkdown remarkPlugins={[remarkHtml, rehypeRaw]}>{postData.contentHtml}</ReactMarkdown> */}
              {/* the above gives a particular error that removes the render. */}
            
          </article>
        </div>
        <Footer />
      </main>
    </>
  );
}
