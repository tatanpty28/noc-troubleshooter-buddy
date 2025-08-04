import { useState, useEffect } from 'react';
import { nocDataService } from '@/services/dataService';
import { KnowledgeBase, CaseHistory, TroubleshootingProblem, Guide } from '@/data/troubleshootingData';
import { Estacion } from './useEstaciones';

// Custom hook for NOC data management
export function useNOCData() {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [cases, setCases] = useState<CaseHistory[]>([]);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'user'>('user');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on first load
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Initialize default data if needed
        nocDataService.initializeDefaultData();
        
        // Load data
        setKbs(nocDataService.getKnowledgeBases());
        setCases(nocDataService.getCaseHistory());
        setEstaciones(nocDataService.getEstaciones());
        setGuides(nocDataService.getGuides());
        setUserRole(nocDataService.getUserRole());
      } catch (error) {
        console.error('Error initializing NOC data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Knowledge Base methods
  const saveKB = (kb: KnowledgeBase) => {
    try {
      nocDataService.saveKnowledgeBase(kb);
      setKbs(nocDataService.getKnowledgeBases());
      return true;
    } catch (error) {
      console.error('Error saving KB:', error);
      return false;
    }
  };

  const deleteKB = (id: string) => {
    try {
      nocDataService.deleteKnowledgeBase(id);
      setKbs(nocDataService.getKnowledgeBases());
      return true;
    } catch (error) {
      console.error('Error deleting KB:', error);
      return false;
    }
  };

  // Case History methods
  const saveCase = (case_: CaseHistory) => {
    try {
      nocDataService.saveCaseHistory(case_);
      setCases(nocDataService.getCaseHistory());
      return true;
    } catch (error) {
      console.error('Error saving case:', error);
      return false;
    }
  };

  const deleteCase = (id: string) => {
    try {
      nocDataService.deleteCaseHistory(id);
      setCases(nocDataService.getCaseHistory());
      return true;
    } catch (error) {
      console.error('Error deleting case:', error);
      return false;
    }
  };

  // Search functionality
  const searchProblems = (query: string): TroubleshootingProblem[] => {
    try {
      return nocDataService.searchProblems(query);
    } catch (error) {
      console.error('Error searching problems:', error);
      return [];
    }
  };

  // Estaciones methods
  const saveEstacion = (estacion: Estacion) => {
    try {
      nocDataService.saveEstacion(estacion);
      setEstaciones(nocDataService.getEstaciones());
      return true;
    } catch (error) {
      console.error('Error saving estacion:', error);
      return false;
    }
  };

  const deleteEstacion = (id: string) => {
    try {
      nocDataService.deleteEstacion(id);
      setEstaciones(nocDataService.getEstaciones());
      return true;
    } catch (error) {
      console.error('Error deleting estacion:', error);
      return false;
    }
  };

  // Guides methods
  const getGuide = (id: string): Guide | null => {
    try {
      return nocDataService.getGuide(id);
    } catch (error) {
      console.error('Error getting guide:', error);
      return null;
    }
  };

  const saveGuide = (guide: Guide) => {
    try {
      nocDataService.saveGuide(guide);
      setGuides(nocDataService.getGuides());
      return true;
    } catch (error) {
      console.error('Error saving guide:', error);
      return false;
    }
  };

  const deleteGuide = (id: string) => {
    try {
      nocDataService.deleteGuide(id);
      setGuides(nocDataService.getGuides());
      return true;
    } catch (error) {
      console.error('Error deleting guide:', error);
      return false;
    }
  };

  const searchGuides = (query: string): Guide[] => {
    try {
      return nocDataService.searchGuides(query);
    } catch (error) {
      console.error('Error searching guides:', error);
      return [];
    }
  };

  // Role management
  const updateUserRole = (role: 'admin' | 'editor' | 'user') => {
    try {
      nocDataService.setUserRole(role);
      setUserRole(role);
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  // Computed values
  const isAdmin = userRole === 'admin';
  const canEdit = userRole === 'admin' || userRole === 'editor';

  return {
    // Data
    kbs,
    cases,
    estaciones,
    guides,
    userRole,
    isLoading,
    
    // Computed
    isAdmin,
    canEdit,
    
    // KB methods
    saveKB,
    deleteKB,
    
    // Case methods
    saveCase,
    deleteCase,
    
    // Estacion methods
    saveEstacion,
    deleteEstacion,
    
    // Guide methods
    getGuide,
    saveGuide,
    deleteGuide,
    searchGuides,
    
    // Search
    searchProblems,
    
    // Role management
    updateUserRole,
    
    // Refresh data
    refreshData: () => {
      setKbs(nocDataService.getKnowledgeBases());
      setCases(nocDataService.getCaseHistory());
      setEstaciones(nocDataService.getEstaciones());
      setGuides(nocDataService.getGuides());
    }
  };
}