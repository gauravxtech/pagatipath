import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Recruiters", href: "#recruiters" },
    { name: "Students", href: "#students" },
    { name: "Colleges", href: "#colleges" },
    { name: "Contact", href: "#contact" },
  ];

  const loginRoles = [
    { name: "Admin", value: "admin" },
    { name: "National Training Officer", value: "nto" },
    { name: "State Training Officer", value: "sto" },
    { name: "District Training Officer", value: "dto" },
    { name: "College TPO", value: "college_tpo" },
    { name: "Recruiter", value: "recruiter" },
    { name: "Student", value: "student" },
  ];

  const registerRoles = [
    { name: "Register as College", value: "college" },
    { name: "Register as Recruiter", value: "recruiter" },
    { name: "Register as Student", value: "student" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-accent rounded-xl transition-transform group-hover:scale-105 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden lg:block">National Training & Placement Portal</span>
            <span className="font-bold text-lg text-white lg:hidden">PragatiPath</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 font-semibold">
                      Login <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card z-[100]">
                    {loginRoles.map((role) => (
                      <DropdownMenuItem key={role.value} asChild>
                        <Link to="/login" className="cursor-pointer">
                          {role.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-white shadow-md hover:shadow-lg transition-shadow font-semibold">
                      Register <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card z-[100]">
                    {registerRoles.map((role) => (
                      <DropdownMenuItem key={role.value} asChild>
                        <Link to="/register" className="cursor-pointer">
                          {role.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full mb-2" asChild onClick={() => setIsOpen(false)}>
                        <Link to="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <p className="text-sm font-semibold mb-2">Login As:</p>
                        {loginRoles.map((role) => (
                          <Button
                            key={role.value}
                            variant="ghost"
                            className="w-full justify-start mb-1"
                            asChild
                            onClick={() => setIsOpen(false)}
                          >
                            <Link to="/login">{role.name}</Link>
                          </Button>
                        ))}
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold mb-2">Register:</p>
                        {registerRoles.map((role) => (
                          <Button
                            key={role.value}
                            variant="outline"
                            className="w-full mb-2"
                            asChild
                            onClick={() => setIsOpen(false)}
                          >
                            <Link to="/register">{role.name}</Link>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
