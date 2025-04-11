
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { InvoiceList } from "@/components/InvoiceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const BuyerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'buyer') {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || user?.role !== 'buyer') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div>
              <h2 className="text-lg font-medium mb-4">All Invoices</h2>
              <Separator className="mb-6" />
              <InvoiceList status="all" />
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div>
              <h2 className="text-lg font-medium mb-4">Pending Approval</h2>
              <Separator className="mb-6" />
              <p className="text-sm text-muted-foreground mb-6">
                These invoices are waiting for your approval.
              </p>
              <InvoiceList status="pending" />
            </div>
          </TabsContent>
          
          <TabsContent value="approved">
            <div>
              <h2 className="text-lg font-medium mb-4">Approved Invoices</h2>
              <Separator className="mb-6" />
              <p className="text-sm text-muted-foreground mb-6">
                These invoices have been approved and are awaiting confirmation of receipt.
              </p>
              <InvoiceList status="approved" />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BuyerDashboard;
