import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import FieldsRowsGroup from "../components/FieldsRowsGroup";
import { words } from "../services/data/ptbr-words";
import WordService from "../services/WordService";

export interface FieldValue {
  backgroundColor: string;
  value: string;
}

export default function Home() {
  const DEFAULT_FIELD_COLOR = "gray";
  const RIGHT_FIELD_COLOR = "#6aa84f";
  const WRONG_FIELD_COLOR = "#bf2d23";
  const INCLUDES_LETTER_COLOR = "#ffd249";

  const [rightWord, setRightWord] = useState("");
  const [wrongLetters, setWrongLetters] = useState("");

  const initialFieldValues = new Array(rightWord.length).fill(null).map((_) => {
    return { backgroundColor: DEFAULT_FIELD_COLOR, value: "" };
  });

  const [fieldsValues, setFieldsValues] = useState<Array<FieldValue>>([]);
  const [currentInputRow, setCurrentInputRow] = useState(0);
  const [submited, setSubmited] = useState(false);

  const rightWordWithoutUsedLetters = useRef("");

  function handleSubmit(event: any) {
    event.preventDefault();
    if (fieldsValues.find((v) => v.value === "")) {
      return;
    }
    const word = fieldsValues.map((v) => v.value).join("");
    console.log("PALAVRA: " + word.toLowerCase());
    if (!WordService.checkIfExists(word.toLowerCase())) return;

    console.log("PALAVRA CERTA: " + rightWord);
    setFieldColorByRightWord();
    setSubmited(true);
  }

  function setFieldColorByRightWord() {
    const fieldValuesConvertedToAccentedWords =
      getFieldValuesConvertedToAccentedWords();

    const fieldsValuesWithRightAndWrongLettersChecked = getRightFieldsValues(
      fieldValuesConvertedToAccentedWords
    );

    const fieldsValuesWithRemainigLettersChecked =
      getFieldsValuesWithRemainingLettersChecked(
        fieldsValuesWithRightAndWrongLettersChecked
      );

    setFieldsValues(fieldsValuesWithRemainigLettersChecked);
  }

  function getFieldValuesConvertedToAccentedWords() {
    return fieldsValues.map((v, i) => {
      if (v.value === "A" && rightWord[i].match(/[ÁÀÂÃ]/)) {
        return { backgroundColor: v.backgroundColor, value: rightWord[i] };
      } else if (v.value === "E" && rightWord[i].match(/[ÉÈÊ]/)) {
        return { backgroundColor: v.backgroundColor, value: rightWord[i] };
      } else if (v.value === "I" && rightWord[i].match(/[ÍÏÌ]/)) {
        return { backgroundColor: v.backgroundColor, value: rightWord[i] };
      } else if (v.value === "O" && rightWord[i].match(/[ÕÔÓÒ]/)) {
        return { backgroundColor: v.backgroundColor, value: rightWord[i] };
      } else if (v.value === "U" && rightWord[i].match(/[ÚÙÛ]/)) {
        return { backgroundColor: v.backgroundColor, value: rightWord[i] };
      } else return { backgroundColor: v.backgroundColor, value: v.value };
    });
  }

  function getRightFieldsValues(currentFieldsValues: Array<FieldValue>) {
    return currentFieldsValues.map((v, i) => {
      if (v.value === rightWord[i]) {
        rightWordWithoutUsedLetters.current =
          rightWordWithoutUsedLetters.current?.replace(rightWord[i], "");

        return { backgroundColor: RIGHT_FIELD_COLOR, value: rightWord[i] };
      }
      return { backgroundColor: v.backgroundColor, value: v.value };
    });
  }

  function getFieldsValuesWithRemainingLettersChecked(
    currentFieldsValues: Array<FieldValue>
  ) {
    let tempRightWordWithoutUsedLetters = rightWordWithoutUsedLetters.current;
    let wrongLetters = "";
    const newValues = currentFieldsValues.map((v, i) => {
      if(v.backgroundColor === RIGHT_FIELD_COLOR){
        return { backgroundColor: v.backgroundColor, value: v.value };
      }
      else if (
        v.backgroundColor !== RIGHT_FIELD_COLOR &&
        tempRightWordWithoutUsedLetters.includes(v.value)
      ) {
        tempRightWordWithoutUsedLetters =
          tempRightWordWithoutUsedLetters.replace(v.value, "");

        return { backgroundColor: INCLUDES_LETTER_COLOR, value: v.value };
      }
      if (!wrongLetters.includes(v.value)) wrongLetters += v.value;

      return { backgroundColor: WRONG_FIELD_COLOR, value: v.value };
    });
    setWrongLetters(wrongLetters);

    return newValues;
  }

  const loadRightWord = () => {
    const randomWord = WordService.getRandom();

    setRightWord(randomWord);
    rightWordWithoutUsedLetters.current = randomWord;
    setFieldsValues(
      new Array(randomWord.length).fill(null).map((_) => {
        return { backgroundColor: DEFAULT_FIELD_COLOR, value: "" };
      })
    );
  };

  useEffect(() => {
    if (submited) {
      setCurrentInputRow(currentInputRow + 1);
      setFieldsValues(initialFieldValues);
      setSubmited(false);
    }
  }, [submited]);

  useEffect(() => {
    loadRightWord();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Termo</title>
        <meta name="description" content="Termo clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>TERMO</h1>
      </header>
      <h4 className={styles.wrongWordsTitle}>WRONG LETTERS</h4>
      <div className={styles.wrongWordsWrapper}>
        {wrongLetters.split("").map((l, i) => {
          return <p key={i}>{l}</p>;
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <FieldsRowsGroup
          currentRowIndex={currentInputRow}
          values={fieldsValues}
          onChangeFieldValue={setFieldsValues}
          fieldsPerRow={rightWord.length}
          numOfRows={rightWord.length}
        />
        <div className={styles.buttonWrapper}>
          <button onClick={handleSubmit}>Confirmar</button>
        </div>
      </form>
    </div>
  );
}
