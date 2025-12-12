
import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../constants';

const QuizFaso: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('quiz_best_score');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const handleAnswerOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent double click

    setSelectedOption(index);
    const correct = index === QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < QUIZ_QUESTIONS.length) {
        setCurrentQuestionIndex(nextQuestion);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
        if (score + (correct ? 1 : 0) > bestScore) {
            const newBest = score + (correct ? 1 : 0);
            setBestScore(newBest);
            localStorage.setItem('quiz_best_score', newBest.toString());
        }
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
        <div className="container mx-auto px-4 py-8 min-h-full flex flex-col items-center justify-center md:justify-center">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#FCD116] my-4">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EF3340] to-[#009E60] p-6 text-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Connais-tu ton Faso ?</h2>
                    <div className="mt-2 flex justify-between text-white/90 font-bold text-sm">
                        <span>Question {currentQuestionIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                        <span>Meilleur Score: {bestScore}</span>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {showScore ? (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">
                                {score > QUIZ_QUESTIONS.length / 2 ? '🎉' : '📚'}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Terminé !</h3>
                            <p className="text-gray-600 mb-6">Vous avez obtenu un score de :</p>
                            <div className="text-5xl font-black text-[#009E60] mb-8">
                                {score} / {QUIZ_QUESTIONS.length}
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-8 italic">
                                {score === QUIZ_QUESTIONS.length ? "Excellent ! Un vrai patriote !" : 
                                score > QUIZ_QUESTIONS.length / 2 ? "Bravo ! Belle culture générale." : 
                                "Continuez d'apprendre avec FASOAGENT !"}
                            </p>

                            <button 
                                onClick={resetQuiz}
                                className="bg-[#EF3340] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
                            >
                                Rejouer
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                                {QUIZ_QUESTIONS[currentQuestionIndex].question}
                            </h3>

                            <div className="space-y-3">
                                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, index) => {
                                    let btnClass = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
                                    
                                    if (selectedOption !== null) {
                                        if (index === QUIZ_QUESTIONS[currentQuestionIndex].correctAnswer) {
                                            btnClass = "bg-green-100 border-[#009E60] text-[#009E60]";
                                        } else if (index === selectedOption) {
                                            btnClass = "bg-red-100 border-[#EF3340] text-[#EF3340]";
                                        } else {
                                            btnClass = "opacity-50";
                                        }
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerOptionClick(index)}
                                            disabled={selectedOption !== null}
                                            className={`w-full p-4 rounded-xl border-2 font-semibold text-left transition-all ${btnClass}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedOption !== null && (
                                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-bold">💡 Info : </span>
                                        {QUIZ_QUESTIONS[currentQuestionIndex].explanation}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuizFaso;
