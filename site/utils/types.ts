export type Post = {
    id: string;
    date: string;
    title: string;
    thumbnail: string;
    author: string;
    intro: string;
  };
  
export type PostsPageProps = {
  allPostsData: Post[];
};
  