import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import FieldsRowsGroup from "../components/FieldsRowsGroup";
import { words } from "../services/data/ptbr-words";
import WordService from "../services/WordService";
import VictoryModal from "../components/VictoryModal";

export interface FieldValue {
  letterColor: string;
  backgroundColor: string;
  value: string;
}

export default function Home() {
  const DEFAULT_FONT_COLOR = "#fff";
  const DEFAULT_FIELD_COLOR = "gray";
  const RIGHT_FIELD_COLOR = "#6aa84f";
  const WRONG_FIELD_COLOR = "#bf2d23";
  const INCLUDES_LETTER_COLOR = "#ffd249";
  const DEFAULT_FIELD_VALUE = {
    letterColor: DEFAULT_FONT_COLOR,
    backgroundColor: DEFAULT_FIELD_COLOR,
    value: "",
  };

  const [rightWord, setRightWord] = useState("");
  const [wrongLetters, setWrongLetters] = useState<Array<string>>([]);
  const [rightLetters, setRightLetters] = useState<Array<string>>([]);

  const [fieldsValues, setFieldsValues] = useState<Array<FieldValue>>([]);
  const [currentInputRow, setCurrentInputRow] = useState(0);
  const [submited, setSubmited] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  function onChangeFieldValue(index: number, value: string) {
    const fieldIndex = index - rightWord.length * currentInputRow;

    const letterColor =
      rightLetters[fieldIndex] === value &&
      rightLetters.find((v) => v === value)
        ? RIGHT_FIELD_COLOR
        : wrongLetters.find((v) => v === value)
        ? WRONG_FIELD_COLOR
        : "white";

    setFieldsValues(
      fieldsValues.map((v, i) => {
        if (i === fieldIndex) {
          return { ...v, letterColor, value };
        }
        return v;
      })
    );
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    if (fieldsValues.find((v) => v.value === "")) {
      return;
    }
    const transformedFieldValues = transformFieldsUsingRightWord();
    const word = transformedFieldValues.map((v) => v.value).join("");

    if (!WordService.checkIfExists(word.toLowerCase())) return;
    if(transformedFieldValues.map(v => v.value).join("") === rightWord){
      setShowVictoryModal(true)
    }

    const _wrongLetters = getWrongLetters(transformedFieldValues);
    setWrongLetters(wrongLetters.concat(_wrongLetters));

    const _rightLetters = getRightLetters(transformedFieldValues);
    setRightLetters(_rightLetters);

    setSubmited(true);
    setFieldsValues(transformedFieldValues);
  }

  function getWrongLetters(fieldsValues: Array<FieldValue>) {
    return fieldsValues
      .filter((v, i) => {
        return !rightWord.includes(v.value);
      })
      .map((v) => v.value);
  }

  function getRightLetters(fieldsValues: Array<FieldValue>) {
    return fieldsValues.map((v, i) => {
      if (v.value === rightWord[i] && !rightLetters[i]) {
        return v.value;
      }
      return rightLetters[i];
    });
  }

  function transformFieldsUsingRightWord() {
    const fieldValuesWithAccentedWords =
      getFieldValuesConvertedToAccentedWords();

    const fieldsValuesWithRightAndWrongLettersColored =
      getFieldsValuesWithRightLettersColored(fieldValuesWithAccentedWords);

    return getFieldsValuesWithIncludeLettersChecked(
      fieldsValuesWithRightAndWrongLettersColored
    );
  }

  function getFieldValuesConvertedToAccentedWords() {
    return fieldsValues.map((v, i) => {
      if (
        (v.value === "A" && rightWord[i].match(/[ÁÀÂÃ]/)) ||
        (v.value === "E" && rightWord[i].match(/[ÉÈÊ]/)) ||
        (v.value === "I" && rightWord[i].match(/[ÍÏÌ]/)) ||
        (v.value === "O" && rightWord[i].match(/[ÕÔÓÒ]/)) ||
        (v.value === "U" && rightWord[i].match(/[ÚÙÛ]/))
      ) {
        console.log("RC: " + v.value);
        return { ...v, value: rightWord[i] };
      }
      return v;
    });
  }

  function getFieldsValuesWithRightLettersColored(
    currentFieldsValues: Array<FieldValue>
  ) {
    const values = currentFieldsValues.map((v, i) => {
      if (v.value === rightWord[i]) {
        return {
          ...v,
          backgroundColor: RIGHT_FIELD_COLOR,
          value: rightWord[i],
        };
      }
      return v;
    });

    return values;
  }

  function getFieldsValuesWithIncludeLettersChecked(
    currentFieldsValues: Array<FieldValue>
  ) {
    const tempRightWord = rightWord.split("").filter((l, i) => {
      return l !== fieldsValues[i].value;
    });

    const newValues = currentFieldsValues.map((v, i) => {
      if (v.value === rightWord[i]) {
        return v;
      } else if (tempRightWord.includes(v.value)) {
        tempRightWord.splice(tempRightWord.indexOf(v.value), 1);
        return { ...v, backgroundColor: INCLUDES_LETTER_COLOR };
      }
      return { ...v, backgroundColor: WRONG_FIELD_COLOR };
    });

    return newValues;
  }

  const startNewGame = () => {
    const randomWord = WordService.getRandom(5);

    setShowVictoryModal(false)
    setCurrentInputRow(0);
    setRightWord(randomWord);
    console.log("PALAVRA CERTA: " + randomWord);
    setWrongLetters([]);
    setRightLetters(Array(randomWord.length).fill(""));
    setFieldsValues(
      Array(randomWord.length)
        .fill(null)
        .map((_) => DEFAULT_FIELD_VALUE)
    );
  };

  useEffect(() => {
    if (submited) {
      setCurrentInputRow(currentInputRow + 1);
      setFieldsValues(
        Array(rightWord.length)
          .fill(null)
          .map((_) => DEFAULT_FIELD_VALUE)
      );
      setSubmited(false);
    }
  }, [submited]);

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <>
      <div className={styles.container}>
        {showVictoryModal ? (
          <VictoryModal
            rightWord={rightWord}
            onClickReplayButton={startNewGame}
          />
        ) : null}

        <Head>
          <title>Termo</title>
          <meta name="description" content="Termo clone" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className={styles.header}>
          {/*<h1 className={styles.title}>TERMO</h1>*/}
        </header>
        <form onSubmit={handleSubmit}>
          <FieldsRowsGroup
            currentRowIndex={currentInputRow}
            values={fieldsValues}
            onChangeFieldValue={onChangeFieldValue}
            fieldsPerRow={rightWord.length}
            numOfRows={rightWord.length}
          />
          <div className={styles.buttonWrapper}>
            <button onClick={handleSubmit}>Confirmar</button>
          </div>
        </form>
      </div>
    </>
  );
}
