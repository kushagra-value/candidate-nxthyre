import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Power } from 'lucide-react';
import { Button } from './ui/Button';
import { TagInput } from './ui/TagInput';
import { Dropdown } from './ui/Dropdown';
import { useSearch } from '../context/SearchContext';
import { noticePeriodOptions } from '../data/mockData';

const skillOptions: Array<string> = [
  'NET', 'AEM', 'AI', 'API', 'AWS', 'AWS EC2', 'AWS-CWI', 'Agentic Ai', 'Agentic Workflows', 'Agile', 'Agile Methodology', 'Aiml', 'Algorithms', 'Analytics', 'Api Automation Testing', 'Appium', 'Application Development Senior Analyst', 'Architectural Design', 'Artificial Intelligence', 'Automated Testing', 'BDD Cucumber', 'Bert', 'Browserstack', 'Business Intelligence', 'C#', 'CSS', 'Cassandra', 'Chatbot', 'Chatbot Development', 'Chatbots', 'Ci/Cd', 'Classification', 'Cloud', 'Cluster Analysis', 'Collections', 'Computer Vision', 'Conversational Ai', 'Data Analytics', 'Data Driven Testing', 'Data Engineering', 'Data Science', 'Data Scientist', 'Data Structures', 'Data Visualization', 'Deep Learning', 'Deployment', 'Dialogflow', 'Django', 'Docker', 'Flask', 'Flask Web Framework', 'Full Stack Developer/Software Developer', 'GCP', 'GCP Cloud', 'GIT', 'Gcp Cloud', 'Gen AI', 'GenAI', 'Genesys IVR', 'Genrative Ai', 'Git', 'Github', 'Google Cloud Services', 'HTML', 'Html And Css', 'IBM Watson Analytics', 'Image Processing', 'Information Retrieval', 'Insight Generation', 'Integration Testing', 'IntelliJ Idea', 'JIRA', 'JScript', 'JUnit', 'Java', 'Java Technologies', 'Javascript', 'Jenkins', 'Jira', 'Jupyter Notebook', 'Keras', 'Kibana', 'Kubernetes', 'LLM', 'LLM\'s', 'Langchain', 'Large Language Model', 'Lead Engineer', 'Llama', 'Llm', 'Lstm', 'Machine Learning', 'Matplotlib', 'Maven', 'Mechanical Engineering', 'Medical Devices', 'Mobile Automation', 'MySQL', 'NLP', 'NX-Open', 'Natural Language Processing', 'Neural Networks', 'Nextjs', 'Nltk', 'Node.js', 'Numpy', 'OCR', 'OOPS', 'OpenAI', 'Opencv', 'Palantir', 'Panda', 'Pandas', 'Playwright', 'Postman', 'Power BI', 'Power Platform', 'Predictive Analytics', 'Predictive Modeling', 'Problem Solving', 'Project Management', 'Promp', 'Pycharm', 'Pytest', 'Python', 'Python Data Analytics', 'Python Development', 'Pytorch', 'RAG', 'Random Forest', 'Redis', 'Reinforcement Learning', 'Requirement Gathering', 'Rest Assured', 'Retrieval Augmented Generation', 'Root Cause Analysis', 'SQL', 'Scikit-Learn', 'Scipy', 'Seaborn', 'Selenium', 'Software Development', 'Software Engineering', 'Solution Design', 'Spring Boot', 'Statistical Analysis', 'Tableau', 'Tensorflow', 'Testng', 'Testng Framework', 'Text Analytics', 'Text Mining', 'TypeScript', 'VBA Excel', 'Vertex Ai', 'Visual Basic', 'Visual Studio', 'Xgboost', 'Yolo', 'agentic ai', 'agile', 'algorithms', 'analysis', 'artificial intelligence', 'aws lambda', 'awsbedrock', 'azure', 'bitbucket', 'chatbot development', 'ci cd pipeline', 'conversation', 'crew ai', 'css', 'data analytics', 'data mining', 'data science', 'datascientist', 'dbms', 'deep learning', 'dialogflow', 'docker', 'docker container', 'gcp developer', 'gdf', 'gen ai', 'generative ai', 'github', 'html', 'hugging phase', 'huggingface', 'java', 'javascript', 'jenkins', 'langchain', 'langgraph', 'langsmith', 'llm', 'machine learning', 'microservices', 'mlops', 'mongodb', 'mysql database', 'natural language processing', 'neural networks', 'nlp', 'node.js', 'python', 'rag', 'react.js', 'redis', 'sql', 'terraform'
];

const locationOptions: Array<string> = [
  'Ahmedabad',
  'Bengaluru',
  'Chennai',
  'Delhi / NCR',
  'Goa',
  'Gurugram',
  'Hyderabad',
  'Indore',
  'Kochi',
  'Kolkata',
  'Lucknow',
  'Mumbai',
  'Mumbai (All Areas)',
  'Noida',
  'Pune',
  'Remote',
  'Thiruvananthapuram'
];

const experienceOptions: string[] = Array.from({ length: 16 }, (_, i) => `${i} years`);

export const Header = () => {
  const { searchParams, updateSearchParams, executeSearch, resetSearch } = useSearch();
  
  const handleNoticePeriodChange = (value: string) => {
    updateSearchParams({ noticePeriod: value });
    executeSearch();
  };
  
  const toggleVerifiedOnly = () => {
    updateSearchParams({ verifiedOnly: !searchParams.verifiedOnly });
    executeSearch();
  };
  
  const toggleTopTierOnly = () => {
    updateSearchParams({ topTierOnly: !searchParams.topTierOnly });
    executeSearch();
  };
  
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 text-white py-6 px-4 md:px-8 sticky top-0 z-10 shadow-md"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Find your perfect candidate</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TagInput
              tags={searchParams.skills}
              onChange={(tags) => updateSearchParams({ skills: tags })}
              placeholder="Select required skills..."
              suggestions={skillOptions}
            />
            
            <TagInput
              tags={searchParams.location.split(',').filter(Boolean)}
              onChange={(locations) => updateSearchParams({ location: locations.join(',') })}
              placeholder="Select locations..."
              suggestions={locationOptions}
            />
            
            <Dropdown
              options={experienceOptions}
              value={`${searchParams.experienceRange[1]} years`}
              onChange={(value) => {
                const years = parseInt(value);
                updateSearchParams({ experienceRange: [0, years] });
              }}
              placeholder="Select experience..."
              className="w-full"
            />
          </div>
          <br></br>
          <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSearch}
                className="text-gray-800"
              >
                Reset
              </Button>
              
              <Button
                size="sm"
                onClick={executeSearch}
                className="text-gray-800"
              >
                Search
              </Button>
            </div>
        </div>
      </motion.header>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant={searchParams.verifiedOnly ? 'primary' : 'outline'}
              size="sm"
              onClick={toggleVerifiedOnly}
              className={searchParams.verifiedOnly ? 'text-white' : 'text-gray-800'}
            >
              Only Verified Profiles
            </Button>
            
            <Button
              variant={searchParams.topTierOnly ? 'primary' : 'outline'}
              size="sm"
              onClick={toggleTopTierOnly}
              className={searchParams.topTierOnly ? 'text-white' : 'text-gray-800'}
            >
              Only Top Tier
            </Button>
            
            <Dropdown
              options={noticePeriodOptions}
              value={searchParams.noticePeriod || ''}
              onChange={handleNoticePeriodChange}
              placeholder="Notice Period"
              className="w-44"
            />
            
            
          </div>
        </div>
      </div>
    </>
  );
};