import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

const Header = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
    <h1 className="text-4xl font-bold">AI Career Compass</h1>
    <p className="text-xl mt-2">Navigate Your Professional Future</p>
  </div>
);

const Footer = () => (
  <div className="bg-gray-800 text-white p-4 mt-8">
    <p className="text-center">&copy; 2024 AI Career Compass | Empowering Career Decisions</p>
  </div>
);

const Home = ({ startAssessment }) => (
  <Card className="mt-6 bg-gradient-to-br from-green-100 to-blue-100 shadow-xl">
    <CardHeader>
      <h2 className="text-3xl font-semibold text-blue-800">Discover Your Ideal Career Path</h2>
    </CardHeader>
    <CardContent>
      <p className="text-lg text-gray-700 mb-4">
        Embark on a journey of self-discovery and professional growth with our AI-powered career guidance system.
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        <li>In-depth personality assessment</li>
        <li>Skills and interests analysis</li>
        <li>AI-driven career recommendations</li>
        <li>Personalized development roadmap</li>
      </ul>
    </CardContent>
    <CardFooter>
      <Button onClick={startAssessment} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
        Start Your Career Journey <ChevronRight className="ml-2" />
      </Button>
    </CardFooter>
  </Card>
);

const Assessment = ({ setCurrentPage }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    { id: 1, text: "What's your preferred work environment?", type: "select", options: ["Office", "Remote", "Hybrid", "Flexible"] },
    { id: 2, text: "Rate your problem-solving skills:", type: "slider", min: 1, max: 10 },
    { id: 3, text: "What's your dream job?", type: "text" },
    { id: 4, text: "Select your top 3 soft skills:", type: "multiSelect", options: ["Communication", "Teamwork", "Leadership", "Adaptability", "Creativity", "Time Management"] },
    { id: 5, text: "How important is work-life balance to you?", type: "slider", min: 1, max: 10 },
    // Add more questions as needed
  ];

  const handleAnswer = (answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questions[currentQuestion].id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('recommendations');
    }, 2000);
  };

  return (
    <Card className="mt-6 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-xl">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-orange-800">Career Assessment</h2>
        <Progress value={(currentQuestion + 1) / questions.length * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div>
            <p className="text-xl mb-4 text-gray-700">{questions[currentQuestion].text}</p>
            {questions[currentQuestion].type === "select" && (
              <Select onValueChange={handleAnswer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {questions[currentQuestion].options.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {questions[currentQuestion].type === "slider" && (
              <Slider
                defaultValue={[5]}
                max={10}
                step={1}
                onValueChange={([value]) => handleAnswer(value)}
                className="mt-4"
              />
            )}
            {questions[currentQuestion].type === "text" && (
              <Input 
                type="text" 
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here"
                className="mt-2"
              />
            )}
            {questions[currentQuestion].type === "multiSelect" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {questions[currentQuestion].options.map(option => (
                  <Button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`bg-orange-200 text-orange-800 hover:bg-orange-300 ${answers[questions[currentQuestion].id]?.includes(option) ? 'bg-orange-400' : ''}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-16 w-16 text-orange-600 animate-pulse" />
            <p className="mt-4 text-lg text-gray-700">Analyzing your responses...</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={nextQuestion} 
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isLoading}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Simulating fetching recommendations from an API
    setRecommendations([
      { career_path: "Software Developer", confidence_score: 85, skills_required: ["JavaScript", "React", "Node.js"] },
      { career_path: "Data Scientist", confidence_score: 75, skills_required: ["Python", "Machine Learning", "Statistics"] },
      { career_path: "UX Designer", confidence_score: 70, skills_required: ["UI Design", "User Research", "Prototyping"] },
    ]);
  }, []);

  return (
    <Card className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl">
      <CardHeader>
        <h2 className="text-3xl font-semibold text-purple-800">Your Career Recommendations</h2>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={recommendations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="career_path" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="confidence_score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        {recommendations.map(recommendation => (
          <Card key={recommendation.career_path} className="mb-4 bg-white shadow">
            <CardHeader>
              <h3 className="text-xl font-semibold text-purple-700">{recommendation.career_path}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Confidence: {recommendation.confidence_score}%</p>
              <h4 className="mt-2 font-semibold">Required Skills:</h4>
              <ul className="list-disc list-inside">
                {recommendation.skills_required.map(skill => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home startAssessment={() => setCurrentPage('assessment')} />;
      case 'assessment':
        return <Assessment setCurrentPage={setCurrentPage} />;
      case 'recommendations':
        return <Recommendations />;
      default:
        return <Home startAssessment={() => setCurrentPage('assessment')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
};

export default App;
