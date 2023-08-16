from bs4 import BeautifulSoup
import requests
import os
from typing import List


def extract_text_from_website(url: str, sitemap: bool = False) -> str:
    def extract(url: str):
        filename = url.replace('https://', '').replace('http://', '').replace('/', '_')
        file_meta = {"filename": filename, "file_type": "website", "file_size": 0}
        try:
            response = requests.get(url)

            if response.status_code == 200:
                page_content = response.content
                soup = BeautifulSoup(page_content, 'html.parser')
                text = soup.get_text()

                misc_dir = os.path.join(os.getcwd(), "misc")
                print(f"indexing {filename}")
                try:
                    print("writing to file")
                    with open(f"{misc_dir}/{filename}.txt", "w") as f:
                        f.write(text)
                    print("wrote to file")
                except Exception as e:
                    print(f"Error: {e}")

                return f"{misc_dir}/{filename}.txt", file_meta
            else:
                return Exception(f"Failed to retrieve the URL, response code: {response.status_code}")

        except requests.exceptions.RequestException as e:
            return Exception(e)
    if sitemap:
        exclude_extensions = ['.jpeg', '.png', '.jpg', '.gif', '.webp', '.bmp', '.tiff', '.ico', '.jfif', '.svg',
                              '.heif', '.indd', '.ai', '.eps', '.pdf']
        data = []
        try:
            if url.endswith('/'):
                page_sitemap_url, post_sitemap_url = f"{url}page-sitemap.xml", f"{url}post-sitemap.xml"
            else:
                page_sitemap_url, post_sitemap_url = f"{url}/page-sitemap.xml", f"{url}/post-sitemap.xml"
            response_page = requests.get(page_sitemap_url)
            response_post = requests.get(post_sitemap_url)
            soup_page = BeautifulSoup(response_page.content, 'xml')
            soup_post = BeautifulSoup(response_post.content, 'xml')
            links_page = [url.text for url in soup_page.find_all('loc')]
            links_post = [url.text for url in soup_post.find_all('loc')]
            links = [link for link in links_page + links_post if
                     not any(link.endswith(ext) for ext in exclude_extensions)]
            for link in links:
                data.append(extract(link))
            return data
        except requests.RequestException as e:
            print(f"An error occurred while fetching the sitemap: {e}")
            return []
    else:
        return extract(url)

if __name__ == '__main__':
    print(extract_text_from_website("https://www.aixplora.app"))