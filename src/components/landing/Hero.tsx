import { useState } from "react";
import { ImageSlider } from "./ImageSlider";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";

export const Hero = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <section className="relative h-[600px] md:h-[650px] lg:h-[700px] overflow-hidden">
      <ImageSlider onCTAClick={() => setRegisterOpen(true)} />

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </section>
  );
};
