'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ViewQuiz() {
    const [quizData, setQuizData] = useState<{
        components: string[];
        questionText: string;
        options: string[];
        correctOption: number | null;
        image: string;
    } | null>(null);

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const storedQuizData = JSON.parse(localStorage.getItem('quizData') || 'null');
        setQuizData(storedQuizData);
    }, []);

    const checkAnswer = () => {
        if (quizData && selectedOption === quizData.correctOption) {
            setFeedback('Correct!');
        } else {
            setFeedback('Incorrect, try again.');
        }
    };

    if (!quizData || quizData.components.length == 0) {
        return (
            <div className="w-full max-w-lg mx-auto p-4 text-center">
                <p className="text-lg font-semibold mb-4">No quiz is present in local storage.</p>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => router.push('/singleQuiz')}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            {quizData.components.includes('progress-bar') && (
                <div className="w-full h-2 bg-green-500 rounded mb-4"></div>
            )}
            <div className="flex justify-between items-center mb-4">
                {quizData.components.includes('question-number') && (
                    <span className="text-sm font-bold">01/10</span>
                )}
                {quizData.components.includes('timer') && (
                    <span className="text-sm font-bold bg-gray-200 px-2 py-1 rounded">
                        00:00
                    </span>
                )}
            </div>
            {quizData.components.includes('image') && (
                <img
                    src={quizData.image || '/placeholder.jpg'}
                    alt="Quiz"
                    className="w-full h-40 object-cover rounded mb-4"
                />
            )}
            {quizData.components.includes('question-text') && (
                <p className="text-lg font-semibold mb-4">{quizData.questionText}</p>
            )}
            {quizData.components.includes('options') && (
                <>
                    <div className="space-y-2">
                        {quizData.options.map((option, index) => (
                            <button
                                key={index}
                                className={`block w-full p-2 rounded-md text-left ${selectedOption === index ? 'bg-blue-200' : 'bg-gray-200'
                                    }`}
                                onClick={() => setSelectedOption(index)}
                            >
                                {option || `Option ${index + 1}`}
                            </button>
                        ))}
                    </div>
                    <button
                        className="block w-full mt-4 bg-green-500 text-white py-2 rounded-lg"
                        onClick={checkAnswer}
                    >
                        Check Answer
                    </button>
                    {feedback && <p className="mt-4 text-center font-bold">{feedback}</p>}
                </>
            )}


        </div>
    );
}
