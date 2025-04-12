
export interface Invoice {
  id: string;
  name: string;
  amount: number;
  date: string;
  companyId: string;
  companyName: string;
  status: 'pending' | 'approved' | 'completed';
  pdfUrl?: string;
  currency?: string;
  issuerWallet?: string;
  recipientWallet?: string;
}

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    name: "Office Supplies",
    amount: 1250.75,
    date: "2025-03-15",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "pending",
    pdfUrl: "/invoice-sample.pdf"
  },
  {
    id: "inv-002",
    name: "Marketing Services",
    amount: 5600.00,
    date: "2025-03-10",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "approved",
    pdfUrl: "/invoice-sample.pdf"
  },
  {
    id: "inv-003",
    name: "IT Equipment",
    amount: 8750.50,
    date: "2025-03-05",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "completed",
    pdfUrl: "/invoice-sample.pdf"
  },
  {
    id: "inv-004",
    name: "Consulting Services",
    amount: 12000.00,
    date: "2025-03-01",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "pending",
    pdfUrl: "/invoice-sample.pdf"
  }
];

let invoicesData = [...mockInvoices];

export const getInvoices = () => {
  return [...invoicesData];
};

export const addInvoice = (invoice: Omit<Invoice, 'id' | 'date' | 'status'>) => {
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${String(invoicesData.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };
  
  invoicesData = [newInvoice, ...invoicesData];
  return newInvoice;
};

export const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
  invoicesData = invoicesData.map(invoice => 
    invoice.id === id ? { ...invoice, status } : invoice
  );
  
  return invoicesData.find(invoice => invoice.id === id);
};

// Mock payment functions
export const createEscrow = async (invoiceId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return updateInvoiceStatus(invoiceId, 'approved');
};

export const releasePayment = async (invoiceId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return updateInvoiceStatus(invoiceId, 'completed');
};
