import { useEffect } from "react";

export default function ActivityTracker() {

  useEffect(() => {
    const startTime = Date.now();

    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const url = window.location.href;

    let clicks = 0;
    let scrolls = 0;

    const handleClick = () => clicks++;
    const handleScroll = () => scrolls++;

    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    window.addEventListener("beforeunload", () => {
      const duration = (Date.now() - startTime) / 1000;

      const finalReport = {
        userAgent,
        language,
        timezone,
        screen: `${screenWidth}x${screenHeight}`,
        url,
        clicks,
        scrolls,
        durationSeconds: duration,
      };

      navigator.sendBeacon("http://35.173.186.121/api/rapport/activity-tracker", JSON.stringify(finalReport));
    });

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
