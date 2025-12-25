import { useEtablissement } from '@/contexts/EtablissementContext';

interface Subject {
  name: string;
  grade: number;
  coef: number;
}

interface GradeCalculationResult {
  average: number;
  averageWithConduite: number;
  includeConduite: boolean;
}

export function useGradeCalculation() {
  const { configuration } = useEtablissement();
  
  const includeConduite = configuration?.parametresPedagogiques?.moyenneConduitePriseEnCompte ?? false;
  
  const calculateAverage = (subjects: Subject[], conduiteNote?: number): GradeCalculationResult => {
    const totalPoints = subjects.reduce((acc, s) => acc + s.grade * s.coef, 0);
    const totalCoef = subjects.reduce((acc, s) => acc + s.coef, 0);
    
    const average = totalCoef > 0 ? totalPoints / totalCoef : 0;
    
    let averageWithConduite = average;
    
    if (includeConduite && conduiteNote !== undefined) {
      // Conduite coefficient = 1
      averageWithConduite = (totalPoints + conduiteNote) / (totalCoef + 1);
    }
    
    return {
      average,
      averageWithConduite: includeConduite ? averageWithConduite : average,
      includeConduite
    };
  };
  
  const getDisplayAverage = (subjects: Subject[], conduiteNote?: number): number => {
    const result = calculateAverage(subjects, conduiteNote);
    return result.includeConduite ? result.averageWithConduite : result.average;
  };
  
  return {
    calculateAverage,
    getDisplayAverage,
    includeConduite,
    configuration
  };
}
