'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import Link from 'next/link';

type QuizData = {
    components: string[];
    questionText: string;
    options: string[];
    correctOption: number | null;
    image: string;
};

const INITIAL_QUIZ_DATA: QuizData = {
    components: [],
    questionText: 'Question Text goes here...',
    options: ['Answer Option Default', 'Answer Option Default', 'Answer Option Default', 'Answer Option Default'],
    correctOption: null,
    image: '',
};

const INITIAL_COMPONENTS = [
    { id: 'progress-bar', name: 'Progress Bar' },
    { id: 'question-number', name: 'Question Number' },
    { id: 'timer', name: 'Timer' },
    { id: 'question-text', name: 'Question Text' },
    { id: 'image', name: 'Image' },
    { id: 'options', name: 'Options' },
];

const QuizBuilder: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizData>(INITIAL_QUIZ_DATA);
    const [isMount, setMount] = useState<boolean>(false)
    useEffect(() => {
        const storedQuizData = JSON.parse(localStorage.getItem('quizData') || JSON.stringify(INITIAL_QUIZ_DATA));
        setQuizData(storedQuizData);
        setMount(true)
    }, []);

    useEffect(() => {
        localStorage.setItem('quizData', JSON.stringify(quizData));
    }, [quizData]);

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (!quizData.components.includes(draggableId)) {
            setQuizData((prev) => ({
                ...prev,
                components: [...prev.components, draggableId],
            }));
        }
    };

    const deleteComponent = (componentId: string) => {
        setQuizData((prev) => {
            const updatedComponents = prev.components.filter((id) => id !== componentId);
            const updatedData = { ...prev, components: updatedComponents };

            if (componentId === 'question-text') updatedData.questionText = '';
            if (componentId === 'options') updatedData.options = ['', '', '', ''];
            if (componentId === 'image') updatedData.image = '';

            return updatedData;
        });
    };

    const updateOption = (index: number, value: string) => {
        setQuizData((prev) => {
            const updatedOptions = [...prev.options];
            updatedOptions[index] = value;
            return { ...prev, options: updatedOptions };
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setQuizData((prev) => ({ ...prev, image: e.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const setQuestionText = (text: string) => {
        setQuizData((prev) => ({ ...prev, questionText: text }));
    };

    const setCorrectOption = (index: number) => {
        setQuizData((prev) => ({ ...prev, correctOption: index }));
    };
    const resetQuiz = () => {
        localStorage.removeItem('quizData');
        setQuizData(INITIAL_QUIZ_DATA);
    };
    return (
        <div className="flex p-4 space-x-4">
            {isMount &&
                <DragDropContext onDragEnd={handleDragEnd}>
                    {/* Palette Section */}
                    <div className="w-1/4 bg-gray-200 p-4 rounded-lg">
                        <h2 className="font-semibold text-lg mb-2">Components</h2>
                        <Droppable droppableId="palette" isDropDisabled>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {INITIAL_COMPONENTS.map((comp, index) => (
                                        <Draggable key={comp.id} draggableId={comp.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    className="p-2 mb-2 bg-blue-500 text-white rounded-md cursor-pointer"
                                                >
                                                    {comp.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Quiz Builder Section */}
                    <Droppable droppableId="quiz">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="w-2/4 bg-white p-4 rounded-lg shadow-lg border border-gray-300"
                            >
                                <h2 className="font-semibold text-lg mb-4">Quiz Preview</h2>
                                {quizData.components.includes('progress-bar') && (
                                    <div className='w-full h-fit relative'>
                                        <div className="w-full h-2 bg-green-500 rounded mb-4" />
                                        <span
                                            className="absolute -top-6 right-0 text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                            onClick={() => deleteComponent('progress-bar')}
                                        >
                                            x
                                        </span>
                                    </div>

                                )}
                                <div className="flex justify-between items-center mb-4">
                                    {quizData.components.includes('question-number') && (
                                        <div className='relative w-fit h-fit '>
                                            <span className="text-sm font-bold">01/10</span>
                                            <span
                                                className="absolute  -right-6 text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                                onClick={() => deleteComponent('question-number')}
                                            >
                                                x
                                            </span>
                                        </div>
                                    )}
                                    {quizData.components.includes('timer') && (
                                        <div className='relative w-fit h-fit '>

                                            <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded">
                                                00:00
                                            </span>
                                            <span
                                                className="absolute  -right-4 text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                                onClick={() => deleteComponent('timer')}
                                            >
                                                x
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {quizData.components.includes('image') && (
                                    <div className='relative w-full h-fit '>

                                        <img src={quizData.image || '/placeholder.jpg'} alt="Uploaded" className="w-full h-40 object-cover rounded" />
                                        <span
                                            className="absolute  top-0 -right-4 text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                            onClick={() => deleteComponent('image')}
                                        >
                                            x
                                        </span>
                                    </div>
                                )}
                                {quizData.components.includes('question-text') && (
                                    <div className='relative w-full h-fit '>

                                        <p className="text-lg font-semibold">Q. {quizData.questionText}</p>
                                        <span
                                            className="absolute  top-0 -right-4 text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                            onClick={() => deleteComponent('question-text')}
                                        >
                                            x
                                        </span>
                                    </div>
                                )}
                                {quizData.components.includes('options') && (
                                    <div className="space-y-2 border rounded-md p-2">
                                        <div className='flex items-center justify-between'>
                                            <p className='font-bold'>
                                                Options
                                            </p>
                                            <span
                                                className=" text-red-500 cursor-pointer py-[0px] px-[5px] rounded-full border-2"
                                                onClick={() => deleteComponent('options')}
                                            >
                                                x
                                            </span>
                                        </div>
                                        {quizData.options.map((option, index) => (
                                            <div key={index} className="p-2 bg-gray-200 rounded-md">
                                                <span>{option || `Option ${index + 1}`}</span>
                                                <input
                                                    type="radio"
                                                    name="correct-option"
                                                    className="ml-2"
                                                    checked={quizData.correctOption === index}
                                                    onChange={() => setCorrectOption(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            }
            {/* Settings Panel */}
            <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">Component Settings</h2>
                {quizData.components.includes('question-text') && (
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Question Text</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={quizData.questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </div>
                )}
                {quizData.components.includes('options') && (
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Options</label>
                        {quizData.options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                className="w-full p-2 mb-2 border rounded"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                            />
                        ))}
                    </div>
                )}
                {quizData.components.includes('image') && (
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Upload Image</label>
                        <input type="file" className="w-full p-2 border rounded" onChange={handleImageUpload} />
                    </div>
                )}
                <Link href="/view">
                    <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg">View Quiz</button>
                </Link>
                <button className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg" onClick={resetQuiz}>Reset</button>

            </div>
        </div >
    );
};

export default QuizBuilder;
