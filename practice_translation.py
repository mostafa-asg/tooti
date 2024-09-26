from difflib import SequenceMatcher
from rich import print as rprint
import argparse
import string
import random
from parser import ContentParser

if __name__ == "__main__":
    arg_parser = argparse.ArgumentParser()    
    file_group = arg_parser.add_mutually_exclusive_group(required=True)
    file_group.add_argument("--filename", "-f")
    file_group.add_argument("--directory", "-d")
    args = arg_parser.parse_args()

    if args.filename:
        parser = ContentParser.from_file(args.filename)
        parse_result = parser.parse()
        random.shuffle(parse_result.translations)
        
        for translation in parse_result.translations:
            rprint("[bright_cyan]Translate:[/bright_cyan] ", end=None)
            print(translation.question)
            rprint("[bright_cyan]Hint: [/bright_cyan]", end=None)
            print(translation.hint)

            while True:
                given_answer = input("")
                if given_answer == ":s": # reveal solution
                    rprint("[red]" + translation.answer + "[/red]:cross_mark:")
                    print()
                    break # from while loop

                answer_is_accepted = True
                smatcher = SequenceMatcher(None, given_answer, translation.answer)                

                text_diff = ""
                for tag, i1, i2, j1, j2 in smatcher.get_opcodes():
                    if tag == "equal" and i1 == j1 and i2 == j2:
                        text_diff += "[green]" + given_answer[i1:i2] + "[/green]"
                    elif tag == "equal": # wrong position
                        text_diff += "[bright_yellow]" + given_answer[i1:i2] + "[/bright_yellow]"
                    else:                        
                        text_diff += "[red]" + given_answer[i1:i2] + "[/red]"
                        leftover = given_answer[i1:i2] + translation.answer[j1:j2]
                        if not all(map(lambda char: char in string.punctuation, list(leftover))):
                            answer_is_accepted = False
                
                if answer_is_accepted:
                    rprint("[green]" + given_answer + "[/green]:white_check_mark:")
                    print()
                    break # from while loop
                else:
                    rprint(text_diff)
                    print()                    
