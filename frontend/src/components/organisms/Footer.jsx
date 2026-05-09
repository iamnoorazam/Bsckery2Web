import { Separator } from "@/components/ui/separator";
import Logo from "@/components/atoms/Logo";

const Footer = () => (
  <footer className="border-t bg-secondary/30 mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BakeryCo. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
