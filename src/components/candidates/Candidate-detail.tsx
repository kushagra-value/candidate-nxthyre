import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Github,
  Globe,
  Linkedin,
  FileText,
  Heart,
  Copy,
  CheckCircle,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  X,
  Send,
  ChevronDown,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Award,
  Bookmark,
} from "lucide-react";
import axios from "axios";
import { useSearch } from "../../context/SearchContext";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://nmxgivyyrilsnibobrbu.supabase.co"; // Replace with your Supabase project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teGdpdnl5cmlsc25pYm9icmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDM2NTQsImV4cCI6MjA2MjE3OTY1NH0.IGQXM9Ym1_0twcN7im5iutSfYTbNE_TzqnvhOgoo_l0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface definitions
interface Candidate {
  id: string;
  name: string;
  profileImage: string;
  location: string;
  contactInfo: { phone: string; email: string };
  linkedIn: string;
  github: string;
  kaggle: string;
  portfolio: string;
  experienceYears: number;
  isVerified: boolean;
  isTopTier: boolean;
  skills: string[];
  skills2: { [key: string]: string };
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
  currentSalary?: string;
  expectedCTC?: string;
  industry: string;
  university: string;
  employmentGaps: boolean;
  universityTier: string;
  graduationYear: number;
  currentCompany: string;
  currentTitle: string;
  resumeParseDate: string;
  specialization: string;
  remoteExperience: string;
  verificationStatus: Array<{
    email: boolean;
    linkedin: boolean;
    employment: boolean;
  }>;
  resume_local_path?: string; // Added for resume path
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
  status: "scheduled" | "completed" | "cancelled";
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

// Mock data
const mockNotes: Note[] = [];
const mockTemplates: EmailTemplate[] = [];
const mockEmails: Email[] = [];
const mockInterviews: Interview[] = [];

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveCandidate, unsaveCandidate, searchState } = useSearch();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedLists, setSavedLists] = useState<SavedList[]>([
    { id: "1", name: "Frontend Developers", candidates: [] },
    { id: "2", name: "Senior Engineers", candidates: [] },
  ]);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [emails] = useState<Email[]>(mockEmails);
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showAllExpert, setShowAllExpert] = useState(false);
  const [showAllIntermediate, setShowAllIntermediate] = useState(false);
  const [showAllBeginner, setShowAllBeginner] = useState(false);
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const [interviews] = useState<Interview[]>(mockInterviews);
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "emails" | "interviews">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSaved = searchState.savedCandidates.some((c) => c.id === id);

  // Function to extract filename and fetch resume from Supabase
  const handleResumeClick = async (resumePath: string | undefined) => {
    if (!resumePath) {
      alert("No resume available for this candidate.");
      return;
    }

    try {
      // Extract base filename (e.g., "output/Akash__Londhe_A2E5BA2B4A.pdf" -> "Akash__Londhe_A2E5BA2B4A")
      // or "imap_downloads/Dhirendra_Singh_2_pdf.pdf" -> "Dhirendra_Singh_2_pdf")
      const fileName = resumePath
        .replace(/^(output|imap_downloads)\//, "") // Remove "output/" or "imap_downloads/" prefix
        .replace(/\.pdf$/, ""); // Remove ".pdf" extension

      // Append .pdf for Supabase storage
      const storageFilePath = fileName;

      // Fetch public URL from Supabase storage
      const { data } = await supabase.storage
        .from("candidate-resumes") // Replace with your Supabase storage bucket name
        .getPublicUrl(storageFilePath);
      
      if (data?.publicUrl) {
      // Handle binary/octet-stream MIME type
      const response = await fetch(data.publicUrl);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.URL.revokeObjectURL(url); // Clean up
    } else {
      throw new Error("Resume URL not found.");
    }

    } catch (err: any) {
      console.error("Error fetching resume:", err);
      alert("Failed to load resume. Please try again later.");
    }
  };

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        setError("Invalid candidate ID");
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching candidate data for ID:", id);
        const response = await axios.get(
          `https://api.nxthyre.com/nxtapi/resume/${id}`
        );
        console.log("Candidate data fetched successfully:", response.data);
        const doc = response.data;
        console.log("Candidate document:", doc);
        console.log(
          "certifications_claimed type:",
          typeof doc.certifications_claimed
        );
        console.log(
          "certifications_claimed value:",
          doc.certifications_claimed
        );
        console.log(
          "core_technical_skills_claimed:",
          doc.core_technical_skills_claimed
        );

        const mappedCandidate: Candidate = {
          id: doc._id,
          name: doc.name || "Unknown",
          profileImage:
            doc.profilePicture ||
            "https://blocks.astratic.com/img/general-img-landscape.png",
          location: doc.preferred_location || "Unknown",
          contactInfo: {
            phone: doc.phone || "N/A",
            email: doc.email || "N/A",
          },
          linkedIn: doc.linkedin || "N/A",
          github: doc.github || "N/A",
          kaggle: doc.kaggle || "N/A",
          portfolio: doc.portfolio_website || "N/A",
          experienceYears: parseFloat(doc.total_experience) || 0,
          isVerified: doc.is_email_verified === true || false,
          isTopTier: doc.last_graduation_university_tier === "TOP" || false,
          skills2: doc.core_technical_skills_claimed || {},
          skills: doc.core_technical_skills_claimed
            ? Object.keys(doc.core_technical_skills_claimed)
            : [],
          experience:
            doc.past_titles && doc.past_titles !== "NA"
              ? doc.past_titles.map((role: string, index: number) => ({
                  id: `${doc._id}_${index}`,
                  role,
                  company: doc.past_companies[index] || "Unknown",
                  startDate: "N/A",
                  endDate: undefined,
                  isCurrent: false,
                  description: "No description provided",
                  isVerified:
                    doc.is_employment_history_verified === true || false,
                }))
              : [],
          education: doc.last_graduation_degree
            ? [
                {
                  id: doc._id,
                  degree: doc.last_graduation_degree,
                  field: doc.specialization || "N/A",
                  institution: doc.last_graduation_university || "N/A",
                  startYear: doc.last_graduation_year
                    ? doc.last_graduation_year.toString()
                    : "N/A",
                  endYear: doc.last_graduation_year
                    ? doc.last_graduation_year.toString()
                    : "N/A",
                  grade: undefined,
                  isVerified:
                    doc.educational_backgroud_verification === "verified",
                },
              ]
            : [],
          certifications: Array.isArray(doc.certifications_claimed)
            ? doc.certifications_claimed.map((cert: any, index: number) => ({
                id: cert.id || `cert_${index}`,
                name: cert.name || "Unknown Certification",
                issuer: cert.issuer || "Unknown Issuer",
                issueDate: cert.issueDate || "N/A",
                expiryDate: cert.expiryDate,
                credentialID: cert.credentialID,
                isVerified: cert.isVerified || false,
              }))
            : doc.certifications_claimed === "NA"
            ? []
            : [],
          awards: Array.isArray(doc.awards) ? doc.awards : [],
          noticePeriod: doc.notice_period || "N/A",
          currentSalary: doc.current_ctc ? `${doc.current_ctc}` : "N/A",
          expectedCTC: doc.expected_ctc ? `${doc.expected_ctc}` : "N/A",
          industry: doc.industry || "N/A",
          university: doc.last_graduation_university || "N/A",
          employmentGaps: doc.employment_gaps || false,
          universityTier: doc.last_graduation_university_tier || "N/A",
          graduationYear: doc.last_graduation_year || 0,
          currentCompany: doc.current_company || "N/A",
          currentTitle: doc.current_title || "N/A",
          specialization: doc.specialization || "N/A",
          remoteExperience: doc.remote_experience || "N/A",
          resumeParseDate: doc.resume_parsed_date || "N/A",
          verificationStatus: [
            {
              email: doc.is_email_verified || false,
              linkedin: doc.is_linkedin_valid || false,
              employment: doc.is_employment_verified || false,
            },
          ],
          resume_local_path: doc.resume_local_path || "", // Map resume_local_path
        };

        console.log("Mapped candidate:", mappedCandidate);
        setSelectedCandidate(mappedCandidate);
      } catch (err: any) {
        setError(
          err.response?.data?.detail || "Failed to fetch candidate details"
        );
        console.error("Error fetching candidate data:", err);
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
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                content: noteContent,
                timestamp: new Date().toLocaleString(),
              }
            : note
        )
      );
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        content: noteContent,
        timestamp: new Date().toLocaleString(),
        author: "Sarah Johnson",
      };
      setNotes([newNote, ...notes]);
    }
    setNoteContent("");
    setIsAddingNote(false);
  };

  const handleEditNote = (note: Note) => {
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleCancelNote = () => {
    setNoteContent("");
    setEditingNoteId(null);
    setIsAddingNote(false);
  };

  const handleLinkClick = (url: string) => {
    if (url && url !== "N/A") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // EmailsTab logic
  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
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
      [interviewId]: !showFeedback[interviewId],
    });
  };

  const getStatusBadge = (status: Interview["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-800">
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded bg-success-100 text-success-800">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs rounded bg-error-100 text-error-800">
            Cancelled
          </span>
        );
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
            className={`w-4 h-4 ${
              star <= rating ? "text-warning-500" : "text-secondary-300"
            }`}
            viewBox="0 0 24 24"
            fill={star <= rating ? "currentColor" : "none"}
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
    setSavedLists((prev) =>
      prev.map((list) =>
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
        linkedIn: selectedCandidate.linkedIn || "",
        github: selectedCandidate.github || "",
        kaggle: selectedCandidate.kaggle || "",
        portfolio: selectedCandidate.portfolio || "",
        experience: selectedCandidate.experienceYears,
        isVerified: selectedCandidate.isVerified,
        isTopTier: selectedCandidate.isTopTier,
        skills: selectedCandidate.skills,
        experienceDetails: selectedCandidate.experience,
        education: selectedCandidate.education,
        certifications: selectedCandidate.certifications,
        awards: selectedCandidate.awards,
        noticePeriod: selectedCandidate.noticePeriod,
        currentSalary: selectedCandidate.currentSalary,
        expectedCTC: selectedCandidate.expectedCTC,
        industry: selectedCandidate.industry,
        university: selectedCandidate.university,
        employmentGaps: selectedCandidate.employmentGaps,
        universityTier: selectedCandidate.universityTier,
        graduationYear: selectedCandidate.graduationYear,
        currentCompany: selectedCandidate.currentCompany,
        currentTitle: selectedCandidate.currentTitle,
        verificationStatus: selectedCandidate.verificationStatus,
      });
    }
  };

  const createNewList = (name: string, candidateId: string) => {
    const newList: SavedList = {
      id: `list_${Date.now()}`,
      name,
      candidates: [candidateId],
    };
    setSavedLists((prev) => [...prev, newList]);
    if (selectedCandidate) {
      saveCandidate({
        id: selectedCandidate.id,
        name: selectedCandidate.name,
        profilePicture: selectedCandidate.profileImage,
        location: selectedCandidate.location,
        contactInfo: selectedCandidate.contactInfo,
        linkedIn: selectedCandidate.linkedIn || "",
        github: selectedCandidate.github || "",
        kaggle: selectedCandidate.kaggle || "",
        portfolio: selectedCandidate.portfolio || "",
        experience: selectedCandidate.experienceYears,
        isVerified: selectedCandidate.isVerified,
        isTopTier: selectedCandidate.isTopTier,
        skills: selectedCandidate.skills,
        experienceDetails: selectedCandidate.experience,
        education: selectedCandidate.education,
        certifications: selectedCandidate.certifications,
        awards: selectedCandidate.awards,
        noticePeriod: selectedCandidate.noticePeriod,
        currentSalary: selectedCandidate.currentSalary,
        expectedCTC: selectedCandidate.expectedCTC,
        industry: selectedCandidate.industry,
        university: selectedCandidate.university,
        employmentGaps: selectedCandidate.employmentGaps,
        universityTier: selectedCandidate.universityTier,
        graduationYear: selectedCandidate.graduationYear,
        currentCompany: selectedCandidate.currentCompany,
        currentTitle: selectedCandidate.currentTitle,
        verificationStatus: selectedCandidate.verificationStatus,
      });
    }
  };

  const groupSkillsByProficiency = (skills: { [key: string]: string }) => {
    const expert: string[] = [];
    const intermediate: string[] = [];
    const beginner: string[] = [];

    Object.entries(skills).forEach(([skill, proficiency]) => {
      switch (proficiency.toLowerCase()) {
        case "expert":
          expert.push(skill);
          break;
        case "intermediate":
          intermediate.push(skill);
          break;
        case "beginner":
          beginner.push(skill);
          break;
        default:
          break;
      }
    });

    return { expert, intermediate, beginner };
  };

  const { expert, intermediate, beginner } = selectedCandidate
    ? groupSkillsByProficiency(selectedCandidate.skills2)
    : { expert: [], intermediate: [], beginner: [] };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold mb-4">
            Loading Candidate Details
          </h2>
          <p className="text-secondary-600 mb-6">
            Please wait while we fetch the candidate information...
          </p>
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
            {error ||
              "The candidate you're looking for doesn't exist or has been removed."}
          </p>
          <button className="btn-primary" onClick={() => navigate("/search")}>
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
                alt="NxtHyre"
                className="w-24 object-fit"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container max-w-[1320px] mx-auto px-4 py-6">
        <button
          className="absolute top-8 left-8 flex items-center text-gray-500 mr-6 hover:text-secondary-500"
          onClick={() => navigate("/search")}
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
              animate={{
                opacity: 1,
                transition: { duration: 0.3, staggerChildren: 0.1 },
              }}
            >
              <div className="bg-white rounded-lg p-4 w-full mx-auto">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                    <motion.div
                      className="flex-shrink-0 relative md:mb-0"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      <img
                        src={selectedCandidate.profileImage}
                        alt={selectedCandidate.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-100"
                      />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedCandidate.name}
                      {selectedCandidate.isVerified && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      {selectedCandidate.isTopTier && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Top Tier
                        </span>
                      )}
                    </h2>
                    <p className="flex flex-col justify-center items-left gap-2 text-sm text-gray-600">
                      <span>
                        {selectedCandidate.currentTitle} • {selectedCandidate.currentCompany}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(selectedCandidate.contactInfo.email)
                        }
                        className="ml-1 text-secondary-500 hover:text-secondary-700"
                      >
                        <span className="flex gap-2 items-center">
                          <Copy size={14} />
                          {selectedCandidate.contactInfo.email}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(selectedCandidate.contactInfo.phone)
                        }
                        className="ml-1 text-secondary-500 hover:text-secondary-700"
                      >
                        <span className="flex gap-2 items-center">
                          <Copy size={14} />
                          {selectedCandidate.contactInfo.phone}
                        </span>
                      </button>
                    </p>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() =>
                        selectedCandidate.github !== "NA" &&
                        handleLinkClick(selectedCandidate.github)
                      }
                      className={`p-2 rounded-full ${
                        selectedCandidate.github !== "NA"
                          ? "bg-secondary-300 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Visit GitHub profile"
                      disabled={selectedCandidate.github === "NA"}
                    >
                      <Github size={18} />
                    </button>
                    <button
                      onClick={() =>
                        selectedCandidate.portfolio !== "NA" &&
                        handleLinkClick(selectedCandidate.portfolio)
                      }
                      className={`p-2 rounded-full ${
                        selectedCandidate.portfolio !== "NA"
                          ? "bg-secondary-300 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Visit portfolio website"
                      disabled={selectedCandidate.portfolio === "NA"}
                    >
                      <Globe size={18} />
                    </button>
                    <button
                      onClick={() =>
                        selectedCandidate.linkedIn !== "NA" &&
                        handleLinkClick(selectedCandidate.linkedIn)
                      }
                      className={`p-2 rounded-full ${
                        selectedCandidate.linkedIn !== "NA"
                          ? "bg-secondary-300 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Visit LinkedIn profile"
                      disabled={selectedCandidate.linkedIn === "NA"}
                    >
                      <Linkedin size={18} />
                    </button>
                    <button
                      onClick={() =>
                        selectedCandidate.kaggle !== "NA" &&
                        handleLinkClick(selectedCandidate.kaggle)
                      }
                      className={`p-2 rounded-full ${
                        selectedCandidate.kaggle !== "NA"
                          ? "bg-secondary-300 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="Visit Kaggle profile"
                      disabled={selectedCandidate.kaggle === "NA"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        className="fill-current text-secondary-400"
                      >
                        <path d="M 10.351562 4 C 10.117563 4 10 4.1165625 10 4.3515625 L 10 27.644531 C 10 27.878531 10.116563 27.996094 10.351562 27.996094 L 12.648438 27.996094 C 12.882437 27.996094 13.001953 27.879531 13.001953 27.644531 L 13.001953 22.808594 L 14.810547 21.085938 L 20.048828 27.75 C 20.190828 27.915 20.354922 28 20.544922 28 L 23.716797 28 C 23.882797 28 23.977 27.952422 24 27.857422 L 23.933594 27.498047 L 17.023438 18.910156 L 23.650391 12.498047 C 23.773391 12.370047 23.730438 12 23.398438 12 L 20.117188 12 C 19.951187 12 19.785141 12.085953 19.619141 12.251953 L 13 18.974609 L 13 4.3515625 C 13 4.1165625 12.883437 4 12.648438 4 L 10.351562 4 z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleResumeClick(selectedCandidate.resume_local_path)}
                      className={`p-2 rounded-full ${
                        selectedCandidate.resume_local_path
                          ? "bg-secondary-300 text-secondary-700 hover:bg-secondary-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label="View resume"
                      disabled={!selectedCandidate.resume_local_path}
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>

                <div className="ml-20 pl-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.experienceYears} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Notice Period</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.noticePeriod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current CTC</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.currentSalary}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Specialization</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.specialization || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remote Experience</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.remoteExperience ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employment Gaps</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.employmentGaps ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Industry</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.industry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Resume Parsed</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedCandidate.resumeParseDate
                        ? new Date(selectedCandidate.resumeParseDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Button
                      variant={isSaved ? "primary" : "outline"}
                      leftIcon={
                        <Bookmark
                          size={16}
                          className={isSaved ? "text-white" : "text-indigo-500"}
                        />
                      }
                      onClick={() => setIsModalOpen(true)}
                      disabled={isSaved}
                      className="text-gray-800 mt-2 w-full"
                    >
                      {isSaved ? "Saved" : "Save Candidate"}
                    </Button>
                  </div>
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
                  {["overview", "emails", "interviews"].map((tabId) => (
                    <motion.button
                      key={tabId}
                      className={`px-6 py-3 text-base font-medium border-b-2 transition-colors relative ${
                        activeTab === tabId
                          ? "border-primary-500 text-primary-700"
                          : "border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300"
                      }`}
                      onClick={() => setActiveTab(tabId as any)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                      {tabId === "emails" && (
                        <span className="bg-green-400 w-4 rounded-full absolute -top-0.5 -right-0.5 badge-primary text-xs">
                          {/* count of emails  */}
                          {}
                        </span>
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
                    {activeTab === "overview" && (
                      <div className="space-y-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="space-y-6">
                              {/* Expert Skills */}
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-2">
                                  Expert
                                </h4>
                                {expert.length === 0 ? (
                                  <p className="text-secondary-600 text-sm">
                                    No expert skills listed
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {(showAllExpert
                                      ? expert
                                      : expert.slice(0, 15)
                                    ).map((skill) => (
                                      <Tag
                                        key={skill}
                                        label={skill}
                                        size="sm"
                                      />
                                    ))}
                                    {expert.length > 15 && (
                                      <button
                                        className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                                        onClick={() =>
                                          setShowAllExpert(!showAllExpert)
                                        }
                                      >
                                        {showAllExpert
                                          ? "Show Less"
                                          : `+${
                                              expert.length - 15
                                            } more skills`}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Intermediate Skills */}
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-2">
                                  Intermediate
                                </h4>
                                {intermediate.length === 0 ? (
                                  <p className="text-secondary-600 text-sm">
                                    No intermediate skills listed
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {(showAllIntermediate
                                      ? intermediate
                                      : intermediate.slice(0, 15)
                                    ).map((skill) => (
                                      <Tag
                                        key={skill}
                                        label={skill}
                                        size="sm"
                                      />
                                    ))}
                                    {intermediate.length > 15 && (
                                      <button
                                        className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                                        onClick={() =>
                                          setShowAllIntermediate(
                                            !showAllIntermediate
                                          )
                                        }
                                      >
                                        {showAllIntermediate
                                          ? "Show Less"
                                          : `+${
                                              intermediate.length - 15
                                            } more skills`}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Beginner Skills */}
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-2">
                                  Beginner
                                </h4>
                                {beginner.length === 0 ? (
                                  <p className="text-secondary-600 text-sm">
                                    No beginner skills listed
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {(showAllBeginner
                                      ? beginner
                                      : beginner.slice(0, 15)
                                    ).map((skill) => (
                                      <Tag
                                        key={skill}
                                        label={skill}
                                        size="sm"
                                      />
                                    ))}
                                    {beginner.length > 15 && (
                                      <button
                                        className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                                        onClick={() =>
                                          setShowAllBeginner(!showAllBeginner)
                                        }
                                      >
                                        {showAllBeginner
                                          ? "Show Less"
                                          : `+${
                                              beginner.length - 15
                                            } more skills`}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        {Array.isArray(selectedCandidate.experience) &&
                          selectedCandidate.experience.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <h3 className="text-lg font-semibold mb-3">
                                Experience
                              </h3>
                              <div className="space-y-4">
                                {selectedCandidate.experience.map((exp) => (
                                  <div key={exp.id} className="flex">
                                    <div className="flex-shrink-0 mt-1">
                                      <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                        <Briefcase
                                          size={18}
                                          className="text-secondary-700"
                                        />
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="flex items-center">
                                        <h4 className="font-medium">
                                          {exp.role}
                                        </h4>
                                        {exp.isVerified && (
                                          <CheckCircle
                                            size={16}
                                            className="ml-2 text-success-500"
                                          />
                                        )}
                                      </div>
                                      <div className="text-secondary-600">
                                        {exp.company}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            Education
                          </h3>
                          <div className="space-y-4">
                            {selectedCandidate.education.map((edu) => (
                              <div key={edu.id} className="flex">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                    <GraduationCap
                                      size={18}
                                      className="text-secondary-700"
                                    />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <h4 className="font-medium">
                                      {edu.degree} in {edu.field}
                                    </h4>
                                    {edu.isVerified && (
                                      <CheckCircle
                                        size={16}
                                        className="ml-2 text-success-500"
                                      />
                                    )}
                                  </div>
                                  <div className="text-secondary-600">
                                    {edu.institution}
                                  </div>
                                  <div className="text-sm text-secondary-500 mt-1">
                                    {parseInt(edu.startYear)}
                                  </div>
                                  {edu.grade && (
                                    <div className="mt-1 text-sm text-secondary-700">
                                      Grade: {edu.grade}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        {Array.isArray(selectedCandidate.certifications) &&
                          selectedCandidate.certifications.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <h3 className="text-lg font-semibold mb-3">
                                Certifications
                              </h3>
                              <div className="space-y-3">
                                {selectedCandidate.certifications.map(
                                  (cert) => (
                                    <div key={cert.id} className="flex">
                                      <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                          {/* <CertificateIcon size={18} className="text-secondary-700" /> */}
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <div className="flex items-center">
                                          <h4 className="font-medium">
                                            {cert.name}
                                          </h4>
                                          {cert.isVerified && (
                                            <CheckCircle
                                              size={16}
                                              className="ml-2 text-success-500"
                                            />
                                          )}
                                        </div>
                                        <div className="text-secondary-600">
                                          {cert.issuer}
                                        </div>
                                        <div className="text-sm text-secondary-500 mt-1">
                                          Issued: {cert.issueDate}
                                          {cert.expiryDate &&
                                            ` · Expires: ${cert.expiryDate}`}
                                        </div>
                                        {cert.credentialID && (
                                          <div className="mt-1 text-sm text-secondary-700">
                                            Credential ID: {cert.credentialID}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        {Array.isArray(selectedCandidate.awards) &&
                          selectedCandidate.awards.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <h3 className="text-lg font-semibold mb-3">
                                Awards
                              </h3>
                              <div className="space-y-3">
                                {selectedCandidate.awards.map((award) => (
                                  <div key={award.id} className="flex">
                                    <div className="flex-shrink-0 mt-1">
                                      <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                                        <Award
                                          size={18}
                                          className="text-secondary-700"
                                        />
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <h4 className="font-medium">
                                        {award.title}
                                      </h4>
                                      <div className="text-secondary-600">
                                        {award.issuer}
                                      </div>
                                      <div className="text-sm text-secondary-500 mt-1">
                                        {award.date}
                                      </div>
                                      <p className="mt-1 text-secondary-700">
                                        {award.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                      </div>
                    )}
                    {activeTab === "emails" && (
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            Email History
                          </h3>
                          <div className="space-y-4">
                            {emails.map((email) => (
                              <div
                                key={email.id}
                                className={`p-4 rounded-lg ${
                                  email.isIncoming
                                    ? "bg-secondary-50"
                                    : "bg-primary-100"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">
                                      {email.subject}
                                    </h4>
                                    <div className="text-xs text-secondary-500 mt-1">
                                      {email.date}
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xs px-2 py-1 rounded ${
                                      email.isIncoming
                                        ? "bg-secondary-200 text-secondary-700"
                                        : "bg-primary-200 text-primary-700"
                                    }`}
                                  >
                                    {email.isIncoming ? "Received" : "Sent"}
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
                        >
                          <h3 className="text-lg font-semibold mb-3">
                            Compose New Email
                          </h3>
                          <div className="space-y-4 bg-white border border-secondary-200 rounded-lg p-4">
                            <div className="flex justify-end">
                              <div className="relative">
                                <button
                                  className="btn-outlined flex items-center"
                                  onClick={() =>
                                    setIsTemplateDropdownOpen(
                                      !isTemplateDropdownOpen
                                    )
                                  }
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
                                        onClick={() =>
                                          handleSelectTemplate(template.id)
                                        }
                                      >
                                        {template.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Subject
                              </label>
                              <input
                                type="text"
                                className="input"
                                placeholder="Subject"
                                value={emailSubject}
                                onChange={(e) =>
                                  setEmailSubject(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Message
                              </label>
                              <textarea
                                className="input min-h-[200px] resize-y"
                                placeholder="Write your message here..."
                                value={emailContent}
                                onChange={(e) =>
                                  setEmailContent(e.target.value)
                                }
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
                    {activeTab === "interviews" && (
                      <div className="space-y-6">
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-lg font-semibold">
                            Upcoming Interviews
                          </h3>
                          <button className="btn-primary flex items-center">
                            <Plus size={16} className="mr-2" />
                            Schedule Interview
                          </button>
                        </motion.div>
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {interviews.map((interview) => (
                            <motion.div
                              key={interview.id}
                              className="border border-secondary-200 rounded-lg p-4"
                              whileHover={{
                                boxShadow:
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium text-lg">
                                      {interview.title}
                                    </h4>
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
                                <div className="mt-3 pt-3 border-t border-secondary-200">
                                  <div className="text-sm font-medium text-secondary-700 mb-1">
                                    Notes
                                  </div>
                                  <p className="text-secondary-600 text-sm">
                                    {interview.notes}
                                  </p>
                                </div>
                              )}
                              {interview.feedback && (
                                <div className="mt-3 pt-3 border-t border-secondary-200">
                                  <button
                                    className="text-sm font-medium text-primary-600 flex items-center"
                                    onClick={() => toggleFeedback(interview.id)}
                                  >
                                    {showFeedback[interview.id]
                                      ? "Hide Feedback"
                                      : "Show Feedback"}
                                    <svg
                                      className={`ml-1 w-4 h-4 transform transition-transform ${
                                        showFeedback[interview.id]
                                          ? "rotate-180)"
                                          : ""
                                      }`}
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
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">
                                            Technical Skills
                                          </div>
                                          {getRatingStars(
                                            interview.feedback.technicalSkills
                                          )}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">
                                            Communication
                                          </div>
                                          {getRatingStars(
                                            interview.feedback.communication
                                          )}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">
                                            Problem Solving
                                          </div>
                                          {getRatingStars(
                                            interview.feedback.problemSolving
                                          )}
                                        </div>
                                        <div>
                                          <div className="text-sm text-secondary-700 mb-1">
                                            Cultural Fit
                                          </div>
                                          {getRatingStars(
                                            interview.feedback.culturalFit
                                          )}
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <div className="text-sm text-secondary-700 mb-1">
                                          Overall Rating
                                        </div>
                                        <div className="flex items-center">
                                          {getRatingStars(
                                            interview.feedback.overall
                                          )}
                                          <span className="ml-2 text-lg font-semibold text-secondary-700">
                                            {interview.feedback.overall}/5
                                          </span>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <div className="text-sm text-secondary-700 mb-1">
                                          Comments
                                        </div>
                                        <p className="text-secondary-600 text-sm">
                                          {interview.feedback.comments}
                                        </p>
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
            className="bg-white rounded-lg shadow-card overflow-hidden p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { type: "spring", stiffness: 100, damping: 15 },
            }}
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
                      <button
                        className="btn-outlined text-sm py-1.5"
                        onClick={handleCancelNote}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary text-sm py-1.5"
                        onClick={handleSaveNote}
                      >
                        {editingNoteId ? "Update Note" : "Save Note"}
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
                          {note.timestamp} • {note.author}
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
                      <p className="text-secondary-700 text-sm whitespace-pre-line">
                        {note.content}
                      </p>
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
            className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[55vh] h-full overflow-y-auto shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Save Candidate
              </h3>
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
                <label
                  htmlFor="list-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select an Existing List
                </label>
                <select
                  id="list-select"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  onChange={(e) =>
                    addCandidateToList(selectedCandidate.id, e.target.value)
                  }
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
                <label
                  htmlFor="new-list"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Or Create New List
                </label>
                <input
                  id="new-list"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="New List Name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      createNewList(
                        e.currentTarget.value.trim(),
                        selectedCandidate.id
                      );
                      e.currentTarget.value = "";
                      setIsModalOpen(false);
                    }
                  }}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
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