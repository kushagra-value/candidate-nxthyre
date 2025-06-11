// SearchContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { SearchParams, SearchState, Candidate } from '../types';

interface SearchContextType {
  searchParams: SearchParams;
  searchState: SearchState;
  updateSearchParams: (params: Partial<SearchParams>) => void;
  executeSearch: () => void;
  resetSearch: () => void;
  saveCandidate: (candidate: Candidate) => void;
  unsaveCandidate: (candidateId: string) => void;
}

const defaultSearchParams: SearchParams = {
  skills: [],
  keywords: '',
  location: '',
  experienceRange: [0, 15],
  verifiedOnly: false,
  topTierOnly: false,
  noticePeriod: null,
  industry: [],
  educationLevel: [],
  verificationStatus: {
    email: false,
    linkedin: false,
    employment: false,
    education: false,
  },
  employmentGaps: false,
  graduationYearRange: [2000, 2025],
  university: '',
  universityTier: [],
  hasCertifications: false,
  hasAwards: false,
  hasSocialProof: false,
  currentSalaryRange: [],
  expectedCTCRange: [],
};

const defaultSearchState: SearchState = {
  isSearching: false,
  hasSearched: false,
  results: [],
  totalResults: 0,
  currentPage: 1,
  savedCandidates: [],
  favorableCandidates: [],
};

// Load saved results from localStorage
const loadSavedResults = (): Candidate[] => {
  try {
    const saved = localStorage.getItem('searchResults');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Basic validation to ensure parsed data matches Candidate interface
      if (Array.isArray(parsed) && parsed.every(item => item.id && item.name)) {
        return parsed;
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading saved results from localStorage:', error);
    return [];
  }
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [searchState, setSearchState] = useState<SearchState>({
    ...defaultSearchState,
    results: loadSavedResults(),
    totalResults: loadSavedResults().length,
    hasSearched: loadSavedResults().length > 0,
    favorableCandidates: loadSavedResults().slice(0, 5),
  });

  // Save results to localStorage whenever searchState.results changes
  useEffect(() => {
    try {
      localStorage.setItem('searchResults', JSON.stringify(searchState.results));
    } catch (error) {
      console.error('Error saving results to localStorage:', error);
    }
  }, [searchState.results]);

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  const executeSearch = async () => {
    setSearchState((prev) => ({ ...prev, isSearching: true }));
    

    try {
      const filterInput = {
        skills: searchParams.skills.length > 0 ? searchParams.skills : undefined,
        locations: searchParams.location ? searchParams.location.split(',').map((loc) => loc.trim()) : undefined,
        experience: searchParams.experienceRange[1] > 0 ? searchParams.experienceRange[1] : undefined,
        keywords: searchParams.keywords || undefined,
      };

      const response = await axios.post('https://api.nxthyre.com/nxtapi/filter-resumes/', filterInput, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Search response:', response.data);

      const candidates: Candidate[] = response.data.map((doc: any) => ({
        id: doc._id,
        name: doc.name || 'Unknown',
        profilePicture: doc.profilePicture || 'https://blocks.astratic.com/img/general-img-landscape.png',
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
        experience: doc.total_experience || 0,
        isVerified: doc.is_email_verified || false,
        isTopTier: doc.last_graduation_university_tier === 'TOP' || false,
        professionalSummary: doc.professionalSummary || '',
        skills: doc.core_technical_skills_claimed
  ? Object.keys(doc.core_technical_skills_claimed)
  : [],
        experienceDetails: doc.experienceDetails || [],
        education: doc.last_graduation_degree
          ? [{
              id: doc._id,
              degree: doc.last_graduation_degree,
              field: doc.specialization || 'N/A',
              institution: doc.last_graduation_university || 'N/A',
              startYear: doc.last_graduation_year ? doc.last_graduation_year.toString() : 'N/A',
              endYear: doc.last_graduation_year ? doc.last_graduation_year.toString() : 'N/A',
              isVerified: doc.educational_backgroud_verification === 'verified',
            }]
          : [],
        certifications: doc.certifcations_claimed || [],
        awards: doc.awards || [],
        noticePeriod: doc.notice_period || 'N/A',
        currentSalary: doc.current_ctc || 'N/A',
        expectedCTC: doc.expected_ctc || 'N/A',
        industry: doc.industry_knowledge || 'N/A',
        university: doc.last_graduation_university || 'N/A',
        employmentGaps:doc.has_employement_gaps || false,
        universityTier:doc.last_graduation_university_tier || 'N/A',
        graduationYear:doc.last_graduation_year || 0,
        verificationStatus: {
          email: doc.is_email_verified || false,
          linkedin: doc.is_linkedin_valid || false,
          employment: doc.is_employement_history_verified || false,
        },
        currentCompany: doc.current_company || 'N/A',
        currentTitle: doc.current_title || 'N/A',
      }));

      const filteredCandidates = candidates.filter((candidate) => {
        if (searchParams.verifiedOnly && !candidate.isVerified) return false;
        if (searchParams.topTierOnly && !candidate.isTopTier) return false;
        if (searchParams.noticePeriod) {
          const days = parseInt(searchParams.noticePeriod.replace(/\D/g, '')) || 0;
          const candidateDays = parseInt(candidate.noticePeriod.replace(/\D/g, '')) || 0;
          if (candidateDays > days) return false;
        }
        // Filter by skills
      if (searchParams.skills.length > 0) {
        const hasAllSkills = searchParams.skills.every(skill =>
          candidate.skills.includes(skill)
        );
        if (!hasAllSkills) return false;
      }
      
      // // Filter by location
      if (searchParams.location) {
        const locations = searchParams.location.split(',').filter(Boolean);
        if (locations.length > 0 && !locations.includes(candidate.location.split(',')[0].trim())) {
          return false;
        }
      }

      // Filter by industry
      if (searchParams.industry.length > 0) {
        if (!searchParams.industry.includes(candidate.industry)) return false;
      }

      // // // Filter by education level
      // if (searchParams.educationLevel.length > 0) {
      //   if (!searchParams.educationLevel.includes(candidate.education)) return false;
      // }

      // Filter by verification status
      if (searchParams.verificationStatus.email) {
        const hasMatchingEmail = candidate.verificationStatus.some(status => status.email);
        if (!hasMatchingEmail) return false;
      }
      if (searchParams.verificationStatus.linkedin) {
        const hasMatchingLinkedin = candidate.verificationStatus.some(status => status.linkedin);
        if (!hasMatchingLinkedin) return false;
      }
      if (searchParams.verificationStatus.employment) {
        const hasMatchingEmployment = candidate.verificationStatus.some(status => status.employment);
        if (!hasMatchingEmployment) return false;
      }

      // // Filter by employment gaps
      // if (searchParams.employmentGaps == candidate.employmentGaps) return false;

      // Filter by graduation year
      if (candidate.graduationYear < searchParams.graduationYearRange[0] ||
          candidate.graduationYear > searchParams.graduationYearRange[1]) {
        return false;
      }

      // Filter by university
      if (searchParams.university) {
        if (!candidate.university.toLowerCase().includes(searchParams.university.toLowerCase())) return false;
      }

      // Filter by university tier
      if (searchParams.universityTier.length > 0) {
        if (!searchParams.universityTier.includes(candidate.universityTier)) return false;
      }

      return true;
    });

      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        hasSearched: true,
        results: filteredCandidates,
        totalResults: filteredCandidates.length,
        favorableCandidates: filteredCandidates.slice(0, 5),
      }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        hasSearched: true,
        results: [],
        totalResults: 0,
        favorableCandidates: [],
      }));
    }
  };

  const resetSearch = () => {
    setSearchParams(defaultSearchParams);
    setSearchState((prev) => ({
      ...prev,
      isSearching: false,
      hasSearched: false,
      results: [],
      totalResults: 0,
      currentPage: 1,
      favorableCandidates: [],
    }));
    // Clear localStorage on reset
    try {
      localStorage.removeItem('searchResults');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const saveCandidate = (candidate: Candidate) => {
    setSearchState((prev) => {
      if (prev.savedCandidates.some((c) => c.id === candidate.id)) {
        return prev;
      }
      return {
        ...prev,
        savedCandidates: [...prev.savedCandidates, candidate],
      };
    });
  };

  const unsaveCandidate = (candidateId: string) => {
    setSearchState((prev) => ({
      ...prev,
      savedCandidates: prev.savedCandidates.filter((c) => c.id !== candidateId),
    }));
  };

  return (
    <SearchContext.Provider
      value={{
        searchParams,
        searchState,
        updateSearchParams,
        executeSearch,
        resetSearch,
        saveCandidate,
        unsaveCandidate,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};