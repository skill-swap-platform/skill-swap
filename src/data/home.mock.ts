import type { DashboardData } from "@/types/home.types";

export const HomeDashboardMockData: DashboardData = {
  userName: "Ahmed",
  heroSubtitle: "Ready to exchange skills? Start your learning journey today",

  quickActions: [
    {
      id: "qa-1",
      title: "Find a Teacher",
      description: "Browse thousands of skilled people ready to share knowledge",
      ctaLabel: "Explore now",
      icon: "search",
      accent: "blue",
    },
    {
      id: "qa-2",
      title: "Offer Your Skills",
      description: "Share what you know and help other grow while learning",
      ctaLabel: "Create Offer",
      icon: "sparkles",
      accent: "orange",
    },
    {
      id: "qa-3",
      title: "Complete your profile",
      description: "Add details to get better matches",
      ctaLabel: "Edit profile",
      icon: "user-check",
      accent: "green",
    },
  ],

  stats: [
    {
      id: "st-1",
      title: "Skills",
      subtitle: "Successfully Learned",
      icon: "award",
      value: "15",
      color: "blue",
    },
    {
      id: "st-2",
      title: "Swaps",
      subtitle: "Curently Active",
      icon: "swap",
      value: "23",
      color: "orange",
    },
    {
      id: "st-3",
      title: "Rating",
      subtitle: "From your peers",
      icon: "star",
      value: "4.3",
      color: "green",
    },
  ],

  swapBanner: {
    id: "banner-1",
    title: "Your swap was accepted!",
    subtitle: "Frontend Development with Emma Rodriguez",
    ctaLabel: "Start Chat",
  },

  trending: [
    {
      id: "tr-1",
      title: "Web Development",
      learningCount: 1236,
      growthLabel: "+341",
      icon: "globe",
    },
    {
      id: "tr-2",
      title: "Data Science",
      learningCount: 1216,
      growthLabel: "+341",
      icon: "bar-chart",
    },
    {
      id: "tr-3",
      title: "Music Production",
      learningCount: 890,
      growthLabel: "+341",
      icon: "music",
    },
    {
      id: "tr-4",
      title: "UX/UI Design",
      learningCount: 1216,
      growthLabel: "+341",
      icon: "pen-tool",
    },
  ],

  interests: [
    { id: "in-1", label: "Mobile Development", icon: "smartphone" },
    { id: "in-2", label: "Cloud Computing", icon: "cloud" },
    { id: "in-3", label: "Cybersecurity", icon: "shield", selected: true },
    { id: "in-4", label: "Data Analytics", icon: "line-chart" },
    { id: "in-5", label: "AI & Machine Learning", icon: "bot" },
  ],

  recommendations: [
    {
      id: "rec-1",
      mentorName: "Sarah Johnson",
      mentorRole: "Marketing Strategist",
      mentorAvatar: "https://i.pravatar.cc/80?img=47",
      rating: 4.8,
      reviewCount: 12,
      swapCount: 32,
      title: "Mastering Data Visualization",
      description:
        "Seeking a mentor to guide me through the intricacies of data visualization techniques.",
      tags: ["React.js", "Node.js", "SQL"],
    },
    {
      id: "rec-2",
      mentorName: "Sarah Johnson",
      mentorRole: "Marketing Strategist",
      mentorAvatar: "https://i.pravatar.cc/80?img=47",
      rating: 4.3,
      reviewCount: 10,
      swapCount: 30,
      title: "Advanced Data Mining Techniques",
      description:
        "Seeking guidance from experienced data miners to refine my analytical abilities.",
      tags: ["Figma", "Blender", "AWS"],
    },
    {
      id: "rec-3",
      mentorName: "Sarah Johnson",
      mentorRole: "Marketing Strategist",
      mentorAvatar: "https://i.pravatar.cc/80?img=47",
      rating: 4.9,
      reviewCount: 20,
      swapCount: 20,
      title: "Intro to Machine Learning",
      description:
        "Seeking a mentor to introduce me to the world of machine learning algorithms.",
      tags: ["Vue.js", "GraphQL", "Python"],
    },
  ],

  upcomingSessions: [
    {
      id: "ses-1",
      category: "Data Science",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      title: "Advanced React Patterns",
      mentorName: "Emma Rodriguez",
      level: "Beginner",
      dateLabel: "Feb , 10, 2025",
      timeLabel: "5:00 AM - 6:00 AM",
    },
    {
      id: "ses-2",
      category: "Data Science",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
      title: "Advanced React Patterns",
      mentorName: "Emma Rodriguez",
      level: "Advanced",
      dateLabel: "Feb , 10, 2025",
      timeLabel: "5:00 AM - 6:00 AM",
    },
  ],

  testimonials: [
    {
      id: "te-1",
      name: "Jamie Alvarez",
      subtitle: "Taught UX Design",
      rating: 5,
      quote:
        "I was able to refine my skills in a supportive environment. Skill Swap is a game changer!",
    },
    {
      id: "te-2",
      name: "Willow Chen",
      subtitle: "Learned UX Design",
      rating: 5,
      quote:
        "Skill Swap is the best platform to connect with others and learn new skills. I highly recommend it!",
    },
    {
      id: "te-3",
      name: "Alex Thompson",
      subtitle: "Learned UX Design",
      rating: 5,
      quote:
        "I've learned so much with Skill Swap! The instructors are very knowledgeable and helpful.",
    },
  ],
};