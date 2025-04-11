
import { useState, useEffect } from "react";
import { Invoice, getInvoices } from "@/lib/mockData";
import { InvoiceCard } from "@/components/InvoiceCard";
import { useAuth } from "@/context/AuthContext";

interface InvoiceListProps {
  refreshTrigger?: number;
}

export function InvoiceList({ refreshTrigger = 0 }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const allInvoices = getInvoices();
    
    // Filter invoices based on user role
    if (user?.role === 'company') {
      setInvoices(allInvoices.filter(invoice => invoice.companyId === user.id));
    } else {
      // For buyers, show all invoices
      setInvoices(allInvoices);
    }
  }, [user, refreshTrigger]);

  const handleStatusChange = () => {
    // Refresh invoices after status change
    const allInvoices = getInvoices();
    
    if (user?.role === 'company') {
      setInvoices(allInvoices.filter(invoice => invoice.companyId === user.id));
    } else {
      setInvoices(allInvoices);
    }
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
