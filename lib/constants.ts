export type Event = {
  title: string;
  image: string; // Path from /public, e.g. "/images/event1.png"
  slug: string;
  location: string;
  date: string; // Human-friendly date, e.g. "Nov 18, 2025"
  time: string; // Human-friendly time range, e.g. "09:00–17:00 CET"
};

// Realistic upcoming/popular developer conferences, hackathons, and meetups.
// Image paths correspond to files in /public/images
export const events: Event[] = [
  {
    title: "GitHub Universe 2025",
    image: "/images/event4.png",
    slug: "github-universe-2025",
    location: "San Francisco, USA",
    date: "Nov 19, 2025",
    time: "09:00–17:00 PST",
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event3.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, USA",
    date: "Dec 1, 2025",
    time: "08:00–18:00 PST",
  },
  {
    title: "ETHGlobal Hackathon NYC 2025",
    image: "/images/event1.png",
    slug: "ethglobal-nyc-2025",
    location: "New York, USA",
    date: "Nov 22, 2025",
    time: "10:00–22:00 EST",
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    image: "/images/event5.png",
    slug: "kubecon-europe-2026",
    location: "London, UK",
    date: "Mar 18, 2026",
    time: "09:00–18:00 GMT",
  },
  {
    title: "React Summit Amsterdam 2026",
    image: "/images/event2.png",
    slug: "react-summit-amsterdam-2026",
    location: "Amsterdam, Netherlands",
    date: "Jun 12, 2026",
    time: "09:00–17:30 CEST",
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event1.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "May 22, 2026",
    time: "09:00–18:00 CEST",
  },
  {
    title: "PyCon US 2026",
    image: "/images/event6.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, USA",
    date: "Apr 24, 2026",
    time: "09:00–17:00 EDT",
  },
  {
    title: "Google I/O 2026",
    image: "/images/event3.png",
    slug: "google-io-2026",
    location: "Mountain View, USA",
    date: "May 13, 2026",
    time: "10:00–17:00 PDT",
  },
];
