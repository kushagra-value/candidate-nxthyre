import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Search, ChevronDown, Upload } from "lucide-react";
import { Button } from "./ui/Button";
import { TagInput } from "./ui/TagInput";
import { Dropdown } from "./ui/Dropdown";
import { useSearch } from "../context/SearchContext";
import { noticePeriodOptions } from "../data/mockData";


const skillOptions: Array<string> = [
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
  "rag", "react.js", "redis", "sql", "terraform",
];

const locationOptions: Array<string> = [
  "Ahmedabad", "Bengaluru", "Chennai", "Delhi / NCR", "Goa", "Gurugram",
  "Hyderabad", "Indore", "Kochi", "Kolkata", "Lucknow", "Mumbai",
  "Mumbai (All Areas)", "Noida", "Pune", "Remote", "Thiruvananthapuram",
];

const experienceOptions: string[] = Array.from(
  { length: 50 },
  (_, i) => `${i} years`
);

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

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSearchParams({ keywords: e.target.value });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#080736] text-white py-6 px-4 md:px-8 shadow-lg"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
           <div className="">
            <img
              src="/assets/logo2.png"
              alt="logo"
              className="w-24 object-fit  "
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
            
            className="flex items-center space-x-2 text-sm border border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-800"
          >
            <Upload size={18} />
            <span>Export Candidates</span>
          </button>
             <div className="flex items-center space-x-1 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
              S
            </div>
            <span className="hidden md:inline">Steve</span>
            <ChevronDown size={16} />
          </div>
          </div>
        </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-white ml-18 pl-7 mt-20 mb-6">
          Find your perfect candidate
        </h1>

        <div className="relative mb-10">
          <div className="absolute top-3 pl-7 left-18 flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <TagInput
        tags={searchParams.skills}
        onChange={(tags) => updateSearchParams({ skills: tags })}
        placeholder="Select required skills..."
        suggestions={skillOptions}
        icon={<Search size={18} className="text-gray-400" />}
        className="md:col-span-4"
      />
              <TagInput
        tags={searchParams.location.split(",").filter(Boolean)}
        onChange={(locations) =>
          updateSearchParams({ location: locations.join(",") })
        }
        placeholder="Select locations..."
        suggestions={locationOptions}
        icon={<MapPin size={18} className="text-gray-400" />}
        className="md:col-span-3"
      />
              <div className="border border-gray-300 md:col-span-2 bg-white rounded-md flex items-center  px-3 shadow-lg">
                <Briefcase size={18} className="text-gray-400 mr-2" />
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
              <div className="md:col-span-3 bg-white rounded-md flex items-center shadow-lg">
                <Button
                  size="lg"
                  onClick={executeSearch}
                  className="text-lg text-gray-800 h-full w-full"
                >
                  <Search size={20} className=" text-gray-400 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            {/* <div className="mt-4">
              <textarea
                value={searchParams.keywords || ""}
                onChange={handleKeywordsChange}
                placeholder="Enter additional keywords or notes..."
                className="w-full md:w-3/4 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent resize-y min-h-[80px] text-gray-800"
              />
            </div> */}

            {/* <div className="mt-6 flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                size="md"
                onClick={resetSearch}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-colors duration-300"
              >
                Reset All Filters
              </Button>
              <Button
                variant={searchParams.verifiedOnly ? "primary" : "outline"}
                size="md"
                onClick={toggleVerifiedOnly}
                className={`${
                  searchParams.verifiedOnly
                    ? "bg-[#4f46e5] text-white"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
                } transition-colors duration-300`}
              >
                Only Verified Profiles
              </Button>
              <Button
                variant={searchParams.topTierOnly ? "primary" : "outline"}
                size="md"
                onClick={toggleTopTierOnly}
                className={`${
                  searchParams.topTierOnly
                    ? "bg-[#4f46e5] text-white"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
                } transition-colors duration-300`}
              >
                Only Top Tier
              </Button>
              <Dropdown
                options={noticePeriodOptions}
                value={searchParams.noticePeriod || ""}
                onChange={handleNoticePeriodChange}
                placeholder="Notice Period"
                className="w-44 bg-white/10 text-white border-white/20 hover:bg-gray/20 focus:ring-[#4f46e5] rounded-lg"
                textSuggestions="text-white"
                classNameSuggestions="py-2 bg-[#2a2b5a] hover:bg-[#3a3b6a] text-white border-white/10"
              /> */}
            {/* </div> */}
          </div>
        </div>
        </div>
      </div>
    </motion.header>
  );
};