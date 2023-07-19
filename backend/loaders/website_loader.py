from bs4 import BeautifulSoup
import requests
import os


def extract_text_from_website(url: str, sitemap: bool = False) -> str:
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
            return "Failed to retrieve the URL"

    except requests.exceptions.RequestException as e:
        return str(e)


if __name__ == '__main__':
    print(extract_text_from_website("https://www.aixplora.app"))