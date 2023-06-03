from embeddings.basesplit import BaseSplit
import nltk

class TextSplitter(BaseSplit):

    def __init__(self, text, context_type, text_length = len):
        super().__init__(text, context_type, text_length)

    def split(self):
        pass

    def chunk_document(self):
        try:
            from nltk.chunk import ChunkParserI
            # download resources for tokenization and pos tagging
            nltk.download('punkt')
            nltk.download('averaged_perceptron_tagger')
            nltk.download('maxent_ne_chunker')
            nltk.download('words')
        except ImportError:
            raise ImportError("nltk module not installed")

        # Use NLTK's pre-trained sentence tokenizer
        sentences = nltk.sent_tokenize(self.text)

        parsed_sentences = []
        buffer = ""
        for sentence in sentences:
            # Add the current sentence to the buffer
            buffer += " " + sentence

            # Check if buffer already exceeds the desired length
            if len(buffer) > 1000:
                # If it does, process the buffer
                words = nltk.word_tokenize(buffer)
                tagged_words = nltk.pos_tag(words)
                chunks = nltk.ne_chunk(tagged_words)
                phrases = TextSplitter.extract_phrases(chunks)
                parsed_sentence = ' '.join(phrases)
                parsed_sentences.append(parsed_sentence)

                # Clear the buffer
                buffer = ""

        # Process any remaining sentences in the buffer
        if buffer:
            words = nltk.word_tokenize(buffer)
            tagged_words = nltk.pos_tag(words)
            chunks = nltk.ne_chunk(tagged_words)
            phrases = TextSplitter.extract_phrases(chunks)
            parsed_sentence = ' '.join(phrases)
            parsed_sentences.append(parsed_sentence)

        return parsed_sentences

    @staticmethod
    def extract_phrases(tree):
        phrases = []
        if hasattr(tree, 'label') and tree.label:
            for child in tree:
                phrases.extend(TextSplitter.extract_phrases(child))
        else:
            phrases.append(tree[0])
        return phrases

    # Not implemented yet, as it loses context of the text
    @staticmethod
    def remove_stopwords(text: str):
        try:
            nltk.download('stopwords')
            from nltk.corpus import stopwords
        except ImportError:
            raise ImportError("nltk module not installed")

        # Tokenize the text into words
        words = nltk.word_tokenize(text)

        # Get the stopwords for the current language
        stop_words = set(stopwords.words())

        # Filter out the stopwords from the words
        filtered_words = [word for word in words if word.casefold() not in stop_words]

        # Join the filtered words back into a single string
        filtered_text = ' '.join(filtered_words)

        return filtered_text


if __name__ == '__main__':
    text = """The first thing you need to do is install the NLTK library. You can do this by typing the following command into your terminal:
    pip install nltk
    Once you have NLTK installed, you can import it in your Python source file. Then, you need to download the NLTK data and install it. You can do this by typing the following commands into your terminal:
    import nltk
    nltk.download()
    This will open a new window. Click on the Corpora tab, then select the treebank option and click the Download button.
    Once you have the NLTK data installed, you can use it to parse text for named entities. The following code shows how to do this:"""
    text = """Hallo ich bin Patrick. Ich wohne in Peniche Bealel und bin 25 Jahre alt. Wo kommst du her? Wie ist dein Name Wie alt bist du"""
    print(TextSplitter.chunk_document(text))