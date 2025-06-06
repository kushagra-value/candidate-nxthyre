export interface Candidate {
  id: string;
  name: string;
  profilePicture: string;
  location: string;
  contactInfo: { phone: string; email: string };
  socialLinks: { github?: string; portfolio?: string; linkedin?: string };
  experience: number;
  isVerified: boolean;
  isTopTier: boolean;
  professionalSummary: string;
  skills: string[];
  experienceDetails: Array<{
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
    isVerified: boolean;
  }>;
  education: string; // Changed from array to string to match educationLevel filter
  industry: string; // Added to match industry filter
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
  noticePeriod: string; // Ensured as string to match working filter
  currentSalary?: string;
  expectedCTC?: string;
  university: string;
  company: string;
  position: string;
  universityTier: string; // Added to match universityTier filter
  employmentGaps: boolean; // Added to match employmentGaps filter
  graduationYear: number; // Added to match graduationYearRange filter
  verificationStatus: {
    email: boolean;
    linkedin: boolean;
    employment: boolean;
    education: boolean;
  };
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface Email {
  id: string;
  subject: string;
  content: string;
  date: string;
  isIncoming: boolean;
}

export interface Interview {
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

export interface SavedList {
  id: string;
  name: string;
  candidates: string[];
}

export interface SearchParams {
  skills: string[];
  keywords: string;
  location: string;
  experienceRange: [number, number];
  verifiedOnly: boolean;
  topTierOnly: boolean;
  noticePeriod: string | null;
  industry: string[];
  educationLevel: string[];
  verificationStatus: {
    email: boolean;
    linkedin: boolean;
    employment: boolean;
    education: boolean;
  };
  employmentGaps: boolean;
  graduationYearRange: [number, number];
  university: string;
  universityTier: string[];
  hasCertifications: boolean;
  hasAwards: boolean;
  hasSocialProof: boolean;
  currentSalaryRange: string[];
  expectedCTCRange: string[];
}

export interface SearchState {
  isSearching: boolean;
  hasSearched: boolean;
  results: Candidate[];
  totalResults: number;
  currentPage: number;
  savedCandidates: Candidate[];
  favorableCandidates: Candidate[];
}