export interface Candidate {
  id: string;
  name: string;
  profilePicture: string;
  location: string; // Maps to preferred_location
  contactInfo: { phone: string; email: string };
  socialLinks: { github?: string; portfolio?: string; linkedin?: string };
  experience: number; // Maps to total_experience
  isVerified: boolean;
  isTopTier: boolean;
  professionalSummary: string;
  skills: string[]; // Maps to core_technical_skills_claimed (split by commas)
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