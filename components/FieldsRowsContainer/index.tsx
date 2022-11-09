import React, { useEffect, useMemo, useState } from "react";
import { FieldValue } from "../../pages";
import FieldsRow from "../FieldsRow";
import Input from "../FieldsRow";

interface InputsBlockProps {
  numOfRows: number;
  values: Array<FieldValue>;
  currentRow: number;
  onChangeFieldValue: (values: Array<FieldValue>) => void;
  fieldsPerRow: number;
}

export default function FieldsRowsContainer({
  numOfRows,
  values,
  onChangeFieldValue,
  currentRow,
  fieldsPerRow
}: InputsBlockProps) {

  const triesArr = useMemo(() => new Array(numOfRows).fill(null), [numOfRows]);

  return (
    <div>
      {triesArr.map((_, index) => {
        return (
          <FieldsRow
            disabled={currentRow !== index}
            key={index}
            values={currentRow === index ? values : []}
            onChangeValue={onChangeFieldValue}
            numOfFields={fieldsPerRow}
            currentInput={currentRow}
            rowIndex={index}
          />
        );
      })}
    </div>
  );
}
