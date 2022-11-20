import React from "react";
import styles from "../../styles/VictoryModal.module.css";

interface VictoryModalProps {
  rightWord: string;
  onClickReplayButton: () => void;
}

export default function VictoryModal({ rightWord, onClickReplayButton }: VictoryModalProps) {

    function handleClickReplayButton(e: any){
        e.preventDefault();
        onClickReplayButton()
    }

  return (
    <div className={styles.root}>
      <div className={styles.window}>
        <div className={styles.content}>
            <h3 className={styles.title}>Parabéns! Você acertou a palavra:</h3>
            <p className={styles.rightWord}>{rightWord}</p>
            <button onClick={handleClickReplayButton} className={styles.replayBtn}>
                JOGAR OUTRA PALAVRA
            </button>
        </div>
      </div>
    </div>
  );
}
