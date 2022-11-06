import React, {
  DetailedHTMLProps,
  FormEvent,
  FormEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import styles from "../../styles/Input.module.css";

export default function Input() {
    
  const [value, setValue] = useState("");
  const rightWord = "Joaninha";

  function handleKeyDown(event: any) {
    const thisInputId = event.target.id as string;
    const thisInputNum = parseInt(thisInputId.split("-")[1]);

    if (event.key === "Backspace") {
      const nextInput = document.getElementById("input-" + (thisInputNum - 1));
      console.log(nextInput);
      nextInput?.focus();
      setValue(value.substring(0, value.length - 1));

    } else if (event.key.match(/[A-Za-z]/) && event.key.length === 1 && value.length < rightWord.length) {
      setValue(value + event.key);
      const nextInput = document.getElementById("input-" + (thisInputNum + 1));
      console.log(nextInput);
      nextInput?.focus();
    }
  }

  useEffect(() => {
    console.log("VALUE: " + value);
  }, [value]);

  return (
    <div className={styles.container}>
      <form>
        {rightWord.split("").map((char, i) => {
          return (
            <div key={i} className={styles.inputWrapper}>
              <input
                value={value.charAt(i)}
                onKeyDown={handleKeyDown}
                id={"input-" + i}
                maxLength={1}
              />
            </div>
          );
        })}
      </form>
    </div>
  );
}
