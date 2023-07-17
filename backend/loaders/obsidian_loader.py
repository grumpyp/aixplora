import os
from fastapi import UploadFile
from typing import BinaryIO

def load_obsidian(file: BinaryIO, filename: str, file_meta: UploadFile):
    misc_dir = os.path.join(os.getcwd(), "misc")
    file_path = os.path.join(misc_dir, f"{filename}.txt")
    
    with open(file_path, "w") as f:
        f.write(file.read().decode("utf-8"))
    
    return file_path, file_meta
