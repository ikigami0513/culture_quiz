import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DefaultQuestion from "../default_question.png";

interface AnswerProps {
    id: string;
    content: string;
    is_true: boolean;
}

interface QuestionProps {
    id: string;
    category: string;
    content: string;
    picture: string;
    answers: AnswerProps[];
}

export const Quiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<QuestionProps[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [displayedAnswers, setDisplayedAnswers] = useState<AnswerProps[]>([]);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/quiz/?category=${id}`);
                if (!response.ok) {
                    throw new Error("failed to fetch quiz");
                }
                const questions: QuestionProps[] = await response.json();
                setQuestions(questions);
            } catch (error) {
                console.error(`Error fetching data: ${error}`);
            }
        };

        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            const shuffledAnswers = getShuffledAnswers(currentQuestion.answers);
            setDisplayedAnswers(shuffledAnswers);
            setTimeLeft(30); // Reset timer for the new question
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0 && !quizFinished) {
                setTimeLeft(timeLeft - 1);
            } else if (currentQuestionIndex === questions.length - 1) {
                    setQuizFinished(true);
            } else {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerClick = (answerId: string | null) => {
        if (answerId === null) {
            if (currentQuestionIndex === questions.length - 1) {
                setQuizFinished(true);
            } else {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            }
        }
        else {
            displayedAnswers.forEach((answer) => {
                if (answer.id === answerId) {
                    // Colorer en vert si la réponse est correcte, sinon en rouge
                    if (answer.is_true) {
                        document.getElementById(answerId)?.classList.add("bg-green-500", "hover:bg-green-600");
                        setScore(currentScore => currentScore + 1);
                    } else {
                        document.getElementById(answerId)?.classList.add("bg-red-500", "hover:bg-red-600");
                    }
    
                    document.querySelectorAll(".answer_button").forEach((button) => button.setAttribute("disabled", "true"));
                }
            });
        
            setTimeout(() => {
                if (currentQuestionIndex === questions.length - 1) {
                    setQuizFinished(true);
                } else {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                }
            }, 1000);
        }
    };

    const getShuffledAnswers = (answers: AnswerProps[]) => {
        const correctAnswer = answers.find(answer => answer.is_true);
        const incorrectAnswers = answers.filter(answer => !answer.is_true);
        const randomIncorrectAnswers = incorrectAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
        const selectedAnswers = [correctAnswer, ...randomIncorrectAnswers].sort(() => 0.5 - Math.random()).filter(answer => answer !== undefined) as AnswerProps[];
        return selectedAnswers;
    };

    const redirectToHome = () => {
        navigate("/");
    };

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="mx-auto p-4">
            <div className="bg-gray-600 shadow-md rounded-lg overflow-hidden">
                <img
                    src={currentQuestion.picture ? `http://127.0.0.1:8000${currentQuestion.picture}` : DefaultQuestion}
                    alt="Quiz"
                    className="w-auto h-48 mx-auto p-4"
                />
                <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-white">Question {questions.indexOf(currentQuestion) + 1} / {questions.length}</h2>
                    <h2 className="text-2xl font-bold mb-4 text-white">{currentQuestion.content}</h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="block w-full p-2">
                            <div className="text-white">{`Temps restant: ${timeLeft}s`}</div>
                            <div className="flex-grow h-4 bg-gray-400 rounded-full">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-white">
                        Score : {score} / {questions.length}
                        <button
                            onClick={() => handleAnswerClick(null)}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        >
                            Passer la question
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                        {displayedAnswers.map((answer) => (
                            <button
                                key={answer.id}
                                id={answer.id}
                                onClick={() => handleAnswerClick(answer.id)} // Pass answer id to handleAnswerClick
                                className={`answer_button w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600`} // Highlight clicked answer
                            >
                                {answer.content}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {quizFinished && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Quiz Terminé</h2>
                        <p>Votre score final est : {score} / {questions.length}</p>
                        <button onClick={redirectToHome} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 mt-4">
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
