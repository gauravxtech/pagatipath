import { GraduationCap, Phone, Mail } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="bg-primary border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-xl shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">PragatiPath</h1>
              <p className="text-xs text-white/70 hidden sm:block">National Training & Placement Portal</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>1800-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@pragatipath.gov.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
