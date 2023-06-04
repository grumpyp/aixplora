import math
import random
import nltk
from nltk.corpus import words
from embeddings.text_splitter import TextSplitter
from embeddings.basesplit import ContextTypes


def generate_random_sentence():
    nltk.download("punkt")
    nltk.download("words")

    word_list = words.words()

    sentence = []
    i = 0
    while len(sentence) < random.randint(5, 15):
        if i < random.randint(6, 10):
            sentence.append(".")
        word = random.choice(word_list)
        sentence.append(word)
        i += 1
    random_sentence = " ".join(sentence)

    return random_sentence


def test_text_splitter():
    # Generate a random text
    text = " ".join([generate_random_sentence() for _ in range(random.randint(8, 100))])
    chunks = TextSplitter(text=text, context_type=ContextTypes.TEXT).chunk_document()
    assert math.floor(len(text) / 1000) == len(chunks) or math.ceil(len(text) / 1000) == len(chunks)
