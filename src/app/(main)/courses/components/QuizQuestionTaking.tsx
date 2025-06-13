'use client';
import React from 'react';
import { Form, Radio, Checkbox, Space, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';

import { QuizQuestionForTaking } from '@/services/courseServices';

const { Title } = Typography;

interface QuizQuestionTakingProps {
    question: QuizQuestionForTaking;
    questionIndex: number;
    onAnswerChange: (pregunta_id: number, selected_respuesta_ids: number[]) => void;
    currentSelectedAnswerIds: number[];
}

const QuizQuestionTaking: React.FC<QuizQuestionTakingProps> = ({
    question,
    questionIndex,
    onAnswerChange,
    currentSelectedAnswerIds,
}) => {
    const handleRadioChange = (e: RadioChangeEvent) => {
        onAnswerChange(question.pregunta_id, [e.target.value as number]);
    };

    // --- FIX HERE: Define the type for checkedValues directly ---
    const handleCheckboxChange = (checkedValues: number[]) => {
        onAnswerChange(question.pregunta_id, checkedValues);
    };

    const isTrueFalse = question.tipo_pregunta === 'TRUE_FALSE';

    return (
        <Space direction="vertical" style={{ width: '100%', marginBottom: '24px', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '8px' }}>
            <Title level={4}>{`Pregunta ${questionIndex + 1}: ${question.texto_pregunta}`}</Title>

            <Form.Item
                rules={[{ required: true, message: 'Por favor, selecciona una respuesta.' }]}
            >
                {question.tipo_pregunta === 'SINGLE_CHOICE' && (
                    <Radio.Group
                        value={currentSelectedAnswerIds[0] ?? null}
                        onChange={handleRadioChange}
                    >
                        <Space direction="vertical">
                            {question.respuestas.map((respuesta) => (
                                <Radio key={respuesta.respuesta_id} value={respuesta.respuesta_id}>
                                    {respuesta.texto_respuesta}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                )}

                {isTrueFalse && (
                    <Radio.Group
                        value={currentSelectedAnswerIds[0] ?? null}
                        onChange={handleRadioChange}
                    >
                        <Space direction="vertical">
                            <Radio value={question.respuestas[0]?.respuesta_id}>Verdadero</Radio>
                            <Radio value={question.respuestas[1]?.respuesta_id}>Falso</Radio>
                        </Space>
                    </Radio.Group>
                )}

                {question.tipo_pregunta === 'MULTIPLE_CHOICE' && (
                    <Checkbox.Group
                        value={currentSelectedAnswerIds}
                        onChange={handleCheckboxChange}
                    >
                        <Space direction="vertical">
                            {question.respuestas.map((respuesta) => (
                                <Checkbox key={respuesta.respuesta_id} value={respuesta.respuesta_id}>
                                    {respuesta.texto_respuesta}
                                </Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                )}
            </Form.Item>
        </Space>
    );
};

export default QuizQuestionTaking;