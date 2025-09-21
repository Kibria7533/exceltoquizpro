
'use client';

import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Question {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: number;
  time_limit: number;
  image_url?: string;
  explanation?: string;
}

interface QuizUploadProps {
  onQuizCreated?: () => void;
}

export default function QuizUpload({ onQuizCreated }: QuizUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questionsPerQuiz: 10,
    language: 'auto'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'text/csv') {
        setSelectedFile(file);
        processExcelFile(file);
      } else {
        alert('Please upload an Excel file (.xlsx, .xls) or CSV file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      processExcelFile(file);
    }
  };

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        alert('Excel file must contain at least header row and one question');
        return;
      }

      const headers = jsonData[0] as string[];
      const questions: Question[] = [];

      // Find column indices
      const questionTextIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('question text'));
      const questionTypeIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('question type'));
      const option1Idx = headers.findIndex(h => h && h.toString().toLowerCase().includes('option 1'));
      const option2Idx = headers.findIndex(h => h && h.toString().toLowerCase().includes('option 2'));
      const option3Idx = headers.findIndex(h => h && h.toString().toLowerCase().includes('option 3'));
      const option4Idx = headers.findIndex(h => h && h.toString().toLowerCase().includes('option 4'));
      const option5Idx = headers.findIndex(h => h && h.toString().toLowerCase().includes('option 5'));
      const correctAnswerIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('correct answer'));
      const timeLimitIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('time'));
      const imageUrlIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('image'));
      const explanationIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('explanation'));

      if (questionTextIdx === -1 || option1Idx === -1 || option2Idx === -1) {
        alert('Excel file must contain "Question Text", "Option 1", and "Option 2" columns');
        return;
      }

      // Process each row (skip header rows)
      for (let i = 2; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        
        if (!row[questionTextIdx] || typeof row[questionTextIdx] !== 'string') continue;

        const options: string[] = [];
        if (row[option1Idx]) options.push(String(row[option1Idx]));
        if (row[option2Idx]) options.push(String(row[option2Idx]));
        if (row[option3Idx]) options.push(String(row[option3Idx]));
        if (row[option4Idx]) options.push(String(row[option4Idx]));
        if (row[option5Idx]) options.push(String(row[option5Idx]));

        if (options.length < 2) continue;

        const question: Question = {
          question_text: String(row[questionTextIdx]).trim(),
          question_type: questionTypeIdx !== -1 ? String(row[questionTypeIdx] || 'Multiple Choice') : 'Multiple Choice',
          options,
          correct_answer: correctAnswerIdx !== -1 ? parseInt(String(row[correctAnswerIdx])) || 1 : 1,
          time_limit: timeLimitIdx !== -1 ? parseInt(String(row[timeLimitIdx])) || 30 : 30,
          image_url: imageUrlIdx !== -1 ? String(row[imageUrlIdx] || '') : '',
          explanation: explanationIdx !== -1 ? String(row[explanationIdx] || '') : ''
        };

        questions.push(question);
      }

      if (questions.length === 0) {
        alert('No valid questions found in Excel file. Please check the format.');
        return;
      }

      setPreviewQuestions(questions);
      setShowPreview(true);
    } catch (error) {
      console.error('Excel processing error:', error);
      alert('Failed to process Excel file. Please check the file format.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !quizConfig.title || previewQuestions.length === 0) {
      alert('Please select a file, enter a quiz title, and ensure questions are loaded');
      return;
    }

    setUploading(true);

    try {
      // Get user session token with better error handling
      const session = localStorage.getItem('session');
      if (!session) {
        throw new Error('Please log in to upload quizzes');
      }

      let sessionData;
      let token;
      
      try {
        sessionData = JSON.parse(session);
        token = sessionData.access_token;
        
        if (!token) {
          throw new Error('No access token found in session');
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        throw new Error('Invalid session data. Please log in again.');
      }

      // Create quiz using new Edge Function with JWT authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-quiz-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        },
        body: JSON.stringify({
          title: quizConfig.title,
          description: quizConfig.description,
          time_limit: quizConfig.timeLimit,
          questions_per_quiz: quizConfig.questionsPerQuiz,
          language: quizConfig.language,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          questions: previewQuestions,
          questions_count: previewQuestions.length
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedFile(null);
        setPreviewQuestions([]);
        setShowPreview(false);
        setQuizConfig({
          title: '',
          description: '',
          timeLimit: 30,
          questionsPerQuiz: 10,
          language: 'auto'
        });
        if (onQuizCreated) onQuizCreated();
        alert('Quiz created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        
        if (response.status === 401) {
          // Token is invalid or expired, redirect to login
          localStorage.removeItem('session');
          localStorage.removeItem('user');
          throw new Error('Your session has expired. Please log in again.');
        }
        
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to create quiz. Please try again.');
      
      // If it's an authentication error, redirect to login
      if (error.message.includes('log in') || error.message.includes('session')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadDemoFile = () => {
    if (!mounted) return;
    
    const demoData = [
      ['Question Text', 'Question Type', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Correct Answer', 'Time in seconds', 'Image Link', 'Answer explanation'],
      ['Text of the question\n\n(required)', 'Question Type\n\n(default is Multiple Choice)', 'Text for option 1\n\n(required in all cases except open-ended & draw questions)', 'Text for option 2\n\n(required in all cases except open-ended & draw questions)', 'Text for option 3\n\n(optional)', 'Text for option 4\n\n(optional)', 'Text for option 5\n\n(optional)', 'The correct option choice (between 1-5).\n\nLeave blank for "Open-Ended", "Poll", "Draw" and "Fill-in-the-Blank".', 'Time in seconds\n\n(optional, default value is 30 seconds)', 'Link of the image\n\n(optional)', 'Explanation for the answer\n(optional)'],
      ['Which of these is the largest planet in the Solar System?', 'Multiple Choice', 'Earth', 'Mars', 'Mercury', 'Jupiter', 'Pluto', '4', '20', 'https://cdn.pixabay.com/photo/2014/09/08/09/24/solar-system-439046_1280.jpg', 'Jupiter is a gas giant made primarily of hydrogen and helium. Unlike terrestrial planets that have solid surfaces, gas giants like Jupiter don\'t have a well-defined solid surface, allowing them to accumulate more mass in a gaseous form. This composition has allowed Jupiter to grow significantly larger than planets with solid surfaces.'],
      ['What is the capital of France?', 'Multiple Choice', 'London', 'Berlin', 'Paris', 'Madrid', 'Rome', '3', '15', '', 'Paris is the capital and most populous city of France. It has been the capital since 987 AD, and is located in the north-central part of the country.'],
      ['Which year did World War II end?', 'Multiple Choice', '1944', '1945', '1946', '1947', '', '2', '25', '', 'World War II ended in 1945 with the surrender of Japan on September 2, 1945, following the atomic bombings of Hiroshima and Nagasaki.'],
      ['What is the chemical symbol for gold?', 'Multiple Choice', 'Go', 'Gd', 'Au', 'Ag', 'Al', '3', '20', '', 'Au is the chemical symbol for gold, derived from the Latin word "aurum" meaning gold.'],
      ['Which programming language is known for its use in data science?', 'Multiple Choice', 'JavaScript', 'Python', 'HTML', 'CSS', '', '2', '30', '', 'Python is widely used in data science due to its extensive libraries like NumPy, Pandas, and Scikit-learn.']
    ];

    try {
      // Create Excel workbook using SheetJS
      const ws = XLSX.utils.aoa_to_sheet(demoData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Quiz Template');
      
      // Generate Excel file and download
      XLSX.writeFile(wb, 'demo-quiz-template.xlsx');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download demo file. Please try again.');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Quiz</h2>
        <p className="text-gray-600">Upload your Excel file and configure your multilingual quiz</p>
      </div>

      {/* Demo File Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              <i className="ri-file-excel-2-line mr-2"></i>
              Need a template?
            </h3>
            <p className="text-blue-700 text-sm">
              Download our demo Excel file to see the exact format required for quiz creation. 
              Includes sample questions and proper column structure.
            </p>
          </div>
          <button
            onClick={downloadDemoFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
          >
            <i className="ri-download-2-line mr-2"></i>
            Download Demo File
          </button>
        </div>
      </div>

      {/* File Format Guide */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          <i className="ri-information-line mr-2"></i>
          Excel File Format Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Required Columns:</h4>
            <ul className="space-y-1 text-yellow-700">
              <li>• Question Text</li>
              <li>• Question Type</li>
              <li>• Option 1 & Option 2 (minimum)</li>
              <li>• Correct Answer (1-5)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Optional Columns:</h4>
            <ul className="space-y-1 text-yellow-700">
              <li>• Option 3, 4, 5</li>
              <li>• Time in seconds</li>
              <li>• Image Link</li>
              <li>• Answer explanation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : selectedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-file-excel-2-line text-2xl text-green-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">{selectedFile.name}</h3>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {previewQuestions.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {previewQuestions.length} questions loaded
                  </p>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-upload-cloud-2-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {dragActive ? 'Drop your Excel file here' : 'Upload Excel File'}
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports .xlsx, .xls, and .csv files with Bangla/Hindi text
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Quiz Configuration</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              value={quizConfig.title}
              onChange={(e) => setQuizConfig({...quizConfig, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={quizConfig.description}
              onChange={(e) => setQuizConfig({...quizConfig, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              placeholder="Brief description of your quiz"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={quizConfig.timeLimit}
                onChange={(e) => setQuizConfig({...quizConfig, timeLimit: parseInt(e.target.value) || 30})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions per Quiz
              </label>
              <input
                type="number"
                value={quizConfig.questionsPerQuiz}
                onChange={(e) => setQuizConfig({...quizConfig, questionsPerQuiz: parseInt(e.target.value) || 10})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Language
            </label>
            <select
              value={quizConfig.language}
              onChange={(e) => setQuizConfig({...quizConfig, language: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="auto">Auto-detect</option>
              <option value="en">English</option>
              <option value="bn">বাংলা (Bangla)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mixed">Mixed Languages</option>
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || !quizConfig.title || uploading || previewQuestions.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Creating Quiz...
              </span>
            ) : (
              <>
                <i className="ri-magic-line mr-2"></i>
                Create Quiz ({previewQuestions.length} questions)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions Preview */}
      {showPreview && previewQuestions.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            <i className="ri-eye-line mr-2"></i>
            Questions Preview ({previewQuestions.length} questions loaded)
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {previewQuestions.slice(0, 5).map((question, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {index + 1}. {question.question_text}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex} 
                      className={`p-2 rounded-lg text-sm ${
                        optIndex + 1 === question.correct_answer 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {optIndex + 1 === question.correct_answer && <i className="ri-check-line mr-1"></i>}
                      {option}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Type: {question.question_type}</span>
                  <span>Time: {question.time_limit}s</span>
                  {question.image_url && <span>Has Image</span>}
                  {question.explanation && <span>Has Explanation</span>}
                </div>
              </div>
            ))}
            {previewQuestions.length > 5 && (
              <div className="text-center text-gray-500 text-sm">
                ... and {previewQuestions.length - 5} more questions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
