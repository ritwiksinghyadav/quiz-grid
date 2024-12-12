'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalquizData } from '../data';

export default function QuizPage() {
    const [quizComponents, setQuizComponents] = useState<any[]>([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            // const { data } = await axios.get('/api/quiz/load');
            console.log(GlobalquizData);

            // setQuizComponents(data.data);
        };

        fetchQuiz();
    }, []);

    return (
        <div className="p-4">
            <div className="grid grid-cols-5 gap-2 border w-full h-full">
                {quizComponents.map((comp) => (
                    <div
                        key={comp.id}
                        style={{ gridColumn: comp.position.x, gridRow: comp.position.y }}
                        className="bg-gray-100 border shadow p-4"
                    >
                        {comp.type}
                    </div>
                ))}
            </div>
        </div>
    );
}
