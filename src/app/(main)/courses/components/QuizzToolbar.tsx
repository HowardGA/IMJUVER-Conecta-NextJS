import React from "react";
import { Radio, RadioChangeEvent } from "antd";

interface QuizToolbarProps {
    value?: string;
    onChange?: (e: RadioChangeEvent) => void; 
    onSelectedQuestionType: (e: RadioChangeEvent) => void;
}

const QuizToolbar: React.FC<QuizToolbarProps> = ({value, onChange, onSelectedQuestionType}) => {
   const handleRadioChange = (e: RadioChangeEvent) => {
        if (onChange) {
            onChange(e);
        }
        onSelectedQuestionType(e);
    };

    return(
        <Radio.Group value={value} onChange={handleRadioChange} optionType="button" buttonStyle="solid" block>
            <Radio value="SINGLE_CHOICE">Selección Única</Radio>
            <Radio value="MULTIPLE_CHOICE">Selección Múltiple</Radio>
            <Radio value="TRUE_FALSE">Verdadero/Falso</Radio>
        </Radio.Group>
    );
};

export default QuizToolbar;