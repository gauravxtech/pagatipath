import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterDialog = ({ open, onOpenChange }: RegisterDialogProps) => {
  const [role, setRole] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const roles = [
    { value: "college", label: "Register as College" },
    { value: "recruiter", label: "Register as Recruiter" },
    { value: "student", label: "Register as Student" },
  ];

  const handleContinue = () => {
    if (!role) {
      toast({
        title: "Select Role",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }

    onOpenChange(false);
    navigate("/register", { state: { role } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join PragatiPath</DialogTitle>
          <DialogDescription>
            Select your role to get started with registration
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="role">I want to register as</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Quick Registration Benefits:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Instant access to opportunities</li>
              <li>✓ Real-time placement tracking</li>
              <li>✓ Direct connection with stakeholders</li>
            </ul>
          </div>

          <Button onClick={handleContinue} className="w-full">
            Continue to Registration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
