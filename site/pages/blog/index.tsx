import Image from 'next/image';
import Link from 'next/link';
import { getSortedPostsData } from '../blog/posts';
import Navbar from "@/pages/components/Navbar";
import Footer from "@/pages/components/Footer";
import { PostsPageProps } from '../blog/types';

export async function getStaticProps() {
    const allPostsData = await getSortedPostsData();
    return {
      props: {
        allPostsData
      }
    };
}

export default function PostsPage({ allPostsData }: PostsPageProps) {
  const blogPostStyle = {
    width: '100%', // On mobile, the blog post takes full width
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    // Use a media query for larger screens
    '@media (min-width: 768px)': {
      width: 'calc(33.333% - 20px)', // Adjust width on larger screens
    }
  };

  return (
    <main className="min-h-screen overflow-hidden p-6 sm:px-16 md:px-20 lg:px-24">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4 text-center">aixplora.app - Blog</h2>
      <div style={{
        border: '1px solid #ddd',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        color: 'black',
      }}>
        <h3>Generative AI and the power of embeddings are changing how we find and use information in exciting ways. Imagine having a super-smart assistant that can sift through mountains of data to find exactly what you need, or even create new, useful information on the spot. That's what we're working on! We're here to make these cutting-edge technologies understandable and accessible to everyone. Join us as we explore how these tools are opening up new possibilities and making our digital world smarter and more connected.</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {allPostsData.map(({ id, date, title, thumbnail, author, intro }) => (
            <div key={id} className="blogPost">
            <Link href={`/posts/${id}`} passHref>
                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                <Image
                    src={thumbnail}
                    alt={`Thumbnail image ${title}`}
                    layout='fill'
                    objectFit='cover'
                />
                </div>
                <h3 className="font-semibold text-lg" style={{ marginTop: '10px', color: 'black' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'black' }}>{intro}</p>
                <br/>
                <p className="text-sm" style={{ color: 'black' }}>by {author}</p>
                <p className="text-sm" style={{ color: 'black' }}>{date}</p>
            </Link>
            </div>
        ))}
      </div>
      <Footer />
    </main>
  );
}
