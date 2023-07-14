# loaders
from loaders.pdf_loader import load_pdf
from loaders.ppt_loader import load_presentation
from loaders.txt_loader import load_txt
from loaders.audio_loader import Whisperexporter
from loaders.docx_loader import load_docx
from loaders.xlsx_loader import load_xlsx
from loaders.xls_loader import load_xls
from loaders.epub_loader import load_epub
from loaders.obsidian_loader import load_obsidian
import openai

FILE_HANDLERS = {
    ".pdf": lambda file: load_pdf(file.file, filename=file.filename, file_meta=file),
    ".ppt": lambda file: load_presentation(file.file, filename=file.filename, file_meta=file),
    ".pptx": lambda file: load_presentation(file.file, filename=file.filename, file_meta=file),
    ".txt": lambda file: load_txt(file.file, filename=file.filename, file_meta=file),
    ".mp3": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mp4": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mpeg": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mpga": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".wav": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".webm": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".m4a": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".docx": lambda file: load_docx(file.file, filename=file.filename, file_meta=file),
    ".xlsx": lambda file: load_xlsx(file.file, filename=file.filename, file_meta=file),
    ".xls": lambda file: load_xls(file.file, filename=file.filename, file_meta=file),
    ".csv": lambda file: load_txt(file.file, filename=file.filename, file_meta=file),
    ".epub": lambda file: load_epub(file.file, filename=file.filename, file_meta=file),
    ".md": lambda file: load_obsidian(file.file, filename=file.filename, file_meta=file),
    }