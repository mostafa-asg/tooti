import React from "react";
import { useState, useEffect } from "react";
import { Translation } from "./utils/models";
import { ContentParser } from "./utils/parser";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "./App.css";
import _ from "lodash";
import { useParams } from 'react-router-dom';

const Lesson: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [userSelectedWords, setUserSelectedWords] = useState<string[]>([]);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [countDown, setCountDown] = useState(0); // Use to start the next question
  const [gameOver, setGameOver] = useState(false);

  const [loading, setLoading] = useState(true);
  
  const { "*": fileName } = useParams();

  useEffect(() => {
    let timer;
    if (answerIsCorrect && countDown > 0) {
      timer = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    } else if (countDown === 0) {
      // Proceed to the next question when countdown reaches 0
      setAnswerIsCorrect(false);
      setCountDown(0);
      loadNextQuestion();
    }

    return () => clearTimeout(timer);
  }, [countDown]);

  const loadNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      let index = currentQuestionIndex + 1;
      setCurrentQuestionIndex(index);
      setValidWords(_.shuffle(translations[index].answerWords));
      setUserSelectedWords([]);
    } else if (totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1)  {
      setGameOver(true);
    }
  };

  const removeWord = (words: string[], selectedWord: string): string[] => {
    // Make a copy so as not to mutate the original array
    const newWords = [...words];
  
    const index = newWords.indexOf(selectedWord);
    if (index !== -1) {
      newWords.splice(index, 1);
    }
  
    return newWords;
  };
  
  const handleValidWordClick = (event) => {
    const selectedWord = event.target.textContent;
    let words = removeWord(validWords, selectedWord);    
    setValidWords(words);
    setUserSelectedWords((prevWords) => {
      let userAnswerArray = [...prevWords, selectedWord];

      if (
        words.length === 0 &&
        _.isEqual(userAnswerArray, translations[currentQuestionIndex].answerWords)
      ) {
        setAnswerIsCorrect(true);
        setCountDown(3);
      }

      return userAnswerArray;
    });
  };

  const handleUserWordClick = (event) => {
    const selectedWord = event.target.textContent;
    let words = userSelectedWords.filter((w) => w !== selectedWord);
    setUserSelectedWords(words);
    setValidWords((prevWords) => [...prevWords, selectedWord]);
  };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);

      fetch("/languages/" + fileName)
      .then((response) => response.text())
      .then((fileContent) => {        
        let parser = new ContentParser(fileContent);
        let parseResult = parser.parse();

        if (parseResult.translations.length > 0) {
          let questions = _.shuffle(parseResult.translations);

          setTranslations(questions);
          setTotalQuestions(questions.length);          

          setCurrentQuestionIndex(0);
          setValidWords(_.shuffle(questions[0].answerWords));
          setUserSelectedWords([]);
          
          setLoading(false);
        }
      });
    }

    loadContent();
  }, [fileName]);

  if (loading) {
    return <div><b>Loading ...</b></div>
  }

  return translations.length > 0 ? (
    <div>
      {gameOver ? (
        <p>You studied all questions. Thanks for playing!</p>
      ) : (
        <>
          <p>{translations[currentQuestionIndex].question}</p>
          <Stack direction="row" spacing={1}>
            {validWords.map((w, i) => (
              <Chip
                key={i}
                label={w}
                variant="outlined"
                onClick={handleValidWordClick}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            {userSelectedWords.map((w, i) =>
              answerIsCorrect ? (
                <Chip
                  key={i}
                  label={w}
                  color="success"
                  onClick={handleUserWordClick}
                />
              ) : (
                <Chip
                  key={i}
                  label={w}
                  variant="outlined"
                  onClick={handleUserWordClick}
                />
              )
            )}
          </Stack>
          {answerIsCorrect ? (
            <div style={{ marginTop: "10px" }}>
              Next question will start in {countDown} seconds
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Lesson;
