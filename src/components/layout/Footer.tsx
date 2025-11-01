import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, ArrowUp } from "lucide-react";

export function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${dayName} ${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t bg-card">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - User Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
            <AvatarFallback>GK</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Germain Kouakou</span>
            <span className="text-xs text-muted-foreground">Administrateur</span>
          </div>
        </div>

        {/* Center - Copyright and Version */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>© Copyright</span>
            <a href="#" className="text-primary hover:underline font-medium">
              NextGen Éducation
            </a>
            <span>. All Rights Reserved</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>Version 1.0.0</span>
            <span>|</span>
            <a href="#" className="text-primary hover:underline">
              GermySoft-Technology
            </a>
          </div>
        </div>

        {/* Right - Clock and Scroll to Top */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDateTime(currentTime)}</span>
          </div>
          <Button 
            size="icon" 
            onClick={scrollToTop}
            className="h-9 w-9"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
