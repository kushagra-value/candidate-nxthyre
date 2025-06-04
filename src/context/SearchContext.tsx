import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SearchParams, SearchState, Candidate } from '../types';
import { mockCandidates, mockFavorableCandidates } from '../data/mockData';

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
    education: false
  },
  employmentGaps: false,
  graduationYearRange: [2010, 2024],
  university: '',
  universityTier: [],
  hasCertifications: false,
  hasAwards: false,
  hasSocialProof: false,
  currentSalaryRange: [],
  expectedCTCRange: []
};

const defaultSearchState: SearchState = {
  isSearching: false,
  hasSearched: false,
  results: mockCandidates,
  totalResults: mockCandidates.length,
  currentPage: 1,
  savedCandidates: [],
  favorableCandidates: mockFavorableCandidates
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);

  const updateSearchParams = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const filterCandidates = (candidates: Candidate[]) => {
    return candidates.filter(candidate => {
      // Filter by verified status
      if (searchParams.verifiedOnly && !candidate.isVerified) return false;

      // Filter by top tier status
      if (searchParams.topTierOnly && !candidate.isTopTier) return false;

      // Filter by notice period
      if (searchParams.noticePeriod) {
        const days = parseInt(searchParams.noticePeriod);
        if (candidate.noticePeriod > days) return false;
      }

      // Filter by skills
      if (searchParams.skills.length > 0) {
        const hasAllSkills = searchParams.skills.every(skill =>
          candidate.skills.includes(skill)
        );
        if (!hasAllSkills) return false;
      }

      // Filter by location
      if (searchParams.location) {
        const locations = searchParams.location.split(',').filter(Boolean);
        if (locations.length > 0 && !locations.includes(candidate.location.split(',')[0].trim())) {
          return false;
        }
      }

      // Filter by experience
      if (candidate.experience < searchParams.experienceRange[0] ||
          candidate.experience > searchParams.experienceRange[1]) {
        return false;
      }

      return true;
    });
  };

  const executeSearch = () => {
    setSearchState(prev => ({ ...prev, isSearching: true }));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const filteredResults = filterCandidates(mockCandidates);
      const filteredFavorable = filterCandidates(mockFavorableCandidates);
      
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        hasSearched: true,
        results: filteredResults,
        totalResults: filteredResults.length,
        favorableCandidates: filteredFavorable
      }));
    }, 500); // Reduced timeout for better UX
  };

  // Automatically trigger search when searchParams change
  useEffect(() => {
    executeSearch();
  }, [searchParams]);

  const resetSearch = () => {
    setSearchParams(defaultSearchParams);
    setSearchState({
      ...defaultSearchState,
      results: mockCandidates,
      totalResults: mockCandidates.length,
      favorableCandidates: mockFavorableCandidates
    });
  };

  const saveCandidate = (candidate: Candidate) => {
    setSearchState(prev => {
      if (prev.savedCandidates.some(c => c.id === candidate.id)) {
        return prev;
      }
      return {
        ...prev,
        savedCandidates: [...prev.savedCandidates, candidate]
      };
    });
  };

  const unsaveCandidate = (candidateId: string) => {
    setSearchState(prev => ({
      ...prev,
      savedCandidates: prev.savedCandidates.filter(c => c.id !== candidateId)
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
        unsaveCandidate
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