import { useState, useEffect } from 'react';
import { nocDataService } from '@/services/dataService';
import { KnowledgeBase, CaseHistory, TroubleshootingProblem } from '@/data/troubleshootingData';
import { Estacion } from './useEstaciones';

// Custom hook for NOC data management
export function useNOCData() {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [cases, setCases] = useState<CaseHistory[]>([]);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
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
    
    // Search
    searchProblems,
    
    // Role management
    updateUserRole,
    
    // Refresh data
    refreshData: () => {
      setKbs(nocDataService.getKnowledgeBases());
      setCases(nocDataService.getCaseHistory());
      setEstaciones(nocDataService.getEstaciones());
    }
  };
}