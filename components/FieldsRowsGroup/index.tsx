import React, { useEffect, useMemo, useState } from "react";
import { FieldValue } from "../../pages";
import FieldsRow from "../FieldsRow";
import Input from "../FieldsRow";

interface InputsBlockProps {
  numOfRows: number;
  values: Array<FieldValue>;
  currentRowIndex: number;
  onChangeFieldValue: (values: Array<FieldValue>) => void;
  fieldsPerRow: number;
}

export default function FieldsRowsGroup({
  numOfRows,
  values,
  onChangeFieldValue,
  currentRowIndex,
  fieldsPerRow,
}: InputsBlockProps) {
  const numOfRowsArr = useMemo(
    () => new Array(numOfRows).fill(null),
    [numOfRows]
  );

  return (
    <div>
      {numOfRowsArr.map((_, index) => {
        return (
          <FieldsRow
            key={index}
            disabled={currentRowIndex !== index}
            values={currentRowIndex === index ? values : []}
            onChangeValue={onChangeFieldValue}
            numOfFields={fieldsPerRow}
            currentRowIndex={currentRowIndex}
            rowIndex={index}
          />
        );
      })}
    </div>
  );
}
