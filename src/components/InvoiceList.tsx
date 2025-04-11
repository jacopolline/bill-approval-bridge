
import { useState, useEffect } from "react";
import { Invoice, getInvoices } from "@/lib/mockData";
import { InvoiceCard } from "@/components/InvoiceCard";
import { useAuth } from "@/context/AuthContext";

interface InvoiceListProps {
  refreshTrigger?: number;
  status?: "pending" | "approved" | "completed" | "all";
}

export function InvoiceList({ refreshTrigger = 0, status = "all" }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const allInvoices = getInvoices();
    
    // Filter invoices based on user role
    let filteredInvoices = allInvoices;
    
    // Filter by user role
    if (user?.role === 'company') {
      filteredInvoices = allInvoices.filter(invoice => invoice.companyId === user.id);
    }
    
    // Filter by status if not "all"
    if (status !== "all") {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
    }
    
    setInvoices(filteredInvoices);
  }, [user, refreshTrigger, status]);

  const handleStatusChange = () => {
    // Refresh invoices after status change
    const allInvoices = getInvoices();
    
    let filteredInvoices = allInvoices;
    
    if (user?.role === 'company') {
      filteredInvoices = allInvoices.filter(invoice => invoice.companyId === user.id);
    }
    
    if (status !== "all") {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
    }
    
    setInvoices(filteredInvoices);
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No invoices found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
