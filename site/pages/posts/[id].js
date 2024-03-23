import { useRouter } from 'next/router';
import Image from 'next/image';
import { getPostData, getAllPostIds } from '../../pages/blog/posts';
import Navbar from "../components/Navbar";
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

  // Helper function to create the markup for dangerouslySetInnerHTML
  const createMarkup = (html) => ({ __html: html });

  return (
    <>
      <main className="min-h-screen overflow-hidden p-6 sm:px-16 md:px-20 lg:px-24">
        <Navbar />
        <div className={styles.main}>
          <article className={styles.article}>
            <h1 className={styles.title}>{postData.title}</h1>
            <p className={styles.date}>{postData.date}</p>
            <div className={styles.imageContainer}>
              <Image
                src={postData.thumbnail}
                alt={`Thumbnail image of ${postData.title}`}
                layout='responsive'
                width={600}
                height={400}
              />
            </div>
            
            <div className={styles.content} dangerouslySetInnerHTML={createMarkup(postData.contentHtml)} />
            
          </article>
        </div>
        <Footer />
      </main>
    </>
  );
}
