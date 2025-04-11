
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceList } from "@/components/InvoiceList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const CompanyDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'company') {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);

  const handleInvoiceAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isAuthenticated || user?.role !== 'company') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
          <InvoiceForm onInvoiceAdded={handleInvoiceAdded} />
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div>
              <h2 className="text-lg font-medium mb-4">All Invoices</h2>
              <Separator className="mb-6" />
              <InvoiceList refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div>
              <h2 className="text-lg font-medium mb-4">Pending Invoices</h2>
              <Separator className="mb-6" />
              <p className="text-sm text-muted-foreground mb-6">
                These invoices are waiting for buyer approval or payment.
              </p>
              {/* We would normally filter by status here */}
              <InvoiceList refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div>
              <h2 className="text-lg font-medium mb-4">Completed Invoices</h2>
              <Separator className="mb-6" />
              <p className="text-sm text-muted-foreground mb-6">
                These invoices have been approved and paid.
              </p>
              {/* We would normally filter by status here */}
              <InvoiceList refreshTrigger={refreshTrigger} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CompanyDashboard;
