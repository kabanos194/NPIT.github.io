import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Quiz } from '../types';
import { PrintIcon, XIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from './Loader';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const { t } = useLanguage();
  const quizContentRef = useRef<HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);

  React.useEffect(() => {
    // Add class to body to allow print styles to override app layout
    document.body.classList.add('quiz-modal-open');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('quiz-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDownloadPdf = async () => {
    const content = quizContentRef.current;
    if (!content || isDownloading) return;

    setIsDownloading(true);

    const modalContainer = content.parentElement as HTMLElement;
    if (!modalContainer) {
        setIsDownloading(false);
        return;
    }

    // Store original styles to revert them later
    const originalContentStyle = { height: content.style.height, overflow: content.style.overflow };
    const originalContainerStyle = { height: modalContainer.style.height, maxHeight: modalContainer.style.maxHeight };

    // Temporarily modify styles to allow html2canvas to capture the full, un-clipped content
    modalContainer.style.height = 'auto';
    modalContainer.style.maxHeight = 'none';
    content.style.height = 'auto';
    content.style.overflow = 'visible';

    try {
      // Add a small delay to allow the browser to reflow and apply the new styles
      await new Promise(resolve => setTimeout(resolve, 100));
        
      const canvas = await html2canvas(content, {
        scale: 2, // Higher resolution for better quality
        useCORS: true,
        backgroundColor: '#ffffff', // Set a white background for the capture
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate the height of the image in the PDF, maintaining aspect ratio
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if the content is longer than one page
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // Optionally, set an error state here to inform the user
    } finally {
      // Revert styles back to their original values
      content.style.height = originalContentStyle.height;
      content.style.overflow = originalContentStyle.overflow;
      modalContainer.style.height = originalContainerStyle.height;
      modalContainer.style.maxHeight = originalContainerStyle.maxHeight;
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-4xl h-full max-h-[95vh] bg-gray-800 text-gray-200 rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="no-print flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-indigo-400">{quiz.title}</h2>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 px-4 py-2 w-44 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-wait"
                >
                    {isDownloading ? <Loader /> : <PrintIcon className="w-5 h-5" />}
                    {isDownloading ? t('generatingPdf') : t('printQuiz')}
                </button>
                <button 
                    onClick={onClose} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                    aria-label={t('close')}
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </header>

        <main ref={quizContentRef} className="flex-1 overflow-y-auto printable-quiz bg-white text-gray-900 p-5">
            <div>
                <p className="font-bold text-lg text-left mb-4">[______ / {totalPoints} p.]</p>
                <h1 className="text-3xl font-bold text-center mb-2">{quiz.title}</h1>
                <div className="text-center mb-8">
                    <p>Name: __________________________</p>
                    <p>Date: ___________________________</p>
                </div>

                <div className="space-y-8">
                    {quiz.questions.map((q, index) => (
                        <div key={index} className="border-b border-gray-300 pb-4">
                            <p className="font-bold text-lg mb-4">
                                <span className="font-normal text-base mr-2">({q.points || '...'} p.)</span>
                                {t('question')} {index + 1}: {q.questionText}
                            </p>
                            {q.questionType === 'multiple-choice' && (
                                <ul className="space-y-2 list-alpha pl-6">
                                    {q.options.map((option, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="mr-2 font-mono">{String.fromCharCode(65 + i)}.</span> {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                             {q.questionType === 'true-false' && (
                                <div className="pl-6 space-x-8">
                                    <span>True</span>
                                    <span>False</span>
                                </div>
                            )}
                            {q.questionType === 'short-answer' && (
                                <div className="mt-8 border-b-2 border-gray-400 border-dashed"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="page-break pt-8 text-center">
                    <h2 className="text-2xl font-bold mb-6">{t('answerKey')}</h2>
                    <ol className="list-decimal list-inside space-y-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2 text-left max-w-3xl mx-auto">
                        {quiz.questions.map((q, index) => (
                            <li key={index} title={q.correctAnswer}>
                                <span className="font-semibold">{q.correctAnswer}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

// Add a simple list-style-type for the quiz options
const listAlpha = `
  .list-alpha {
    list-style-type: upper-alpha;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = listAlpha;
document.head.appendChild(styleSheet);


export default QuizModal;