import { Bell } from "lucide-react";

export const Marquee = () => {
  const announcements = [
    "🎓 New placement drive starting from Jan 2025 - Register now!",
    "💼 500+ companies registered on the platform",
    "🏆 95% placement rate across participating colleges",
    "📢 Upcoming webinar: Career Guidance for Engineering Students - 15th Jan",
    "🌟 10,000+ students successfully placed through our portal",
  ];

  return (
    <div className="bg-accent/90 text-white py-3 overflow-hidden relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 bg-accent/50 py-1 rounded-r-full">
          <Bell className="h-4 w-4 animate-pulse" />
          <span className="font-semibold text-sm whitespace-nowrap">Latest Updates</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee inline-block whitespace-nowrap">
            {announcements.map((announcement, index) => (
              <span key={index} className="mx-8 text-sm font-medium">
                {announcement}
              </span>
            ))}
            {announcements.map((announcement, index) => (
              <span key={`duplicate-${index}`} className="mx-8 text-sm font-medium">
                {announcement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};