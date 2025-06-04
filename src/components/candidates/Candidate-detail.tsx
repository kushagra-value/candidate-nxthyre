import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Github, Globe, Linkedin, FileText, Heart, Copy, CheckCircle, Briefcase, Plus, Edit, Trash2, X, Send, ChevronDown, Calendar, Clock, User, GraduationCap, Award, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useSearch } from '../../context/SearchContext';

// Interface definitions remain unchanged
interface Candidate {
  id: string;
  name: string;
  profileImage: string;
  location: string;
  contactInfo: { phone: string; email: string };
  socialLinks: { github?: string; portfolio?: string; linkedin?: string };
  experienceYears: number;
  isVerified: boolean;
  isTopTier: boolean;
  professionalSummary: string;
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

// Mock data for notes, emails, templates, interviews (unchanged)
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
  const { saveCandidate, unsaveCandidate, searchState } = useSearch();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSaved = searchState.savedCandidates.some(c => c.id === id);

  // Fetch candidate data from API
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        setError('Invalid candidate ID');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/resume/${id}`);
        const doc = response.data;
        const mappedCandidate: Candidate = {
          id: doc._id,
          name: doc.name || 'Unknown',
          profileImage: doc.profilePicture || 'https://via.placeholder.com/150',
          location: doc.preferred_location || 'Unknown',
          contactInfo: {
            phone: doc.phone || 'N/A',
            email: doc.email || 'N/A',
          },
          socialLinks: {
            github: doc.github !== 'NA' ? doc.github : undefined,
            portfolio: doc.portfolio_website !== 'NA' ? doc.portfolio_website : undefined,
            linkedin: doc.linkedin !== 'NA' ? doc.linkedin : undefined,
          },
          experienceYears: doc.total_experience || 0,
          isVerified: doc.is_email_verified || false,
          isTopTier: doc.last_graduation_university_tier === 'TOP' || false,
          professionalSummary: doc.professionalSummary || 'No summary provided',
          skills: doc.core_technical_skills_claimed
            ? doc.core_technical_skills_claimed.split(',').map((s: string) => s.trim())
            : [],
          experience: doc.experienceDetails || [],
          education: doc.last_graduation_degree
            ? [{
                id: doc._id,
                degree: doc.last_graduation_degree,
                field: doc.specialization || 'N/A',
                institution: doc.last_graduation_university || 'N/A',
                startYear: doc.last_graduation_year ? doc.last_graduation_year.toString() : 'N/A',
                endYear: doc.last_graduation_year ? doc.last_graduation_year.toString() : 'N/A',
                grade: undefined,
                isVerified: doc.educational_backgroud_verification === 'verified',
              }]
            : [],
          certifications: doc.certifcations_claimed || [],
          awards: doc.awards || [],
          noticePeriod: doc.notice_period || 'N/A',
        };
        setSelectedCandidate(mappedCandidate);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch candidate details');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

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
    if (selectedCandidate) {
      saveCandidate({
        id: selectedCandidate.id,
        name: selectedCandidate.name,
        profilePicture: selectedCandidate.profileImage,
        location: selectedCandidate.location,
        contactInfo: selectedCandidate.contactInfo,
        socialLinks: selectedCandidate.socialLinks,
        experience: selectedCandidate.experienceYears,
        isVerified: selectedCandidate.isVerified,
        isTopTier: selectedCandidate.isTopTier,
        professionalSummary: selectedCandidate.professionalSummary,
        skills: selectedCandidate.skills,
        experienceDetails: selectedCandidate.experience,
        education: selectedCandidate.education,
        certifications: selectedCandidate.certifications,
        awards: selectedCandidate.awards,
        noticePeriod: selectedCandidate.noticePeriod,
        currentSalary: undefined, // Not used in this interface
      });
    }
  };

  const createNewList = (name: string, candidateId: string) => {
    const newList: SavedList = {
      id: `list_${Date.now()}`,
      name,
      candidates: [candidateId]
    };
    setSavedLists(prev => [...prev, newList]);
    if (selectedCandidate) {
      saveCandidate({
        id: selectedCandidate.id,
        name: selectedCandidate.name,
        profilePicture: selectedCandidate.profileImage,
        location: selectedCandidate.location,
        contactInfo: selectedCandidate.contactInfo,
        socialLinks: selectedCandidate.socialLinks,
        experience: selectedCandidate.experienceYears,
        isVerified: selectedCandidate.isVerified,
        isTopTier: selectedCandidate.isTopTier,
        professionalSummary: selectedCandidate.professionalSummary,
        skills: selectedCandidate.skills,
        experienceDetails: selectedCandidate.experience,
        education: selectedCandidate.education,
        certifications: selectedCandidate.certifications,
        awards: selectedCandidate.awards,
        noticePeriod: selectedCandidate.noticePeriod,
        currentSalary: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold mb-4">Loading Candidate Details</h2>
          <p className="text-secondary-600 mb-6">Please wait while we fetch the candidate information...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedCandidate) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-4">Candidate Not Found</h2>
          <p className="text-secondary-600 mb-6">
            {error || "The candidate you're looking for doesn't exist or has been removed."}
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
            <button
              className="flex items-center text-white mr-6 hover:text-secondary-200"
              onClick={() => navigate('/search')}
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Search
            </button>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v6H8.5A3.5 3.5 0 0 1 5 5.5z"></path>
                <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path>
                <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path>
                <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v4H8.5A3.5 3.5 0 0 1 5 19.5z"></path>
                <path d="M12 16h7.5"></path>
                <path d="M12 16v4"></path>
              </svg>
              <span className="ml-2 font-bold text-xl">TalentScout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CandidateProfile */}
            <motion.div
              className="bg-white rounded-lg shadow-card p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <motion.div
                  className="flex-shrink-0 relative mb-4 md:mb-0"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <img
                    src={selectedCandidate.profileImage}
                    alt={selectedCandidate.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-secondary-100"
                  />
                  {selectedCandidate.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-1.5">
                      <CheckCircle size={16} />
                    </div>
                  )}
                  {selectedCandidate.isTopTier && (
                    <div className="absolute top-0 right-0 bg-warning-500 text-white rounded-full p-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className="md:ml-6 flex-grow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                  <div className="flex items-center text-secondary-600 mt-1">
                    <MapPin size={16} className="mr-1" />
                    <span>{selectedCandidate.location}</span>
                  </div>
                  <div className="flex flex-wrap mt-3 gap-3">
                    <div className="flex items-center text-secondary-700">
                      <Phone size={16} className="mr-1" />
                      <span>{selectedCandidate.contactInfo.phone}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedCandidate.contactInfo.phone)}
                        className="ml-1 text-secondary-500 hover:text-secondary-700"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="flex items-center text-secondary-700">
                      <Mail size={16} className="mr-1" />
                      <span>{selectedCandidate.contactInfo.email}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded text-sm inline-flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      {selectedCandidate.experienceYears} years experience
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  className="mt-4 md:mt-0 flex md:flex-col items-center md:items-end gap-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="flex gap-2">
                    {selectedCandidate.socialLinks.github && (
                      <a
                        href={selectedCandidate.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {selectedCandidate.socialLinks.portfolio && (
                      <a
                        href={selectedCandidate.socialLinks.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-secondary-100 p-2 rounded-full text-secondary-700 hover:bg-secondary-200"
                      >
                        <Globe size={18} />
                      </a>
                    )}
                    {selectedCandidate.socialLinks.linkedin && (
                      <a
                        href={selectedCandidate.socialLinks.linkedin}
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
                  <motion.button
                    className="btn-primary flex items-center"
                    onClick={() => {
                      if (isSaved) {
                        unsaveCandidate(selectedCandidate.id);
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bookmark size={16} className={`mr-2 ${isSaved ? 'text-red-500' : ''}`} />
                    {isSaved ? 'Unsave Candidate' : 'Save Candidate'}
                  </motion.button>
                </motion.div>
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
                        <span className="absolute -top-0.5 -right-0.5 badge-primary">3</span>
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
                          <p className="text-secondary-700">{selectedCandidate.professionalSummary}</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.skills.map((skill, index) => (
                              <span key={index} className="tag-primary">{skill}</span>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <h3 className="text-lg font-semibold mb-3">Experience</h3>
                          <div className="space-y-4">
                            {selectedCandidate.experience.map((exp) => (
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
                            {selectedCandidate.education.map((edu) => (
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
                        {selectedCandidate.certifications.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                            <div className="space-y-3">
                              {selectedCandidate.certifications.map((cert) => (
                                <div key={cert.id} className="flex">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                      {/* <CertificateIcon size={18} className="text-secondary-700" /> */}
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
                        {selectedCandidate.awards.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="text-lg font-semibold mb-3">Awards</h3>
                            <div className="space-y-3">
                              {selectedCandidate.awards.map((award) => (
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
                      className="input min-h-[100px] resize-y mb-3"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Save Candidate</h3>
              <button
                className="text-secondary-500 hover:text-secondary-700"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Select List</label>
                <select
                  className="input"
                  onChange={(e) => addCandidateToList(selectedCandidate.id, e.target.value)}
                >
                  <option value="">Select a list</option>
                  {savedLists.map((list) => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Or Create New List</label>
                <input
                  type="text"
                  className="input"
                  placeholder="New list name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      createNewList(e.currentTarget.value.trim(), selectedCandidate.id);
                      e.currentTarget.value = '';
                      setIsModalOpen(false);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="btn-outlined text-sm py-1.5"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary text-sm py-1.5"
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