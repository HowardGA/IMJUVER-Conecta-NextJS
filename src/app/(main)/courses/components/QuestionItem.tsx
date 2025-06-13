import React, { useEffect } from 'react';
import {
    Form, Button, Space, Row, Col, Input, Checkbox, Radio
} from 'antd';
import { UpOutlined, DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import QuizToolbar from './QuizzToolbar';
import type { RadioChangeEvent } from 'antd/es/radio';

import { Quiz, Preguntas, Respuestas } from '@/services/courseServices'; 


interface QuestionItemProps {
    name: number; 
    index: number;
    remove: (index: number | number[]) => void;
    reorderQuestions: (currentIndex: number, newIndex: number) => void;
    fieldsLength: number;
    form: import('antd/es/form/Form').FormInstance<Quiz>;
}
type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';


const QuestionItem: React.FC<QuestionItemProps> = ({
    name,
    index,
    remove,
    reorderQuestions,
    fieldsLength,
    form
}) => {
    const currentQuestionType: QuestionType | undefined = Form.useWatch(['preguntas', name, 'tipo_pregunta'], form) as QuestionType | undefined;
    const currentAnswers: Respuestas[] | undefined = Form.useWatch(['preguntas', name, 'respuestas'], form);

    useEffect(() => {
        const currentQuestionAnswers: Respuestas[] | undefined = form.getFieldValue(['preguntas', name, 'respuestas']);
        const currentQuestionTypeVal: QuestionType | undefined = form.getFieldValue(['preguntas', name, 'tipo_pregunta']) as QuestionType | undefined;

        if (currentQuestionTypeVal && (!currentQuestionAnswers || currentQuestionAnswers.length === 0)) {
            if (currentQuestionTypeVal === 'TRUE_FALSE') {
                form.setFieldsValue({
                    preguntas: form.getFieldValue('preguntas')?.map((q: Preguntas, qIndex: number) =>
                        qIndex === name
                            ? { ...q, respuestas: [{ texto_respuesta: 'Verdadero', correcta: false }, { texto_respuesta: 'Falso', correcta: false }] }
                            : q
                    )
                });
            } else if (currentQuestionTypeVal === 'SINGLE_CHOICE' || currentQuestionTypeVal === 'MULTIPLE_CHOICE') {
                form.setFieldsValue({
                    preguntas: form.getFieldValue('preguntas')?.map((q: Preguntas, qIndex: number) =>
                        qIndex === name
                            ? { ...q, respuestas: [{ texto_respuesta: '', correcta: false }] }
                            : q
                    )
                });
            }
        }
    }, [name, currentQuestionType, form]); 

    const onSelectedQuestionTypeForThisQuestion = (e: RadioChangeEvent) => {

        const allQuestions: Preguntas[] | undefined = form.getFieldValue('preguntas');

        if (allQuestions && allQuestions[name]) {
            const updatedQuestions = [...allQuestions]; 
            updatedQuestions[name].tipo_pregunta = e.target.value as QuestionType; 

            if (e.target.value === 'TRUE_FALSE') {
                updatedQuestions[name].respuestas = [
                    { texto_respuesta: 'Verdadero', correcta: false },
                    { texto_respuesta: 'Falso', correcta: false },
                ];
            } else {
                const currentAnswersForTypeChange: Respuestas[] | undefined = updatedQuestions[name].respuestas;
                if (!currentAnswersForTypeChange || currentAnswersForTypeChange.length === 0) {
                    updatedQuestions[name].respuestas = [{ texto_respuesta: '', correcta: false }];
                } else {

                    updatedQuestions[name].respuestas = currentAnswersForTypeChange.map((ans: Respuestas) => ({
                        ...ans,
                        correcta: false
                    }));
                }
            }
            form.setFieldsValue({ preguntas: updatedQuestions });
        }
    };

    const handleSingleChoiceCorrectnessChange = (e: RadioChangeEvent) => {
        const selectedAnswerIndex = e.target.value as number; 
        
        const allQuestions: Preguntas[] | undefined = form.getFieldValue('preguntas');

        if (allQuestions && allQuestions[name]) {
            const currentQuestion: Preguntas = allQuestions[name]; 

            if (currentQuestion && currentQuestion.respuestas) {
                
                const updatedAnswers: Respuestas[] = currentQuestion.respuestas.map((ans: Respuestas, idx: number) => ({
                    ...ans,
                    correcta: idx === selectedAnswerIndex
                }));
                currentQuestion.respuestas = updatedAnswers;
                form.setFieldsValue({ preguntas: allQuestions });
            }
        }
    };

    const correctOptionIndex: number | undefined = currentAnswers?.findIndex((ans: Respuestas) => ans.correcta === true);
    const singleChoiceCorrectValue: number | null = currentAnswers?.findIndex((ans: Respuestas) => ans.correcta === true) ?? null;

    return (
        <Space direction="vertical" style={{ width: '100%', border: '2px dashed var(--ant-color-primary )', padding: '16px', marginBottom: '16px', borderRadius: '4px', position: 'relative' }}>
            <Row gutter={16} align="middle" style={{ width: '100%' }}>
                <Col span={20}>
                    <Form.Item
                        name={[name, 'texto_pregunta']}
                        label={`Pregunta ${index + 1}`}
                        rules={[{ required: true, message: 'El texto de la pregunta es requerida' }]}
                        style={{ marginBottom: 0 }}
                    >
                        <Input placeholder="Ej: Que es un framework?" />
                    </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    {fieldsLength > 1 && (
                        <>
                            <Button
                                type="text"
                                icon={<UpOutlined />}
                                onClick={() => reorderQuestions(index, index - 1)}
                                disabled={index === 0}
                                title="Mover arriba"
                            />
                            <Button
                                type="text"
                                icon={<DownOutlined />}
                                onClick={() => reorderQuestions(index, index + 1)}
                                disabled={index === fieldsLength - 1}
                                title="Mover abajo"
                            />
                            <MinusCircleOutlined
                                onClick={() => remove(name)}
                                style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer' }}
                                title="Eliminar pregunta"
                            />
                        </>
                    )}
                </Col>
            </Row>
            <Form.Item
                name={[name, 'tipo_pregunta']}
                label="Selecciona el tipo de pregunta"
                rules={[{ required: true, message: 'Tipo de pregunta es requerido' }]}
                style={{ width: '100%' }}
            >
                <QuizToolbar onSelectedQuestionType={onSelectedQuestionTypeForThisQuestion} />
            </Form.Item>
            <Form.Item
                label="Opciones de respuestas"
                rules={[{ required: true, message: 'Las opciones son requeridas' }]}
                style={{ width: '100%' }}
            >
                <Form.List name={[name, 'respuestas']}>
                    {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                        <>
                            {currentQuestionType === 'TRUE_FALSE' ? (
                                <Radio.Group
                                    value={correctOptionIndex}
                                    onChange={handleSingleChoiceCorrectnessChange}
                                >
                                    <Radio value={0}>Verdadero</Radio>
                                    <Radio value={1}>Falso</Radio>
                                </Radio.Group>
                            ) : (
                                <>
                                    {answerFields.map(({ key: answerKey, name: answerName, ...answerRestField }, answerIndex) => (
                                        <Space key={answerKey} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...answerRestField}
                                                name={[answerName, 'texto_respuesta']}
                                                rules={[{ required: true, message: 'El texto de la opción es requerida' }]}
                                                style={{ flexGrow: 1 }}
                                            >
                                                <Input placeholder={`Opción ${answerIndex + 1}`} />
                                            </Form.Item>
                                            {currentQuestionType === 'SINGLE_CHOICE' && (
                                                <Form.Item noStyle>
                                                    <Radio.Group
                                                        value={singleChoiceCorrectValue}
                                                        onChange={handleSingleChoiceCorrectnessChange}
                                                    >
                                                        <Radio value={answerIndex} />
                                                    </Radio.Group>
                                                </Form.Item>
                                            )}
                                            {currentQuestionType === 'MULTIPLE_CHOICE' && (
                                                <Form.Item
                                                    {...answerRestField}
                                                    name={[answerName, 'correcta']}
                                                    valuePropName="checked"
                                                    noStyle
                                                >
                                                    <Checkbox/>
                                                </Form.Item>
                                            )}
                                            {answerFields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    onClick={() => removeAnswer(answerName)}
                                                    style={{ fontSize: '16px', color: '#ff4d4f', cursor: 'pointer' }}
                                                />
                                            ) : null}
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => addAnswer({ texto_respuesta: '', correcta: false })} block icon={<PlusOutlined />}>
                                            Agregar Opción
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </>
                    )}
                </Form.List>
            </Form.Item>
        </Space>
    );
};

export default QuestionItem;