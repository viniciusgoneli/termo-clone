import React, {
  DetailedHTMLProps,
  FormEvent,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { FieldValue } from "../../pages";
import styles from "../../styles/Input.module.css";

interface InputProps {
  values: Array<FieldValue>;
  onChangeValue: (value: Array<FieldValue>) => void;
  disabled: boolean;
  numOfFields: number;
  currentRowIndex: number;
  rowIndex: number;
}

export default function FieldsRow({
  values,
  onChangeValue,
  disabled,
  numOfFields,
  currentRowIndex,
  rowIndex,
}: InputProps) {
  const [_value, _setValue] = useState<Array<FieldValue>>([]);

  const firstFieldOfRowIndex = numOfFields * currentRowIndex;

  function handleKeyDown(event: any) {
    const thisFieldId = event.target.id as string;
    const currentFieldIndex = parseInt(thisFieldId.split("-")[1]);

    if (event.key === "Backspace") {
      changeFieldValue(currentFieldIndex, "");

      const previousField = document.getElementById(
        "input-" + (currentFieldIndex - 1)
      );
      previousField?.focus();
    } else if (event.key.match(/[A-Za-z]/) && event.key.length === 1) {
      const nextField = document.getElementById(
        "input-" + (currentFieldIndex + 1)
      );

      if (values[currentFieldIndex - firstFieldOfRowIndex]?.value === "") {
        changeFieldValue(currentFieldIndex, event.key);
        nextField?.focus();
        return;
      }
      nextField?.focus();
      changeFieldValue(currentFieldIndex + 1, event.key);
    }
  }

  function changeFieldValue(fieldIndex: number, value: string) {
    onChangeValue(
      values.map((v, i) => {
        if (i + firstFieldOfRowIndex === fieldIndex)
          return { backgroundColor: "gray", value: value };
        else return v;
      })
    );
  }

  useEffect(() => {
    if (values.length > 0) {
      _setValue(values);
    }
  }, [values]);

  useEffect(() => {
    const firstInput = document.getElementById("input-" + firstFieldOfRowIndex);
    firstInput?.focus();
  }, [currentRowIndex]);

  return (
    <div className={styles.container}>
      <form>
        {new Array(numOfFields).fill(null).map((_, i) => {
          return (
            <div
              key={i}
              style={{ backgroundColor: _value[i]?.backgroundColor }}
              className={styles.inputWrapper}
            >
              <input
                disabled={disabled}
                value={_value[i]?.value}
                onKeyDown={handleKeyDown}
                id={"input-" + (i + rowIndex * numOfFields)}
                maxLength={1}
              />
            </div>
          );
        })}
      </form>
    </div>
  );
}
