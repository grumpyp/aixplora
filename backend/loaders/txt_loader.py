import os


def load_txt(file: bytes, filename: str):

    # write files to misc folder
    misc_dir = os.path.join(os.getcwd(), "misc")
    with open(f"{misc_dir}/{filename}.txt", "wb") as f:
        f.write(file.read())
        f.close()

    return f"{misc_dir}/{filename}.txt"