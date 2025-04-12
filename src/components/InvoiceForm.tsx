
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { addInvoice } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface InvoiceFormProps {
  onInvoiceAdded: () => void;
}

// Define the currency options
const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
];

// Ethereum address regex pattern (0x followed by 40 hex characters)
const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, "Invoice name is required"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  issuerWallet: z.string()
    .min(1, "Issuer wallet address is required")
    .regex(ethereumAddressRegex, "Invalid wallet address format"),
  recipientWallet: z.string()
    .min(1, "Recipient wallet address is required")
    .regex(ethereumAddressRegex, "Invalid wallet address format"),
});

export function InvoiceForm({ onInvoiceAdded }: InvoiceFormProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      currency: "",
      issuerWallet: "",
      recipientWallet: "",
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    // Add new invoice
    addInvoice({
      name: values.name,
      amount: parseFloat(values.amount),
      companyId: user.id,
      companyName: user.name,
      // Additional data not in the mockData model, but could be used later
      currency: values.currency,
      issuerWallet: values.issuerWallet,
      recipientWallet: values.recipientWallet
    });
    
    // Reset form and close dialog
    form.reset();
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
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Invoice</DialogTitle>
          <DialogDescription>
            Enter the invoice details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., March Services"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Stablecoin Wallets</h3>
              </div>
              
              <FormField
                control={form.control}
                name="issuerWallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter issuer's stablecoin wallet address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recipientWallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter recipient's stablecoin wallet address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Add Invoice</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
