import { Translation, WordMeaning } from './models';

enum ReadState {
  WorldDeclaration = 1,
  Definition,
  Examples,
}

export class ParseResult {
  public words: Set<string>;
  public translations: Translation[];
  public wordMeanings: WordMeaning[];

  constructor() {
    this.words = new Set<string>();
    this.translations = [];
    this.wordMeanings = [];
  }
}

export class ContentParser {
  private _lines: string[];

  constructor(content: string) {
    this._lines = content.split('\n');
  }

  public parse(): ParseResult {
    const parseResult = new ParseResult();
    let readState = ReadState.WorldDeclaration;
    let word = '';

    for (let line of this._lines) {
      // remove markdown line break
      line = line.replace('  \n', '');
      // remove normal line break if it is not a blank line
      if (line.length > 1) {
        line = line.replace('\n', '');
      }

      if (readState === ReadState.WorldDeclaration) {
        // Remove markdown bold markers (**)
        word = line.replace(/\*\*/g, '');
        if (word !== '\n') {
          parseResult.words.add(word);
        }
        readState = ReadState.Definition;
        continue;
      }

      if (readState === ReadState.Definition) {
        // Remove markdown italics markers (*)
        const hint = line.replace(/\*/g, '');
        if (word !== '\n') {
          parseResult.wordMeanings.push(new WordMeaning(word, hint));
        }
        readState = ReadState.Examples;
        continue;
      }

      if (readState === ReadState.Examples) {
        // If empty line => move back to reading next word
        if (line.trim() === '\n' || line.trim() === '') {
          readState = ReadState.WorldDeclaration;
          continue;
        }

        // Remove custom marker *Ex:*
        line = line.replace('*Ex:*', '');
        // Remove remaining bold markers, if any
        line = line.replace(/\*\*/g, '');

        const rparenthesis = line.indexOf('(');
        const lparenthesis = line.indexOf(')');
        if (rparenthesis > 0 && lparenthesis > 0) {
          const question = line.substring(rparenthesis + 1, lparenthesis).trim();
          const answer = line.substring(0, rparenthesis).trim();

          const hintWords = answer.split(' ');
          let hint = '';
          const answerWords: string[] = [];

          for (const hintWord of hintWords) {
            if (hintWord.length > 1) {
              // add the first character
              hint += hintWord[0];
              const lastChar = hintWord[hintWord.length - 1];

              // Simple punctuation check with regex
              // to replicate string.punctuation checks
              if (/[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]/.test(lastChar)) {
                // e.g. "word," => 'word' + ','
                // fill underscores for everything but first/last char
                hint += '_'.repeat(hintWord.length - 2) + lastChar;
                // store the word minus punctuation
                answerWords.push(hintWord.substring(0, hintWord.length - 1));
              } else {
                // e.g. "word" => 'w___'
                hint += '_'.repeat(hintWord.length - 1);
                answerWords.push(hintWord);
              }
              hint += ' ';
            } else {
              // Single-letter word
              hint += hintWord;
            }
          }

          hint = hint.trim();

          parseResult.translations.push(
            new Translation(question, answer, answerWords, hint)
          );
        }
      }
    }

    return parseResult;
  }
}