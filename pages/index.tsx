import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Input from "../components/FieldsRow";
import InputsRows from "../components/FieldsRowsContainer";
import InputsBlock from "../components/FieldsRowsContainer";
import styles from "../styles/Home.module.css";
import FieldsRows from "../components/FieldsRowsContainer";
import FieldsRowsContainer from "../components/FieldsRowsContainer";

export interface FieldValue {
  backgroundColor: string;
  value: string;
}

export default function Home() {
  const rightWord = "ARARA";

  const initialFieldValues = new Array(rightWord.length).fill(null).map((_) => {
    return { backgroundColor: "gray", value: "" };
  });

  const [fieldsValues, setFieldsValues] =
    useState<Array<FieldValue>>(initialFieldValues);
  const [currentInputRow, setCurrentInputRow] = useState(0);
  const [submited, setSubmited] = useState(false);

  const rightWordWithoutUsedLetters = useRef(rightWord);

  function handleClickButton() {
    setFieldColorByRightWord();
    setSubmited(true);
  }

  function setFieldColorByRightWord() {
    const word = fieldsValues
      .map((iv: FieldValue) => iv.value)
      .join("")
      .toUpperCase();

    const fieldsValuesWithRightAndWrongLettersChecked =
      getFieldsValuesCheckedUsingRightWord(word);

    const fieldsValuesWithRemainigLettersChecked =
      getFieldsValuesWithRemainingLettersChecked(word, fieldsValuesWithRightAndWrongLettersChecked);

    setFieldsValues(fieldsValuesWithRemainigLettersChecked);
  }

  function getFieldsValuesCheckedUsingRightWord(typedWord: string) {
    return fieldsValues.map((v, i) => {
      if (typedWord[i] === rightWord[i]) {
        rightWordWithoutUsedLetters.current =
          rightWordWithoutUsedLetters.current?.replace(rightWord[i], "");

        return { backgroundColor: "#6aa84f", value: v.value };
      } else return { backgroundColor: "#bf2d23", value: v.value };
    });
  }

  function getFieldsValuesWithRemainingLettersChecked(typedWord: string, fieldsValues: Array<FieldValue>) {
    return fieldsValues.map((v, i) => {
      if (rightWordWithoutUsedLetters.current?.includes(typedWord[i])) {
        return { backgroundColor: "#ffd249", value: v.value };
      } else return { backgroundColor: v.backgroundColor, value: v.value };
    });
  }

  useEffect(() => {
    if (submited) {
      setCurrentInputRow(currentInputRow + 1);
      setFieldsValues(initialFieldValues);
      setSubmited(false);
    }
  }, [submited]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Termo</title>
        <meta name="description" content="Termo clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>TERMO</h1>
      <FieldsRowsContainer
        currentRow={currentInputRow}
        values={fieldsValues}
        onChangeFieldValue={setFieldsValues}
        fieldsPerRow={rightWord.length}
        numOfRows={5}
      />
      <div className={styles.buttonWrapper}>
        <button onClick={handleClickButton}>Confirmar</button>
      </div>
    </div>
  );
}
