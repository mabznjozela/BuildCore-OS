import * as XLSX from 'xlsx';
import { Job, FinancialRecord } from '../types';

/**
 * Generates and triggers a physical styled Excel workbook containing
 * KL_Master, KL_Expenses, and KL_PaymentsLog sheets from application state.
 */
export function exportToMasterExcel(jobs: Job[], financials: FinancialRecord[]) {
  // 1. Map Main Client Database (KL_Master)
  const masterData = jobs.map((job) => {
    const outstanding = (job.quoteValue || 0) - (job.depositReceived || 0);
    return {
      'Project ID': job.id,
      'Client Name': job.clientName || 'N/A',
      'Telephone': job.phone || 'N/A',
      'Email': job.email || 'N/A',
      'Installation Address': job.address || 'N/A',
      'Area/Region': job.area || 'N/A',
      'Lead Source': job.leadSource || 'Direct Lead',
      'Job Status': job.status || 'N/A',
      'Health Status': job.health || 'On Track',
      'Quote Value (£)': job.quoteValue || 0,
      'Deposit Paid (£)': job.depositReceived || 0,
      'Outstanding Balance (£)': outstanding,
      'Board Type': job.specs?.boardType || 'None',
      'Board Supplier': job.specs?.boardSupplier || 'N/A',
      'Door Type': job.specs?.doorType || 'None',
      'Door Supplier': job.specs?.doorSupplier || 'N/A',
      'Soft Close Hinges': job.specs?.softClose ? 'Yes' : 'No',
      'LED Lighting': job.specs?.ledLighting ? 'Yes' : 'No',
      'Push To Open': job.specs?.pushToOpen ? 'Yes' : 'No',
      'Glass Doors': job.specs?.glassDoors ? 'Yes' : 'No',
      'Stone Supplier': job.specs?.stoneSupplier || 'N/A',
      'Stone Color': job.specs?.stoneColour || 'N/A',
      'Stone Thickness': job.specs?.stoneThickness || 'N/A',
      'Oven Specs': job.specs?.oven || 'N/A',
      'Hob Specs': job.specs?.hob || 'N/A',
      'Extractor': job.specs?.extractor || 'N/A',
      'Fridge': job.specs?.fridge || 'N/A',
      'Project Backstory / General Comments': job.comments || '',
      'Installer Site Notes': job.siteNotes || '',
    };
  });

  // 2. Map Financial Expenses (KL_Expenses)
  const expensesData = financials
    .filter((record) => record.type === 'expense')
    .map((record) => {
      const parentJob = jobs.find((j) => j.id === record.jobId);
      return {
        'Transaction ID': record.id,
        'Project ID': record.jobId,
        'Client Name': parentJob ? parentJob.clientName : 'Custom/Unassigned',
        'Transaction Date': record.date ? record.date.split('T')[0] : '',
        'Expense Category': record.category || 'Materials',
        'Description': record.description || '',
        'Disbursed Amount (£)': record.amount || 0,
      };
    });

  // 3. Map Financial Payments Received (KL_PaymentsLog)
  const paymentsData = financials
    .filter((record) => record.type === 'payment')
    .map((record) => {
      const parentJob = jobs.find((j) => j.id === record.jobId);
      return {
        'Receipt ID': record.id,
        'Project ID': record.jobId,
        'Client Name': parentJob ? parentJob.clientName : 'Custom/Unassigned',
        'Payment Date': record.date ? record.date.split('T')[0] : '',
        'Payment Stage Category': record.category || 'Deposit Paid',
        'Description / Notes': record.description || '',
        'Amount Received (£)': record.amount || 0,
      };
    });

  // Create an Excel Workbook
  const workbook = XLSX.utils.book_new();

  // Create worksheets from mapped objects
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData);
  const wsPayments = XLSX.utils.json_to_sheet(paymentsData);

  // Set default column widths for pristine viewing in Excel
  const autoWidth = (data: any[]) => {
    if (!data.length) return [];
    const keys = Object.keys(data[0]);
    return keys.map((key) => {
      let maxLen = key.toString().length;
      data.forEach((row) => {
        const val = row[key];
        if (val !== null && val !== undefined) {
          const len = val.toString().length;
          if (len > maxLen) maxLen = len;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 11), 35) }; // min width 11, max width 35
    });
  };

  wsMaster['!cols'] = autoWidth(masterData);
  if (expensesData.length > 0) {
    wsExpenses['!cols'] = autoWidth(expensesData);
  }
  if (paymentsData.length > 0) {
    wsPayments['!cols'] = autoWidth(paymentsData);
  }

  // Append sheets with requested professional tab names
  XLSX.utils.book_append_sheet(workbook, wsMaster, 'KL_Master');
  XLSX.utils.book_append_sheet(workbook, wsExpenses, 'KL_Expenses');
  XLSX.utils.book_append_sheet(workbook, wsPayments, 'KL_PaymentsLog');

  // Generate date stamp for file naming sequence
  const today = new Date().toISOString().split('T')[0];
  
  // Save Book to Local File Output
  XLSX.writeFile(workbook, `KitchenLab_Master_File_${today}.xlsx`);
}
