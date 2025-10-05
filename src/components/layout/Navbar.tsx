import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Features", href: "/features" },
    { name: "Partners", href: "/partners" },
    { name: "Contact", href: "/contact" },
  ];


  return (
    <>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />

      <nav className="bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Mobile Navigation Toggle - Left side for mobile */}
            <div className="lg:hidden">
              {/* Empty div to push toggle to right */}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded transition-all"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded transition-all"
                  >
                    {link.name}
                  </a>
                )
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
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 font-semibold"
                    onClick={() => setLoginOpen(true)}
                  >
                    Login
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Navigation Toggle - Right side */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden ml-auto">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    link.href.startsWith('/') ? (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    )
                  ))}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        <Button variant="outline" className="w-full mb-2" asChild onClick={() => setIsOpen(false)}>
                          <Link to="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            {t('navigation.dashboard')}
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('navigation.signOut')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setIsOpen(false);
                            setLoginOpen(true);
                          }}
                        >
                          {t('navigation.login')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};
