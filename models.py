from typing import List

class SimpleQuestionAnswer:
    def __init__(self, question: str, answer: str, hint: str):
        self.question = question
        self.answer = answer        
        self.hint = hint        

class Translation:
    def __init__(self, question: str, answer: str, answer_words: List[str], hint: str):
        self.question = question
        self.answer = answer
        self.answer_words = answer_words
        self.hint = hint        
	
class WordMeaning:
    def __init__(self, word: str, meaning: str) -> None:
        self.word = word
        self.meaning = meaning
        self.reveres = True

    @property
    def answer(self):
        if self.reveres:
            return self.word
        else:
            return self.meaning

    def __str__(self) -> str:
        if self.reveres:
            print(self.meaning)
        else:
            print(self.word)
