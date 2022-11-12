import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import FieldsRowsGroup from "../components/FieldsRowsGroup";
import { words } from "../services/data/ptbr-words"

export interface FieldValue {
  backgroundColor: string;
  value: string;
}

export default function Home() {
  const DEFAULT_FIELD_COLOR = "gray";
  const RIGHT_FIELD_COLOR = "#6aa84f";
  const WRONG_FIELD_COLOR = "#bf2d23";
  const INCLUDES_LETTER_COLOR = "#ffd249";

  const [rightWord, setRightWord] = useState("")

  const initialFieldValues = new Array(rightWord.length).fill(null).map((_) => {
    return { backgroundColor: DEFAULT_FIELD_COLOR, value: "" };
  });

  const [fieldsValues, setFieldsValues] =
    useState<Array<FieldValue>>([]);
  const [currentInputRow, setCurrentInputRow] = useState(0);
  const [submited, setSubmited] = useState(false);

  const rightWordWithoutUsedLetters = useRef("");

  function handleClickButton() {
    setFieldColorByRightWord();
    setSubmited(true);
  }

  function setFieldColorByRightWord() {
    const typedWord = fieldsValues
      .map((iv: FieldValue) => iv.value)
      .join("")
      .toUpperCase();

    const fieldsValuesWithRightAndWrongLettersChecked =
      getFieldsValuesCheckedUsingRightWord(typedWord);

    const fieldsValuesWithRemainigLettersChecked =
      getFieldsValuesWithRemainingLettersChecked(
        typedWord,
        fieldsValuesWithRightAndWrongLettersChecked
      );

    setFieldsValues(fieldsValuesWithRemainigLettersChecked);
  }

  function getFieldsValuesCheckedUsingRightWord(typedWord: string) {
    return fieldsValues.map((v, i) => {
      if (typedWord[i] === rightWord[i]) {
        rightWordWithoutUsedLetters.current =
          rightWordWithoutUsedLetters.current?.replace(rightWord[i], "");

        return { backgroundColor: RIGHT_FIELD_COLOR, value: v.value };
      } else return { backgroundColor: WRONG_FIELD_COLOR, value: v.value };
    });
  }

  function getFieldsValuesWithRemainingLettersChecked(
    typedWord: string,
    fieldsValues: Array<FieldValue>
  ) {
    return fieldsValues.map((v, i) => {
      if (
        rightWordWithoutUsedLetters.current?.includes(typedWord[i]) &&
        fieldsValues[i].backgroundColor !== RIGHT_FIELD_COLOR
      ) {
        return { backgroundColor: INCLUDES_LETTER_COLOR, value: v.value };
      } else return { backgroundColor: v.backgroundColor, value: v.value };
    });
  }

  const loadRightWord = () => {
    const randomIndex = getRandomIndex(0, words.length - 1)
    setRightWord(words[randomIndex].toUpperCase())
    rightWordWithoutUsedLetters.current = words[randomIndex].toUpperCase()
    setFieldsValues(new Array(words[randomIndex].length).fill(null).map((_) => {
      return { backgroundColor: DEFAULT_FIELD_COLOR, value: "" };
    }))
  }

  function getRandomIndex(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    if (submited) {
      setCurrentInputRow(currentInputRow + 1);
      setFieldsValues(initialFieldValues);
      setSubmited(false);
    }
  }, [submited]);

  useEffect(() => {
    loadRightWord()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Termo</title>
        <meta name="description" content="Termo clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>TERMO</h1>
      <FieldsRowsGroup
        currentRowIndex={currentInputRow}
        values={fieldsValues}
        onChangeFieldValue={setFieldsValues}
        fieldsPerRow={rightWord.length}
        numOfRows={rightWord.length}
      />
      <div className={styles.buttonWrapper}>
        <button onClick={handleClickButton}>Confirmar</button>
      </div>
    </div>
  );
}
