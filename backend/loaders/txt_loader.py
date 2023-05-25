import os

def load_txt(file: bytes, filename: str):
    # Read the contents of the file
    file_bytes = file.read()

    # Decode the bytes into text 
    text = file_bytes.decode("utf-8")  

    misc_dir = os.path.join(os.getcwd(), "misc")
    filename = filename[:-4]
    txt_file_path = os.path.join(misc_dir, f"{filename}.txt") #so instead of having test.txt.txt we get test.txt
    with open(txt_file_path, "w") as txt_file:
        txt_file.write(text)

    return txt_file_path
