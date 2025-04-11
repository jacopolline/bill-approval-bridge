
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FileText } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Bill Approval Bridge</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-6">
            <div className="text-sm text-muted-foreground">
              <span>Logged in as </span>
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="capitalize font-medium text-primary">{user.role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
