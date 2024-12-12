'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { assignGlobalQuizData } from '../data';

const INITIAL_COMPONENTS = [
    { id: 'progress-bar', name: 'Progress Bar' },
    { id: 'question-number', name: 'Question Number' },
    { id: 'timer', name: 'Timer' },
    { id: 'question-text', name: 'Question Text' },
    { id: 'image', name: 'Image' },
    { id: 'options', name: 'Options' },
];

export default function QuizBuilder() {
    const [quizzes, setQuizzes] = useState<{ id: string; components: string[] }[]>([
        { id: 'quiz-1', components: [] },
    ]);
    const [isMounted, setMounted] = useState<boolean>(false)
    const handleDragEnd = (result: any) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        const quizId = destination.droppableId;

        // Add the dropped component to the specific quiz card
        setQuizzes((prevQuizzes) =>
            prevQuizzes.map((quiz) =>
                quiz.id === quizId && !quiz.components.includes(draggableId)
                    ? { ...quiz, components: [...quiz.components, draggableId] }
                    : quiz
            )
        );
    };

    const addQuiz = () => {
        setQuizzes((prev) => [
            ...prev,
            { id: `quiz-${prev.length + 1}`, components: [] },
        ]);
    };
    useEffect(() => {
        assignGlobalQuizData(quizzes)
    }, [quizzes])
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <div className='flex items-center justify-between p-2'>
                <h1 className="text-2xl font-bold mb-4 w-full text-center">Quiz Builder</h1>

                {/* <button
                    onClick={addQuiz}
                    className="bg-green-500 text-white w-[150px] px-4 py-2 rounded-md shadow-md hover:bg-green-600"
                >
                    + Add Quiz
                </button> */}
            </div>
            {isMounted &&

                <div className="flex   p-4">

                    {/* Drag and Drop Context */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/* Draggable Palette */}
                        <div className="flex space-x-4 mb-6">
                            <Droppable droppableId="palette" isDropDisabled>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-gray-200 p-4 rounded-lg w-fit"
                                    >
                                        <h2 className="font-semibold text-lg mb-2">Components</h2>
                                        {INITIAL_COMPONENTS.map((comp, index) => (
                                            <Draggable key={comp.id} draggableId={comp.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
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

                        {/* Quiz Cards */}
                        <div className=" w-full max-w-[400px] ">
                            {quizzes.map((quiz) => (
                                <Droppable key={quiz.id} droppableId={quiz.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`bg-white p-4 shadow-lg rounded-lg relative transition ${snapshot.isDraggingOver ? 'border-2 border-green-500' : 'border border-gray-300'
                                                }`}
                                        >
                                            <h2 className="font-semibold text-lg mb-4">Quiz {quiz.id}</h2>

                                            {/* Render Quiz Components */}
                                            {quiz.components.includes('progress-bar') && (
                                                <div className="w-full h-2 bg-green-500 rounded mb-4" />
                                            )}

                                            <div className="flex justify-between items-center mb-4">
                                                {quiz.components.includes('question-number') && (
                                                    <span className="text-sm font-bold">01/10</span>
                                                )}
                                                {quiz.components.includes('timer') && (
                                                    <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded">
                                                        00:00
                                                    </span>
                                                )}
                                            </div>

                                            {quiz.components.includes('image') && (
                                                <div className="w-full h-40 bg-gray-300 mb-4 rounded" />
                                            )}

                                            {quiz.components.includes('question-text') && (
                                                <p className="text-lg font-semibold mb-4">
                                                    Q. Example question text goes here. This can be a long question.
                                                </p>
                                            )}

                                            {quiz.components.includes('options') && (
                                                <div className="space-y-2">
                                                    <button className="w-full p-2 bg-gray-100 rounded border">
                                                        Option 1
                                                    </button>
                                                    <button className="w-full p-2 bg-gray-100 rounded border">
                                                        Option 2
                                                    </button>
                                                    <button className="w-full p-2 bg-gray-100 rounded border">
                                                        Option 3
                                                    </button>
                                                    <button className="w-full p-2 bg-gray-100 rounded border">
                                                        Option 4
                                                    </button>
                                                </div>
                                            )}

                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>

                    {/* Add Quiz Button */}

                </div>
            }
        </>
    );
}
