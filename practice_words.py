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
        
        for qa in parse_result.question_one_word_answer:            
            print(qa.question)            

            while True:
                given_answer = input("")
                if given_answer == ":s": # reveal solution
                    rprint("[red]" + qa.answer + "[/red]:cross_mark:")
                    print()
                    break # from while loop
                
                if qa.answer == given_answer:
                    rprint("[green]" + given_answer + "[/green]:white_check_mark:")
                    print()
                    break # from while loop
                else:
                    rprint("[red]wrong[/red]")
                    print()                    
