import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Github, Globe, Linkedin, FileText, Heart, Copy, CheckCircle, Briefcase, Plus, Edit, Trash2, X, Send, ChevronDown, Calendar, Clock, User, GraduationCap, Award, Bookmark } from 'lucide-react';
import { Tag } from "../ui/Tag";
import { Button } from "../ui/Button";
import { useSearch } from '../../context/SearchContext';

// Mock data (replace with actual data source or props)
interface Candidate {
  id: string;
  name: string;
  profileImage: string;
  location: string;
  contactInfo: { phone: string; email: string };
  socialLinks: { github?: string; portfolio?: string; linkedin?: string };
  experienceYears: number;
  isVerified: boolean;
  currentSalary?: number;
  isTopTier: boolean;
  professionalSummary: string;
  company?: string;
  position?: string;
  skills: string[];
  experience: Array<{
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    isVerified: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    institution: string;
    startYear: string;
    endYear: string;
    grade?: string;
    isVerified: boolean;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialID?: string;
    isVerified: boolean;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  noticePeriod: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Email {
  id: string;
  subject: string;
  content: string;
  date: string;
  isIncoming: boolean;
}

interface Interview {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: {
    technicalSkills: number;
    communication: number;
    problemSolving: number;
    culturalFit: number;
    overall: number;
    comments: string;
  };
}

interface SavedList {
  id: string;
  name: string;
  candidates: string[];
}

const mockCandidates: Candidate[] = [
  // Sample candidate data
  {
    id: '1',
    name: 'John Doe',
    profileImage:'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',

    location: 'New York, NY',
    contactInfo: { phone: '123-456-7890', email: 'john.doe@example.com' },
    socialLinks: { github: 'https://github.com/johndoe', linkedin: 'https://linkedin.com/in/johndoe', portfolio: 'https://johndoe.com' },
    experienceYears: 5,
    isVerified: true,
    isTopTier: true,
    company: 'Tech Solutions Inc.',
    position: 'Senior Full Stack Developer',
    professionalSummary: 'Experienced full-stack developer with a passion for building scalable web applications.',
    skills: ['React', 'Node.js', 'TypeScript'],
    experience: [
      {
        id: 'exp1',
        role: 'Senior Developer',
        company: 'Tech Corp',
        startDate: '2020-01',
        isCurrent: true,
        description: 'Led development of core product features.',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'edu1',
        degree: 'B.S.',
        field: 'Computer Science',
        institution: 'MIT',
        startYear: '2015',
        endYear: '2019',
        grade: '3.8 GPA',
        isVerified: true
      }
    ],
    certifications: [
      {
        id: 'cert1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        issueDate: '2022-06',
        isVerified: true
      }
    ],
    awards: [
      {
        id: 'award1',
        title: 'Employee of the Year',
        issuer: 'Tech Corp',
        date: '2022-12',
        description: 'Recognized for outstanding contributions.'
      }
    ],
    noticePeriod: '2 weeks',
    currentSalary: 12,
  }
];

const mockNotes: Note[] = [
  {
    id: 'note1',
    content: 'Candidate has excellent problem-solving skills.',
    timestamp: '2023-04-18 15:30',
    author: 'Sarah Johnson'
  },
  {
    id: 'note2',
    content: 'Prefers remote work.',
    timestamp: '2023-04-15 11:20',
    author: 'Sarah Johnson'
  }
];

const mockTemplates: EmailTemplate[] = [
  {
    id: 'tmpl1',
    name: 'Initial Contact',
    subject: 'Exciting opportunity at our company',
    body: 'Dear {{name}},\n\nI hope this email finds you well. I came across your profile and I am impressed with your experience in {{skills}}. We have an exciting opportunity at our company that might be a great fit for your skills.\n\nWould you be interested in discussing this further?\n\nBest regards,\nRecruiter Name'
  },
  {
    id: 'tmpl2',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {{role}} Position',
    body: 'Dear {{name}},\n\nThank you for your interest in the {{role}} position at our company. We would like to invite you for an interview to discuss your experience and qualifications further.\n\nPlease let me know your availability in the coming week.\n\nBest regards,\nRecruiter Name'
  },
  {
    id: 'tmpl3',
    name: 'Offer Letter',
    subject: 'Offer Letter - {{role}} Position',
    body: 'Dear {{name}},\n\nWe are pleased to offer you the position of {{role}} at our company. We were impressed with your experience and believe you would be a valuable addition to our team.\n\nPlease find the attached offer letter with all the details.\n\nBest regards,\nRecruiter Name'
  }
];

const mockEmails: Email[] = [
  {
    id: 'email1',
    subject: 'Exciting opportunity at our company',
    content: 'Dear Candidate,\n\nI hope this email finds you well. I came across your profile and I am impressed with your experience. We have an exciting opportunity at our company that might be a great fit for your skills.\n\nWould you be interested in discussing this further?\n\nBest regards,\nRecruiter Name',
    date: '2023-04-15 14:30',
    isIncoming: false
  },
  {
    id: 'email2',
    subject: 'Re: Exciting opportunity at our company',
    content: 'Hello,\n\nThank you for reaching out. I am indeed interested in learning more about this opportunity. Could you please provide more details about the role and the company?\n\nBest regards,\nCandidate',
    date: '2023-04-15 16:45',
    isIncoming: true
  },
  {
    id: 'email3',
    subject: 'Re: Re: Exciting opportunity at our company',
    content: 'Dear Candidate,\n\nThank you for your response. We are a leading tech company specializing in fintech solutions. The role we\'re hiring for is a Senior Full Stack Developer who will be responsible for designing and implementing new features for our core product.\n\nI\'d love to schedule a call to discuss this further. Would you be available sometime next week?\n\nBest regards,\nRecruiter Name',
    date: '2023-04-16 10:15',
    isIncoming: false
  }
];

const mockInterviews: Interview[] = [
  {
    id: 'int1',
    title: 'Initial Technical Screening',
    date: '2023-04-20',
    time: '10:00 AM',
    duration: '45 minutes',
    interviewer: 'John Doe',
    status: 'completed',
    notes: 'Candidate demonstrated good knowledge of React and Node.js. Could improve on system design concepts.',
    feedback: {
      technicalSkills: 4,
      communication: 3,
      problemSolving: 4,
      culturalFit: 5,
      overall: 4,
      comments: 'Strong technical skills, especially in frontend development. Good problem-solving approach. Communicates ideas clearly but could be more concise.'
    }
  },
  {
    id: 'int2',
    title: 'System Design Round',
    date: '2023-04-25',
    time: '02:00 PM',
    duration: '60 minutes',
    interviewer: 'Jane Smith',
    status: 'scheduled'
  }
];

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedLists, setSavedLists] = useState<SavedList[]>([
    { id: '1', name: 'Frontend Developers', candidates: [] },
    { id: '2', name: 'Senior Engineers', candidates: [] },
  ]);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [emails] = useState<Email[]>(mockEmails);
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const [interviews] = useState<Interview[]>(mockInterviews);
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'emails' | 'interviews'>('overview');
const { saveCandidate, searchState } = useSearch();
  const isSaved = searchState.savedCandidates.some(
    (c) => c.id === candidate?.id
  );

  
  // Find the candidate
  const candidate = candidates.find(c => c.id === id);
  
  useEffect(() => {
    if (candidate) {
      setSelectedCandidate(candidate);
    }
    return () => {
      setSelectedCandidate(null);
    };
  }, [candidate]);

  // NotesPanel logic
  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    if (editingNoteId) {
      setNotes(notes.map(note =>
        note.id === editingNoteId
          ? { ...note, content: noteContent, timestamp: new Date().toLocaleString() }
          : note
      ));
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        content: noteContent,
        timestamp: new Date().toLocaleString(),
        author: 'Sarah Johnson'
      };
      setNotes([newNote, ...notes]);
    }
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleEditNote = (note: Note) => {
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleCancelNote = () => {
    setNoteContent('');
    setEditingNoteId(null);
    setIsAddingNote(false);
  };

  // EmailsTab logic
  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setEmailContent(template.body);
    }
    setIsTemplateDropdownOpen(false);
  };

  // InterviewsTab logic
  const toggleFeedback = (interviewId: string) => {
    setShowFeedback({
      ...showFeedback,
      [interviewId]: !showFeedback[interviewId]
    });
  };

  const getStatusBadge = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-800">Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded bg-success-100 text-success-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded bg-error-100 text-error-800">Cancelled</span>;
      default:
        return null;
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-warning-500' : 'text-secondary-300'}`}
            viewBox="0 0 24 24"
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  // SaveCandidateModal logic
  const addCandidateToList = (candidateId: string, listId: string) => {
    setSavedLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, candidates: [...list.candidates, candidateId] }
          : list
      )
    );
  };

  const createNewList = (name: string, candidateId: string) => {
    const newList: SavedList = {
      id: `list_${Date.now()}`,
      name,
      candidates: [candidateId]
    };
    setSavedLists(prev => [...prev, newList]);
  };

  const displayedSkills = candidate?.skills.slice(0, 3);
  let remainingSkills= 0;
  if (candidate?.skills.length) {
  remainingSkills = candidate?.skills.length - 3;
  }
  if (!candidate) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-4">Candidate Not Found</h2>
          <p className="text-secondary-600 mb-6">
            The candidate you're looking for doesn't exist or has been removed.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/search')}
          >
            Back to Search Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-secondary-800 text-white">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center">
            
            <div className="flex items-center">
              
               <img
              src="/assets/logo2.png"
              alt={candidate.name}
              className="w-24 object-fit  "
            />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container max-w-[1320px] mx-auto px-4 py-6">
        <button
              className="absolute top-1 flex items-center text-gray-500 mr-6 hover:text-secondary-500"
              onClick={() => navigate('/search')}
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Search
            </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CandidateProfile */}
            <motion.div
              className="bg-white rounded-lg shadow-card p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }}
            >
              <div className=" bg-white rounded-lg p-4 w-full mx-auto">
        
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
            <motion.div
                  className="flex-shrink-0 relative md:mb-0"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
            <img
              src={candidate.profileImage}
              alt={candidate.name}
              className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-100"
            />
            
                  </motion.div>
        
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {candidate.name}
              {candidate.isVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              )}
              {candidate.isTopTier && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Top Tier
                </span>
              )}
            </h2>
            <p className=" flex flex-col justify-center items-left gap-2 text-sm text-gray-600">
              {" "}
              <span>{candidate.position} • {candidate.company}</span>
              
                      <button
                        onClick={() => navigator.clipboard.writeText(candidate.contactInfo.email)}
                        className="ml-1 text-secondary-500 hover:text-secondary-700"
                      >
                        <span className='flex items-center'><Copy size={14} />{candidate.contactInfo.email}</span>
                      </button>
                      
            </p>
          </div>
          <div className="flex gap-2 ml-48 mb-10"> 
            {candidate.socialLinks.github && (
              <a
                href={candidate.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200"
              >
                <Github size={18} />
              </a>
            )}
            {candidate.socialLinks.portfolio && (
              <a
                href={candidate.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200"
              >
                <Globe size={18} />
              </a>
            )}
            {candidate.socialLinks.linkedin && (
              <a
                href={candidate.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200"
              >
                <Linkedin size={18} />
              </a>
            )}
            <button className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200">
              <FileText size={18} />
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-4 mb-2">
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-sm font-medium text-gray-800">
              <span>{candidate.experienceYears} years</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Notice Period</p>
            <p className="text-sm font-medium text-gray-800">
              <span>{candidate.noticePeriod} days</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current CTC</p>
            <p className="text-sm font-medium text-gray-800">
              {" "}
              <span>₹{candidate.currentSalary} LPA</span>
            </p>
          </div>
          <div className="">
            <Button
              variant={isSaved ? "primary" : "outline"}
              leftIcon={
                <Bookmark
                  size={16}
                  className={isSaved ? "text-white" : "text-indigo-500"}
                />
              }
              onClick={(e) => {
                
                setIsModalOpen(true)
              }}
              disabled={isSaved}
              className="text-gray-800 mt-2"
            >
              {isSaved ? "Saved" : "Save Candidate"}
            </Button>
          </div>
        </div>

        
        <div className="flex justify-between items-center">
          <div></div>
          
        </div>
              </div>
              
            </motion.div>

            {/* ProfileTabs */}
            <motion.div
              className="bg-white rounded-lg shadow-card overflow-hidden mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            >
              <div className="border-b border-secondary-200">
                <div className="flex">
                  {['overview', 'emails', 'interviews'].map((tabId) => (
                    <motion.button
                      key={tabId}
                      className={`px-6 py-3 text-base font-medium border-b-2 transition-colors relative ${
                        activeTab === tabId
                          ? 'border-primary-500 text-primary-700'
                          : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
                      }`}
                      onClick={() => setActiveTab(tabId as any)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                      {tabId === 'emails' && (
                        <span className="bg-green-400 w-4 rounded-full absolute -top-0.5 -right-0.5 badge-primary text-xs">3</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
                          <p className="text-secondary-700">{candidate.professionalSummary}</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                              <span key={index} className="tag-primary">{skill}</span>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Experience</h3>
                          <div className="space-y-4">
                            {candidate.experience.map((exp) => (
                              <div key={exp.id} className="flex">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                    <Briefcase size={18} className="text-secondary-700" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{exp.role}</h4>
                                    {exp.isVerified && (
                                      <CheckCircle size={16} className="ml-2 text-success-500" />
                                    )}
                                  </div>
                                  <div className="text-secondary-600">{exp.company}</div>
                                  <div className="text-sm text-secondary-500 mt-1">
                                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                  </div>
                                  <p className="mt-2 text-secondary-700">{exp.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Education</h3>
                          <div className="space-y-4">
                            {candidate.education.map((edu) => (
                              <div key={edu.id} className="flex">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                    <GraduationCap size={18} className="text-secondary-700" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                                    {edu.isVerified && (
                                      <CheckCircle size={16} className="ml-2 text-success-500" />
                                    )}
                                  </div>
                                  <div className="text-secondary-600">{edu.institution}</div>
                                  <div className="text-sm text-secondary-500 mt-1">
                                    {edu.startYear} - {edu.endYear}
                                  </div>
                                  {edu.grade && (
                                    <div className="mt-1 text-sm text-secondary-700">Grade: {edu.grade}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        {candidate.certifications.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                            <div className="space-y-3">
                              {candidate.certifications.map((cert) => (
                                <div key={cert.id} className="flex">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                     {/* l <CertificateIcon size={18} className="text-secondary-700" /> */}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="flex items-center">
                                      <h4 className="font-medium">{cert.name}</h4>
                                      {cert.isVerified && (
                                        <CheckCircle size={16} className="ml-2 text-success-500" />
                                      )}
                                    </div>
                                    <div className="text-secondary-600">{cert.issuer}</div>
                                    <div className="text-sm text-secondary-500 mt-1">
                                      Issued: {cert.issueDate}
                                      {cert.expiryDate && ` · Expires: ${cert.expiryDate}`}
                                    </div>
                                    {cert.credentialID && (
                                      <div className="mt-1 text-sm text-secondary-700">
                                        Credential ID: {cert.credentialID}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        {candidate.awards.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="text-lg font-semibold mb-3">Awards</h3>
                            <div className="space-y-3">
                              {candidate.awards.map((award) => (
                                <div key={award.id} className="flex">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                      <Award size={18} className="text-secondary-700" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <h4 className="font-medium">{award.title}</h4>
                                    <div className="text-secondary-600">{award.issuer}</div>
                                    <div className="text-sm text-secondary-500 mt-1">
                                      {award.date}
                                    </div>
                                    <p className="mt-1 text-secondary-700">{award.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                    {activeTab === 'emails' && (
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">Email History</h3>
                          <div className="space-y-4">
                            {emails.map((email) => (
                              <div
                                key={email.id}
                                className={`p-4 rounded-lg ${
                                  email.isIncoming ? 'bg-secondary-50' : 'bg-primary-50'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{email.subject}</h4>
                                    <div className="text-xs text-secondary-500 mt-1">{email.date}</div>
                                  </div>
                                  <div className={`text-xs px-2 py-1 rounded ${
                                    email.isIncoming ? 'bg-secondary-200 text-secondary-700' : 'bg-primary-200 text-primary-700'
                                  }`}>
                                    {email.isIncoming ? 'Received' : 'Sent'}
                                  </div>
                                </div>
                                <div className="mt-3 text-secondary-700 whitespace-pre-line">
                                  {email.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">Compose New Email</h3>
                          <div className="space-y-4 bg-white border border-secondary-200 rounded-lg p-4">
                            <div className="flex justify-end">
                              <div className="relative">
                                <button
                                  className="btn-outlined flex items-center"
                                  onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                                >
                                  <FileText size={16} className="mr-2" />
                                  Use Template
                                  <ChevronDown size={16} className="ml-2" />
                                </button>
                                {isTemplateDropdownOpen && (
                                  <div className="dropdown py-1">
                                    {templates.map((template) => (
                                      <button
                                        key={template.id}
                                        className="block w-full text-left px-4 py-2 hover:bg-secondary-100"
                                        onClick={() => handleSelectTemplate(template.id)}
                                      >
                                        {template.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary-700 mb-1">Subject</label>
                              <input
                                type="text"
                                className="input"
                                placeholder="Subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
                              <textarea
                                className="input min-h-[200px] resize-y"
                                placeholder="Write your message here..."
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end">
                              <button className="btn-primary flex items-center">
                                <Send size={16} className="mr-2" />
                                Send Email
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    {activeTab === 'interviews' && (
                      <div className="space-y-6">
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
                          <button className="btn-primary flex items-center">
                            <Plus size={16} className="mr-2" />
                            Schedule Interview
                          </button>
                        </motion.div>
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {interviews.map((interview) => (
                            <motion.div
                              key={interview.id}
                              className="border border-secondary-200 rounded-lg p-4"
                              whileHover={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium text-lg">{interview.title}</h4>
                                    <div className="ml-3">
                                      {getStatusBadge(interview.status)}
                                    </div>
                                  </div>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <Calendar size={16} className="mr-2" />
                                      {interview.date}
                                    </div>
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <Clock size={16} className="mr-2" />
                                      {interview.time} ({interview.duration})
                                    </div>
                                    <div className="flex items-center text-sm text-secondary-600">
                                      <User size={16} className="mr-2" />
                                      {interview.interviewer}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="p-2 text-secondary-500 hover:text-secondary-700 rounded-full hover:bg-secondary-100">
                                    <Edit size={16} />
                                  </button>
                                  <button className="p-2 text-secondary-500 hover:text-error-600 rounded-full hover:bg-secondary-100">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                              {interview.notes && (
                                <div className="mt-3 pt-3 border-t border-secondary-100">
                                  <div className="text-sm font-medium text-secondary-700 mb-1">Notes</div>
                                  <p className="text-secondary-600 text-sm">{interview.notes}</p>
                                </div>
                              )}
                              {interview.feedback && (
                                <div className="mt-3 pt-3 border-t border-secondary-100">
                                  <button
                                    className="text-sm font-medium text-primary-600 flex items-center"
                                    onClick={() => toggleFeedback(interview.id)}
                                  >
                                    {showFeedback[interview.id] ? 'Hide Feedback' : 'Show Feedback'}
                                    <svg
                                      className={`ml-1 w-4 h-4 transform transition-transform ${showFeedback[interview.id] ? 'rotate-180' : ''}`}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                  </button>
                                  {showFeedback[interview.id] && (
                                    <motion.div
                                      className="mt-2 bg-secondary-50 p-3 rounded"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">Technical Skills</div>
                                          {getRatingStars(interview.feedback.technicalSkills)}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">Communication</div>
                                          {getRatingStars(interview.feedback.communication)}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">Problem Solving</div>
                                          {getRatingStars(interview.feedback.problemSolving)}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">Cultural Fit</div>
                                          {getRatingStars(interview.feedback.culturalFit)}
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <div className="text-sm text-secondary-700 mb-1">Overall Rating</div>
                                        <div className="flex items-center">
                                          {getRatingStars(interview.feedback.overall)}
                                          <span className="ml-2 text-lg font-semibold text-secondary-700">
                                            {interview.feedback.overall}/5
                                          </span>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <div className="text-sm text-secondary-700 mb-1">Comments</div>
                                        <p className="text-secondary-600 text-sm">{interview.feedback.comments}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* NotesPanel */}
          <motion.div
            className="bg-white rounded-lg shadow-card overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }}
          >
            <div className="flex justify-between items-center p-4 border-b border-secondary-200">
              <h3 className="font-semibold text-lg">Notes</h3>
              {!isAddingNote && (
                <button
                  className="btn-primary flex items-center text-sm py-1.5"
                  onClick={() => setIsAddingNote(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Note
                </button>
              )}
            </div>
            <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              <AnimatePresence>
                {isAddingNote && (
                  <motion.div
                    className="mb-4 bg-primary-50 p-3 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <textarea
                      className="input min-h-[90px] w-full max-w-[400px] resize-none mb-3"
                      placeholder="Write your note here..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button className="btn-outlined text-sm py-1.5" onClick={handleCancelNote}>
                        Cancel
                      </button>
                      <button className="btn-primary text-sm py-1.5" onClick={handleSaveNote}>
                        {editingNoteId ? 'Update Note' : 'Save Note'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-3">
                <AnimatePresence>
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      className="p-3 border border-secondary-200 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-secondary-500 mb-1">
                          {note.timestamp} · {note.author}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="p-1 text-secondary-500 hover:text-secondary-700 rounded-full hover:bg-secondary-100"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="p-1 text-secondary-500 hover:text-error-600 rounded-full hover:bg-secondary-100"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-secondary-700 text-sm whitespace-pre-line">{note.content}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {notes.length === 0 && !isAddingNote && (
                  <div className="text-center py-8 text-secondary-500">
                    <div className="text-5xl mb-2">📝</div>
                    <p>No notes yet</p>
                    <button
                      className="text-primary-600 font-medium mt-2"
                      onClick={() => setIsAddingNote(true)}
                    >
                      Add your first note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* SaveCandidateModal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[55vh] h-full overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Save Candidate</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="list-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Already Exiting List
                </label>
                <select
                  id="list-select"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  onChange={(e) => addCandidateToList(candidate.id, e.target.value)}
                >
                  <option value="">Select a list</option>
                  {savedLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-list" className="block text-sm font-medium text-gray-700 mb-2">
                  Or Create New List
                </label>
                <input
                  id="new-list"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="DevOps Candidates"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      createNewList(e.currentTarget.value.trim(), candidate.id);
                      e.currentTarget.value = '';
                      setIsModalOpen(false);
                    }
                  }}
                />
              </div>
              <div className="pt-10 flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetailPage;