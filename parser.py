import string
import os
from typing import List, Set, Dict
from models import Translation, WordMeaning
from enum import Enum

class ReadState(Enum):
    WorldDeclaration = 1
    Definition = 2
    Examples = 3

class ParseResult:
    def __init__(self):
        # Set of all words to learn
        self.words = set()
        self.translations: List[Translation] = []
        self.wordMeanings: List[WordMeaning] = []

class ContentParser:
    """
    A parser that can parse content of the files in the language folder
    """
    @staticmethod
    def from_file(filename: str) -> "ContentParser":
        content = ""
        with open(filename) as f:
            content = f.read()
        return ContentParser(content)    

    def __init__(self, content: str) -> None:
        self._lines = content.split("\n")        

    def parse(self) -> ParseResult:
        parse_result = ParseResult()

        readState = ReadState.WorldDeclaration

        for line in self._lines:
            # remove markdown line break
            line = line.replace("  \n", "")
            # remove normal line break if it is not a blank line
            if (len(line) > 1):
                line = line.replace("\n","")         

            if readState == ReadState.WorldDeclaration:   
                word = line.replace("**", "")
                if word != "\n":
                    parse_result.words.add(word)
                readState = ReadState.Definition
                continue
            
            if readState == ReadState.Definition:                
                hint = line.replace("*", "")
                if word != "\n":
                    parse_result.wordMeanings.append(WordMeaning(word, hint))
                readState = ReadState.Examples
                continue

            if readState == ReadState.Examples:                
                if line.strip() == "\n" or line.strip() == "": # means there is no example, so the next item must be word declaration
                    readState = ReadState.WorldDeclaration
                    continue

                line = line.replace("*Ex:*", "")
                line = line.replace("**", "")
                rparenthesis = line.find("(") # start of translation
                lparenthesis = line.find(")") # end of translation
                if rparenthesis > 0 and lparenthesis > 0:
                    question = line[rparenthesis+1: lparenthesis].strip()
                    answer = line[0:rparenthesis].strip()
                    hint_words = answer.split(" ")
                    hint = ""
                    answer_words: List[str] = [] # Like hint_words, but punctuation removed at the end of words
                    for hint_word in hint_words:
                        if len(hint_word) > 1:
                            hint += hint_word[0]
                            last_char = hint_word[-1]
                            if last_char in string.punctuation:
                                hint += ("_" * (len(hint_word) - 2)) + last_char
                                answer_words.append(hint_word[0:-1])
                            else:                                
                                hint += ("_" * (len(hint_word) - 1))
                                answer_words.append(hint_word)
                            hint += " "
                        else:
                            hint += hint_word

                    hint = hint.strip()        
                    parse_result.translations.append(Translation(question=question, answer=answer, answer_words=answer_words, hint=hint))
            
        return parse_result
