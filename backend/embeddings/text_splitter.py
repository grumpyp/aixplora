from embeddings.basesplit import BaseSplit
import nltk

class TextSplitter(BaseSplit):

    def __init__(self, text, context_type, text_length=len):
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
                words = nltk.word_tokenize(buffer)
                tagged_words = nltk.pos_tag(words)
                chunks = nltk.ne_chunk(tagged_words)
                phrases = TextSplitter.extract_phrases(chunks)
                parsed_sentence = ' '.join(phrases)
                parsed_sentences.append(parsed_sentence)

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