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
  rowIndex: number;
  currentInput: number;
}

export default function FieldsRow({
  values,
  onChangeValue,
  disabled,
  numOfFields,
  rowIndex,
  currentInput
}: InputProps) {
  const [_value, _setValue] = useState<Array<FieldValue>>([]);

  function handleKeyDown(event: any) {
    const thisInputId = event.target.id as string;
    const thisInputNum = parseInt(thisInputId.split("-")[1]);

    if (event.key === "Backspace") {
      onChangeValue(
        values.map((v, i) => {
          if ((i + (numOfFields * currentInput)) === thisInputNum) return { backgroundColor: "gray", value: "" };
          else return v;
        })
      );

      const nextInput = document.getElementById("input-" + (thisInputNum - 1));
      console.log("NINPUT: "+nextInput)
      nextInput?.focus();
    } else if (
      event.key.match(/[A-Za-z]/) &&
      event.key.length === 1
      
    ) {
      const nextInput = document.getElementById("input-" + (thisInputNum + 1));

      if(values[thisInputNum - (numOfFields * currentInput)]?.value === ""){
        onChangeValue(
          values.map((v, i) => {
            if ((i + (numOfFields * currentInput)) === thisInputNum) return { backgroundColor: "gray", value: event.key };
            else return v;
          })
        );
        nextInput?.focus();
        return
      }
      nextInput?.focus();
      onChangeValue(
        values.map((v, i) => {
          if ((i + (numOfFields * currentInput)) === thisInputNum + 1) return { backgroundColor: "gray", value: event.key };
          else return v;
        })
      )
      
    }
  }

  useEffect(() => {
    if(values.length > 0){
      _setValue(values);
    }
  }, [values]);

  useEffect(() => {
    if(!disabled){
      const firstInput = document.getElementById("input-"+(currentInput * numOfFields))
      firstInput?.focus();
    }
  }, [disabled])


  return (
    <div className={styles.container}>
      <form>
        {Array(numOfFields).fill(null).map((_, i) => {
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
                id={"input-" + (i + (rowIndex * numOfFields))}
                maxLength={1}
              />
            </div>
          );
        })}
      </form>
    </div>
  );
}
