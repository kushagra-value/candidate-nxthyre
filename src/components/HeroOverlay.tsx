import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TagInput } from './ui/TagInput';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import { useSearch } from '../context/SearchContext';
import { MapPin, Search, SearchIcon } from 'lucide-react';

interface HeroOverlayProps {
  onClose: () => void;
}

const skillOptions = [
  "NET", "AEM", "AI", "API", "AWS", "AWS EC2", "AWS-CWI", "Agentic Ai",
  "Agentic Workflows", "Agile", "Agile Methodology", "Aiml", "Algorithms",
  "Analytics", "Api Automation Testing", "Appium", "Application Development Senior Analyst",
  "Architectural Design", "Artificial Intelligence", "Automated Testing", "BDD Cucumber",
  "Bert", "Browserstack", "Business Intelligence", "C#", "CSS", "Cassandra",
  "Chatbot", "Chatbot Development", "Chatbots", "Ci/Cd", "Classification",
  "Cloud", "Cluster Analysis", "Collections", "Computer Vision", "Conversational Ai",
  "Data Analytics", "Data Driven Testing", "Data Engineering", "Data Science",
  "Data Scientist", "Data Structures", "Data Visualization", "Deep Learning",
  "Deployment", "Dialogflow", "Django", "Docker", "Flask", "Flask Web Framework",
  "Full Stack Developer/Software Developer", "GCP", "GCP Cloud", "GIT", "Gcp Cloud",
  "Gen AI", "GenAI", "Genesys IVR", "Genrative Ai", "Git", "Github", "Google Cloud Services",
  "HTML", "Html And Css", "IBM Watson Analytics", "Image Processing", "Information Retrieval",
  "Insight Generation", "Integration Testing", "IntelliJ Idea", "JIRA", "JScript", "JUnit",
  "Java", "Java Technologies", "Javascript", "Jenkins", "Jira", "Jupyter Notebook",
  "Keras", "Kibana", "Kubernetes", "LLM", "LLM's", "Langchain", "Large Language Model",
  "Lead Engineer", "Llama", "Llm", "Lstm", "Machine Learning", "Matplotlib", "Maven",
  "Mechanical Engineering", "Medical Devices", "Mobile Automation", "MySQL", "NLP",
  "NX-Open", "Natural Language Processing", "Neural Networks", "Nextjs", "Nltk",
  "Node.js", "Numpy", "OCR", "OOPS", "OpenAI", "Opencv", "Palantir", "Panda",
  "Pandas", "Playwright", "Postman", "Power BI", "Power Platform", "Predictive Analytics",
  "Predictive Modeling", "Problem Solving", "Project Management", "Promp", "Pycharm",
  "Pytest", "Python", "Python Data Analytics", "Python Development", "Pytorch", "RAG",
  "Random Forest", "Redis", "Reinforcement Learning", "Requirement Gathering", "Rest Assured",
  "Retrieval Augmented Generation", "Root Cause Analysis", "SQL", "Scikit-Learn", "Scipy",
  "Seaborn", "Selenium", "Software Development", "Software Engineering", "Solution Design",
  "Spring Boot", "Statistical Analysis", "Tableau", "Tensorflow", "Testng", "Testng Framework",
  "Text Analytics", "Text Mining", "TypeScript", "VBA Excel", "Vertex Ai", "Visual Basic",
  "Visual Studio", "Xgboost", "Yolo", "agentic ai", "agile", "algorithms", "analysis",
  "artificial intelligence", "aws lambda", "awsbedrock", "azure", "bitbucket",
  "chatbot development", "ci cd pipeline", "conversation", "crew ai", "css",
  "data analytics", "data mining", "data science", "datascientist", "dbms",
  "deep learning", "dialogflow", "docker", "docker container", "gcp developer",
  "gdf", "gen ai", "generative ai", "github", "html", "hugging phase", "huggingface",
  "java", "javascript", "jenkins", "langchain", "langgraph", "langsmith", "llm",
  "machine learning", "microservices", "mlops", "mongodb", "mysql database",
  "natural language processing", "neural networks", "nlp", "node.js", "python",
  "rag", "react.js", "redis", "sql", "terraform"
];

const locationOptions = [
  'Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Gurgaon', 'Noida', 'Chandigarh', 'Kochi', 'Thiruvananthapuram',
  'Coimbatore', 'Jaipur', 'Indore', 'Bhubaneswar', 'Lucknow', 'Nagpur', 'Vizag',
  "Delhi / NCR", "Goa", "Gurugram", "Kolkata", "Remote"
];

const experienceOptions = Array.from({ length: 16 }, (_, i) => `${i} years`);

export const HeroOverlay = ({ onClose }: HeroOverlayProps) => {
  const { searchParams, updateSearchParams, executeSearch } = useSearch();

  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline
      .from('.hero-title', { opacity: 1, y: 30, duration: 0.8, ease: 'power3.out' })
      .from('.hero-input', { opacity: 1, y: 20, stagger: 0.2, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .from('.hero-button', { opacity: 1, y: 10, duration: 0.5, ease: 'power3.out' }, '-=0.2');
      
    return () => {
      timeline.kill();
      timeline.clear();
    };
  }, []);

  const handleSearch = () => {
    executeSearch();
    onClose();
  };
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren", 
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        when: "afterChildren", 
        staggerChildren: 0.05, 
        staggerDirection: -1 
      }
    }
  };
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 md:p-8"
      >
        <motion.div variants={itemVariants} className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center">
            Find your perfect candidate
          </h1>
        </motion.div>

        

        <div className="space-y-6">
          <div className="hero-input relative z-30">
           <TagInput
           label="Required Skills"
                   tags={searchParams.skills}
                   onChange={(tags) => updateSearchParams({ skills: tags })}
                   placeholder="Select required skills..."
                   suggestions={skillOptions}
                   icon={<Search size={18} className="text-gray-400" />}
                   className="md:col-span-4 "
                 />
          </div>

          <div className="hero-input relative z-20">
            <TagInput
            label='Location'
        tags={searchParams.location.split(",").filter(Boolean)}
        onChange={(locations) =>
          updateSearchParams({ location: locations.join(",") })
        }
        placeholder="Select locations..."
        suggestions={locationOptions}
        icon={<MapPin size={18} className="text-gray-400" />}
        className="md:col-span-3"
      />
            
          </div>

          <div className="hero-input relative z-10">
            <label className="block text-sm font-medium text-gray-600 mb-2">Experience</label>
            <Dropdown
              options={experienceOptions}
              value={`${searchParams.experienceRange[1]} years`}
              onChange={(value) => {
                const years = parseInt(value);
                updateSearchParams({ experienceRange: [0, years] });
              }}
              placeholder="Select experience..."
              className="w-full border border-gray-300 p-2 rounded-md shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 "
              dropdownClassName="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg "
            />
          </div>

          <div className="w-full pt-3 flex justify-left relative z-0">
            <Button
              size="lg"
              onClick={handleSearch}
              className="btn-primary w-full flex items-center justify-center py-3 text-base"
            >
              
              <SearchIcon size={18} className="mr-2" />
            
              Search Candidates
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
