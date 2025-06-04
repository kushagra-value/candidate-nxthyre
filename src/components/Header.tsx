import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Search } from "lucide-react";
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
  { length: 16 },
  (_, i) => `${i} years`
);

export const Header = () => {
  const { searchParams, updateSearchParams, resetSearch } = useSearch();

  const handleNoticePeriodChange = (value: string) => {
    updateSearchParams({ noticePeriod: value });
  };

  const toggleVerifiedOnly = () => {
    updateSearchParams({ verifiedOnly: !searchParams.verifiedOnly });
  };

  const toggleTopTierOnly = () => {
    updateSearchParams({ topTierOnly: !searchParams.topTierOnly });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSearchParams({ keywords: e.target.value });
  };

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1d1e3a] text-white py-4 px-4 md:px-8"
    >

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <div className="">
            <img
              src="/assets/logo2.png"
              alt="logo"
              className="w-24 object-fit  "
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border border-white text-white hover:bg-white hover:text-[#1d1e3a] transition-colors duration-300"
            >
              Export Candidates
            </Button>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-[#1d1e3a] font-semibold text-lg">
              S
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold  ml-20 mt-10 mb-6">
          Find your perfect candidate
        </h1>

          <div className="relative">
          <div className="absolute top-3 left-20 flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4 bg-white rounded-md flex items-center px-3 shadow-lg">
                <Search size={18} className="text-gray-400 mr-2" />
                <TagInput
                  tags={searchParams.skills}
                  onChange={(tags) => updateSearchParams({ skills: tags })}
                  placeholder="Select required skills..."
                  suggestions={skillOptions}
                  className="w-full focus:outline-none text-lg"
                />
              </div>
              <div className="md:col-span-3 bg-white rounded-md flex items-center px-3 shadow-lg">
                <MapPin size={18} className="text-gray-400" />
                <TagInput
                  tags={searchParams.location.split(",").filter(Boolean)}
                  onChange={(locations) =>
                    updateSearchParams({ location: locations.join(",") })
                  }
                  placeholder="Select locations..."
                  suggestions={locationOptions}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2 bg-white rounded-md flex items-center px-3 shadow-lg">
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
                <Button size="lg" className="text-lg text-gray-800 h-full w-full">
                  <Search size={20} className=" text-gray-400 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          <div>
            {/* <div className="">
              <div className="max-w-7xl mx-auto md:px-8 py-3">
                <div className="flex flex-wrap gap-3 items-center text-white">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={resetSearch}
                    className="h-9 bg-gradient-to-r from-gray-300/70 to-gray-300/70 text-white focus:from-blue-500 focus:to-blue-400 hover:from-blue-500 hover:to-blue-400 shadow-md border-0 text-gray-500/70"
                  >
                    Reset all filters
                  </Button>

                  <Button
                    variant={searchParams.verifiedOnly ? "primary" : "outline"}
                    size="md"
                    onClick={toggleVerifiedOnly}
                    className={`bg-gradient-to-r from-gray-300/70 to-gray-300/70 text-gray-600 focus:from-blue-500 focus:to-blue-400 hover:from-blue-500 hover:to-blue-400 shadow-md border-0 text-gray-500/70 ${
                      searchParams.verifiedOnly ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Only Verified Profiles
                  </Button>

                  <Button
                    variant={searchParams.topTierOnly ? "primary" : "outline"}
                    size="md"
                    onClick={toggleTopTierOnly}
                    className={`bg-gradient-to-r from-gray-300/70 to-gray-300/70 text-white focus:from-blue-500 focus:to-blue-400 hover:from-blue-500 hover:to-blue-400 shadow-md border-0 text-gray-500/70 ${
                      searchParams.topTierOnly ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Only Top Tier
                  </Button>


                  <Dropdown
                    options={noticePeriodOptions}
                    value={searchParams.noticePeriod || ""}
                    onChange={handleNoticePeriodChange}
                    placeholder="Notice Period"
                    className="w-44"
                    textSuggestions="text-gray-500/70 hover:text-gray-200"
                    classNameSuggestions="h-[36px] py-0 bg-gradient-to-r from-gray-300/70 to-gray-300/70 text-white focus:from-blue-500 hover:from-blue-500 hover:to-blue-400 focus:to-blue-400 shadow-md text-gray-500/70"
                  />
                </div>
              </div>
            </div> */}
          </div>
        
            </div>
            
          </div>
          <br></br>
          {/* <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSearch}
              className="text-gray-800"
            >
              Reset
            </Button>
          </div> */}
      </div>
    </motion.header>


    </>
  );
};