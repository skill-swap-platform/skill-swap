import api from "./api";

// Mock data for development/fallback
const mockSkillDetails = {
  provider: {
    id: "mock-user-1",
    userName: "Sarah Johnson",
    bio: "Photography & Filmmaker",
    image: "https://api.example.com/images/users/mock-user-1.jpg",
    avatar: "https://api.example.com/images/users/mock-user-1.jpg",
    rating: 4.8,
    totalFeedbacks: 10,
  },
  skill: {
    id: "mock-skill-1",
    name: "Photography Basics",
    description:
      "Learn the core concepts of aperture, shutter speed, and ISO. By the end of this session, you will be able to shoot in manual mode and understand composition rules.",
    category: {
      id: "mock-cat-1",
      name: "Arts & Crafts",
      icon: "📸",
    },
  },
  level: "INTERMEDIATE",
  sessionLanguage: "English",
  skillDescription:
    "Learn the core concepts of aperture, shutter speed, and ISO. By the end of this session, you will be able to shoot in manual mode and understand composition rules. This is a foundational session perfect for new camera owners.",
  userSkillId: "mock-user-skill-1",
  reviews: {
    count: 50,
    LatestReviewDto: { rating: 4.9 },
  },
  sessions: [
    {
      id: "session-1",
      title: "Introduction to Manual Mode",
      description: "Learn how to use manual mode on your camera",
      duration: 60,
      createdAt: "2026-02-01T10:00:00.000Z",
    },
    {
      id: "session-2",
      title: "Composition Techniques",
      description: "Master the rule of thirds and other composition rules",
      duration: 60,
      createdAt: "2026-02-03T10:00:00.000Z",
    },
  ],
  countSessions: 2,
};

const mockSimilarUser = {
  skill: {
    id: "mock-skill-2",
    name: "Digital Photography",
    description: "Advanced digital photography techniques",
    category: {
      id: "mock-cat-2",
      name: "Arts & Crafts",
      icon: "📸",
    },
  },
  user: {
    id: "mock-user-2",
    userName: "Alex Chen",
    bio: "Professional photographer with 10+ years experience",
    image: "https://api.example.com/images/users/mock-user-2.jpg",
    avatar: "https://api.example.com/images/users/mock-user-2.jpg",
    level: "EXPERT",
    receivedSwaps: 12,
    sentSwaps: 8,
    rating: 4.7,
    totalFeedbacks: 25,
  },
};

const mockReviews = {
  review: [
    {
      id: "review-1",
      comment:
        "Emma was incredibly patient and clear, highly recommended for photography skills!",
      overallRating: 5,
      reviewer: {
        id: "rev-1",
        userName: "Emma Rodriguez",
        image: "https://via.placeholder.com/48",
      },
      createdAt: "2026-02-10T15:00:00.000Z",
      isVerified: true,
    },
    {
      id: "review-2",
      comment: "Great session! Learned so much about manual mode.",
      overallRating: 4.8,
      reviewer: {
        id: "rev-2",
        userName: "John Doe",
        image: "https://via.placeholder.com/48",
      },
      createdAt: "2026-02-08T14:00:00.000Z",
      isVerified: true,
    },
  ],
};

const mockRecommendedSkill = {
  skill: {
    id: "mock-skill-3",
    name: "Video Editing",
    description: "Learn professional video editing",
    category: {
      id: "mock-cat-3",
      name: "Media & Technology",
      icon: "🎬",
    },
  },
  user: {
    id: "mock-user-3",
    userName: "Mike Studio",
    bio: "Video production expert",
    image: "https://via.placeholder.com/60",
    level: "EXPERT",
    receivedSwaps: 15,
    sentSwaps: 10,
    rating: 4.9,
    totalFeedbacks: 30,
  },
};

/**
 * Get skill details for a specific user
 * GET /api/v1/skills/{skillId}/users/{userId}/details
 */
export const getSkillDetails = async (skillId: string, userId: string) => {
  // Development mode: return mock data directly
  return mockSkillDetails;
};

/**
 * Get one similar user offering the same skill
 * GET /api/v1/skills/{skillId}/similar
 */
export const getSimilarSkillUsers = async (skillId: string) => {
  // Development mode: return mock data directly
  return mockSimilarUser;
};

/**
 * Get reviews received by a user for a specific skill
 * GET /api/v1/reviews/{userId}/received
 */
export const getReviews = async (
  userId: string,
  skillId: string,
  page: number = 1,
  limit: number = 10,
) => {
  // Development mode: return mock data directly
  return mockReviews;
};

/**
 * Get recommended user skill (OPTIONAL - returns mock data directly)
 * GET /api/v1/skills/recommended-user
 */
export const getRecommendedUserSkill = async () => {
  // Recommended skill is optional - return mock data directly
  // When backend is ready, replace this with: return api.get(...).then(res => res.data).catch(() => mockRecommendedSkill)
  return mockRecommendedSkill;
};

/**
 * Get all reviews for a user skill (detailed)
 * GET /api/v1/reviews/{userId}/received
 */
export const getAllUserSkillReviews = async (
  userId: string,
  skillId: string,
) => {
  // Development mode: return mock data directly
  return mockReviews;
};

/**
 * Get provider profile information
 * GET /api/v1/users/{userId}/profile
 */
export const getProviderProfile = async (userId: string) => {
  const mockProfile = {
    id: userId,
    name: "Hya Rubi",
    title: "Expert in web development with 8+ years experience",
    bio: "I am a passionate web developer specializing in React and Node.js. I love teaching others and sharing my knowledge. Let's grow together!",
    rating: 4.9,
    reviews: 50,
    totalSessions: 12,
    avatar: null,
    offeredSkills: [
      {
        id: "skill-1",
        name: "Python programming",
        icon: "P",
        rating: 4.6,
      },
      {
        id: "skill-2",
        name: "React.js Development",
        icon: "R",
        rating: 4.8,
      },
      {
        id: "skill-3",
        name: "Web Design",
        icon: "W",
        rating: 4.5,
      },
    ],
    badges: [
      {
        id: 1,
        name: "Top Rated",
        color: "warning",
      },
      {
        id: 2,
        name: "Expert",
        color: "primary",
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Emma Rodriguez",
        rating: 4.8,
        text: "Hya Rubi is an amazing mentor! Very knowledgeable and patient. Highly recommended!",
        helpful: 1500,
        avatar: null,
      },
      {
        id: 2,
        name: "John Smith",
        rating: 4.9,
        text: "Excellent teacher! Very responsive and explains concepts clearly.",
        helpful: 1200,
        avatar: null,
      },
      {
        id: 3,
        name: "Sarah Chen",
        rating: 4.7,
        text: "Great session! Looking forward to learning more.",
        helpful: 890,
        avatar: null,
      },
    ],
  };
  return mockProfile;
};

/**
 * Search for skills and skill providers
 * GET /api/v1/skills/search?q={query}
 */
export const searchSkills = async (query: string) => {
  // Mock search results
  const mockResults = [
    {
      id: "user-1",
      name: "Sarah Johnson",
      title: "Marketing Strategist",
      rating: 4.8,
      swaps: 12,
      skillTitle: "Mastering Data Visualization",
      description:
        "Seeking a mentor to guide me through the intricacies of data visualization techniques.",
      skills: ["React.js", "Node.js", "SQL"],
    },
    {
      id: "user-2",
      name: "Michael Chen",
      title: "Full Stack Developer",
      rating: 4.7,
      swaps: 18,
      skillTitle: "Advanced JavaScript Patterns",
      description:
        "Learn advanced patterns and best practices in JavaScript development.",
      skills: ["JavaScript", "TypeScript", "Design Patterns"],
    },
    {
      id: "user-3",
      name: "Emma Davis",
      title: "UX/UI Designer",
      rating: 4.9,
      swaps: 15,
      skillTitle: "User Experience Design Fundamentals",
      description:
        "Master the principles of UX design and create amazing user experiences.",
      skills: ["Figma", "User Research", "Wireframing"],
    },
    {
      id: "user-4",
      name: "Alex Rodriguez",
      title: "DevOps Engineer",
      rating: 4.6,
      swaps: 10,
      skillTitle: "Docker & Kubernetes Mastery",
      description:
        "Learn containerization and orchestration with Docker and Kubernetes.",
      skills: ["Docker", "Kubernetes", "CI/CD"],
    },
    {
      id: "user-5",
      name: "Lisa Wang",
      title: "Product Manager",
      rating: 4.8,
      swaps: 14,
      skillTitle: "Product Strategy & Roadmapping",
      description:
        "Discover how to build successful products from ideation to launch.",
      skills: ["Product Strategy", "Agile", "Analytics"],
    },
    {
      id: "user-6",
      name: "James Murphy",
      title: "Mobile Developer",
      rating: 4.7,
      swaps: 11,
      skillTitle: "React Native Development",
      description:
        "Build cross-platform mobile applications with React Native.",
      skills: ["React Native", "iOS", "Android"],
    },
  ];

  // Filter by query if provided
  if (!query || query.trim() === "") {
    return mockResults;
  }

  const filtered = mockResults.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.skillTitle.toLowerCase().includes(query.toLowerCase()) ||
      item.skills.some((skill) =>
        skill.toLowerCase().includes(query.toLowerCase()),
      ),
  );

  return filtered.length > 0 ? filtered : mockResults;
};
