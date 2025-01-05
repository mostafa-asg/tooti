export class Translation {
  public question: string;
  public answer: string;
  public answerWords: string[];
  public hint: string;

  constructor(question: string, answer: string, answerWords: string[], hint: string) {
    this.question = question;
    this.answer = answer;
    this.answerWords = answerWords;
    this.hint = hint;
  }
}
  
export class WordMeaning {
  public word: string;
  public meaning: string;
  public reveres: boolean;

  constructor(word: string, meaning: string) {
    this.word = word;
    this.meaning = meaning;
    this.reveres = true;
  }

  get answer(): string {
    return this.reveres ? this.word : this.meaning;
  }
    
  public toString(): string {
    if (this.reveres) {
      return this.meaning;
    } else {
      return this.word;
    }
  }
}
  