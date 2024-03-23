import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
const postsDirectory = path.join(process.cwd(), 'pages/posts');

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();


  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter out non-.md files and ensure they are valid
  const mdFileNames = fileNames.filter(fileName => {
    return fileName.endsWith('.md') && fs.statSync(path.join(postsDirectory, fileName)).isFile();
  });

  return mdFileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter out non-.md files and ensure they are valid
  const mdFileNames = fileNames.filter(fileName => {
    return fileName.endsWith('.md') && fs.statSync(path.join(postsDirectory, fileName)).isFile();
  });
  
  const allPostsData = mdFileNames.map(fileName => {
    const fullPath = path.join(postsDirectory, fileName);

    // Read markdown file as string
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    };
  });

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
