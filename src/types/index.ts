export interface Candidate {
  id: string;
  name: string;
  profilePicture: string;
  location: string;
  experience: number;
  currentSalary: number;
  noticePeriod: number;
  skills: string[];
  isVerified: boolean;
  isTopTier: boolean;
  industry: string;
  education: string;
  verificationStatus: {
    email: boolean;
    linkedin: boolean;
    employment: boolean;
    education: boolean;
  };
  employmentGaps: boolean;
  graduationYear: number;
  university: string;
  universityTier: string;
  hasCertifications: boolean;
  hasAwards: boolean;
  hasSocialProof: boolean;
  expectedCTC: number;
}

export interface SearchParams {
  skills: string[];
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