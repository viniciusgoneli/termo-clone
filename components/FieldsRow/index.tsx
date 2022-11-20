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
  onChangeValue: (index: number, value: string) => void;
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
      onChangeValue(currentFieldIndex, "");

      const previousField = document.getElementById(
        "input-" + (currentFieldIndex - 1)
      );
      previousField?.focus();
    } else if (
      event.key.toUpperCase().match(/^[A-ZÁÀÂÃÉÈÊÍÌÏÓÔÕÖÚÑ ]+$/) &&
      event.key.length === 1 &&
      event.key !== " "
    ) {
      const keyUpperCase = event.key.toUpperCase();
      const nextField = document.getElementById(
        "input-" + (currentFieldIndex + 1)
      );

      if (values[currentFieldIndex - firstFieldOfRowIndex]?.value === "") {
        onChangeValue(currentFieldIndex, keyUpperCase);
        nextField?.focus();
        return;
      }
      nextField?.focus();
      onChangeValue(currentFieldIndex + 1, keyUpperCase);
    }
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
              style={{ color: _value[i]?.letterColor }}
              id={"input-" + (i + rowIndex * numOfFields)}
              maxLength={1}
            />
          </div>
        );
      })}
    </div>
  );
}
