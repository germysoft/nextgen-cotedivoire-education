import { useState, useEffect, useCallback } from 'react';
import { ReunionReport } from '@/components/reunions/ReunionPDFGenerator';

const STORAGE_KEY = 'reunion_reports';

export interface StoredReport extends ReunionReport {
  createdAt: string;
  updatedAt: string;
  version: number;
  status: 'draft' | 'finalized' | 'sent';
  emailsSent?: {
    date: string;
    recipients: string[];
  }[];
}

export const useReportStorage = () => {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reports from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reports from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save reports to localStorage whenever they change
  const saveToStorage = useCallback((updatedReports: StoredReport[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
      setReports(updatedReports);
    } catch (error) {
      console.error('Error saving reports to storage:', error);
      throw error;
    }
  }, []);

  // Create a new report
  const createReport = useCallback((report: ReunionReport): StoredReport => {
    const now = new Date().toISOString();
    const newReport: StoredReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
      status: 'draft',
      emailsSent: [],
    };
    
    const updatedReports = [newReport, ...reports];
    saveToStorage(updatedReports);
    return newReport;
  }, [reports, saveToStorage]);

  // Update an existing report
  const updateReport = useCallback((id: string, updates: Partial<ReunionReport>): StoredReport | null => {
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return null;

    const existingReport = reports[reportIndex];
    const updatedReport: StoredReport = {
      ...existingReport,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existingReport.version + 1,
    };

    const updatedReports = [...reports];
    updatedReports[reportIndex] = updatedReport;
    saveToStorage(updatedReports);
    return updatedReport;
  }, [reports, saveToStorage]);

  // Delete a report
  const deleteReport = useCallback((id: string): boolean => {
    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) return false;

    const updatedReports = reports.filter(r => r.id !== id);
    saveToStorage(updatedReports);
    return true;
  }, [reports, saveToStorage]);

  // Get a single report
  const getReport = useCallback((id: string): StoredReport | undefined => {
    return reports.find(r => r.id === id);
  }, [reports]);

  // Mark report as finalized
  const finalizeReport = useCallback((id: string): StoredReport | null => {
    return updateReport(id, { status: 'finalized' } as any);
  }, [updateReport]);

  // Record email sent
  const recordEmailSent = useCallback((id: string, recipients: string[]): StoredReport | null => {
    const report = reports.find(r => r.id === id);
    if (!report) return null;

    const emailRecord = {
      date: new Date().toISOString(),
      recipients,
    };

    const updatedEmailsSent = [...(report.emailsSent || []), emailRecord];
    
    const reportIndex = reports.findIndex(r => r.id === id);
    const updatedReport: StoredReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      status: 'sent',
      emailsSent: updatedEmailsSent,
    };

    const updatedReports = [...reports];
    updatedReports[reportIndex] = updatedReport;
    saveToStorage(updatedReports);
    return updatedReport;
  }, [reports, saveToStorage]);

  // Export all reports as JSON
  const exportReports = useCallback((): string => {
    return JSON.stringify(reports, null, 2);
  }, [reports]);

  // Import reports from JSON
  const importReports = useCallback((jsonData: string): number => {
    try {
      const importedReports: StoredReport[] = JSON.parse(jsonData);
      const mergedReports = [...reports];
      let importedCount = 0;

      importedReports.forEach(imported => {
        const existingIndex = mergedReports.findIndex(r => r.id === imported.id);
        if (existingIndex === -1) {
          mergedReports.push(imported);
          importedCount++;
        } else if (new Date(imported.updatedAt) > new Date(mergedReports[existingIndex].updatedAt)) {
          mergedReports[existingIndex] = imported;
          importedCount++;
        }
      });

      saveToStorage(mergedReports);
      return importedCount;
    } catch (error) {
      console.error('Error importing reports:', error);
      throw error;
    }
  }, [reports, saveToStorage]);

  // Get report history (all versions with same base title)
  const getReportsByFilter = useCallback((filter: {
    type?: ReunionReport['type'];
    status?: StoredReport['status'];
    startDate?: string;
    endDate?: string;
  }): StoredReport[] => {
    return reports.filter(report => {
      if (filter.type && report.type !== filter.type) return false;
      if (filter.status && report.status !== filter.status) return false;
      if (filter.startDate && report.date < filter.startDate) return false;
      if (filter.endDate && report.date > filter.endDate) return false;
      return true;
    });
  }, [reports]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const total = reports.length;
    const drafts = reports.filter(r => r.status === 'draft').length;
    const finalized = reports.filter(r => r.status === 'finalized').length;
    const sent = reports.filter(r => r.status === 'sent').length;
    
    const byType = {
      conseil_classe: reports.filter(r => r.type === 'conseil_classe').length,
      reunion_parents: reports.filter(r => r.type === 'reunion_parents').length,
      reunion_pedagogique: reports.filter(r => r.type === 'reunion_pedagogique').length,
      reunion_administrative: reports.filter(r => r.type === 'reunion_administrative').length,
    };

    return { total, drafts, finalized, sent, byType };
  }, [reports]);

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    getReport,
    finalizeReport,
    recordEmailSent,
    exportReports,
    importReports,
    getReportsByFilter,
    getStatistics,
  };
};
