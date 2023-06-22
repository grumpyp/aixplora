import os
import openai
import tempfile
from sqlalchemy import text
from database.database import Database
from fastapi import UploadFile


class Whisperexporter:
    """
    supports [".m4a", ".mp3", ".mp4", ".mpeg", ".mpga", ".wav", ".webm"]
    """
    def __init__(self):

        # TODO: move this to utils or something it's used in multiple places
        try:
            self.openai_api_key = Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1]
        except:
            self.openai_api_key = "notdefined"

    def whisper_to_text(self, file: bytes, filename: str, file_meta: UploadFile):
        misc_dir = os.path.join(os.getcwd(), "misc")
        with tempfile.NamedTemporaryFile(delete=False, suffix=filename) as tmp_file:
            content = file.read()
            tmp_file.write(content)
            tmp_file.flush()
            tmp_file.close()

            with open(tmp_file.name, "rb") as audio_file:
                openai.api_key = self.openai_api_key
                transcript = openai.Audio.transcribe("whisper-1", audio_file)

            transcript_text = transcript['text']  # Extract the text content from the transcript object

            with open(f"{misc_dir}/{filename}.txt", "w", encoding="utf-8") as f:
                f.write(transcript_text)

        return f"{misc_dir}/{filename}.txt", file_meta


    @property
    def textes(self):
        return self._textes