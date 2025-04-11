
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addInvoice } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle } from "lucide-react";

interface InvoiceFormProps {
  onInvoiceAdded: () => void;
}

export function InvoiceForm({ onInvoiceAdded }: InvoiceFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!user) return;
    
    // Add new invoice
    addInvoice({
      name,
      amount: parseFloat(amount),
      companyId: user.id,
      companyName: user.name,
      pdfUrl: file ? URL.createObjectURL(file) : undefined
    });
    
    // Reset form and close dialog
    setName("");
    setAmount("");
    setFile(null);
    setOpen(false);
    
    // Refresh invoices list
    onInvoiceAdded();
    
    toast.success("Invoice added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>New Invoice</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Invoice</DialogTitle>
          <DialogDescription>
            Enter the invoice details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Invoice Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., March Services"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="invoice-file">Invoice PDF (Optional)</Label>
            <Input
              id="invoice-file"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="submit">Add Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
