
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Invoice, createEscrow, releasePayment } from "@/lib/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface InvoiceCardProps {
  invoice: Invoice;
  onStatusChange: () => void;
}

export function InvoiceCard({ invoice, onStatusChange }: InvoiceCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleApproveInvoice = async () => {
    setIsLoading(true);
    try {
      await createEscrow(invoice.id);
      toast.success("Invoice approved successfully!");
      onStatusChange();
    } catch (error) {
      toast.error("Failed to approve invoice");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    setIsLoading(true);
    try {
      await releasePayment(invoice.id);
      toast.success("Payment released successfully!");
      onStatusChange();
    } catch (error) {
      toast.error("Failed to release payment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'approved':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border border-amber-200">Approved</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border border-gray-200">Pending</Badge>;
    }
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h3 className="font-semibold text-lg">{invoice.name}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-primary flex items-center gap-1">
              <DollarSign size={20} className="inline" />
              {formatCurrency(invoice.amount)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={14} className="inline" />
              {new Date(invoice.date).toLocaleDateString()}
            </p>
            {user?.role === 'buyer' && (
              <p className="text-sm text-muted-foreground mt-1">
                From: <span className="font-medium">{invoice.companyName}</span>
              </p>
            )}
          </div>
        </div>

        {invoice.pdfUrl && (
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
              <ExternalLink size={16} />
            </a>
          </Button>
        )}
      </div>
      
      <div className="mt-4">
        {invoice.status === 'pending' && (
          <div className="flex items-center text-amber-600 text-sm mb-3">
            <Clock size={14} className="mr-1" />
            Waiting for approval
          </div>
        )}
        
        {invoice.status === 'approved' && (
          <div className="flex items-center text-amber-600 text-sm mb-3">
            <CheckCircle size={14} className="mr-1" />
            Approved, waiting for confirmation
          </div>
        )}
        
        {invoice.status === 'completed' && (
          <div className="flex items-center text-emerald-600 text-sm mb-3">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </div>
        )}
      </div>
      
      {user?.role === 'buyer' && invoice.status === 'pending' && (
        <div className="mt-2">
          <Button 
            onClick={handleApproveInvoice} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Approve Invoice"}
          </Button>
        </div>
      )}
      
      {user?.role === 'buyer' && invoice.status === 'approved' && (
        <div className="mt-2">
          <Button 
            onClick={handleConfirmReceipt} 
            disabled={isLoading}
            variant="default"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Processing..." : "Confirm Receipt"}
          </Button>
        </div>
      )}
    </Card>
  );
}
