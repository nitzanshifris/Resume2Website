// Mock CV Data for Testing Smart Card Features
export const mockCVData = {
  hero: {
    fullName: "Alex Johnson",
    professionalTitle: "Senior Full Stack Developer & Technical Lead",
    profilePhotoUrl: "/placeholder-user.jpg"
  },
  
  contact: {
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    availability: "Available for freelance projects",
    professionalLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { platform: "GitHub", url: "https://github.com/alexjohnson" },
      { platform: "Twitter", url: "https://twitter.com/alexjohnsondev" },
      { platform: "Portfolio", url: "https://alexjohnson.dev" }
    ]
  },
  
  summary: {
    summaryText: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architectures. Led multiple successful product launches from conception to deployment, managing cross-functional teams of 5-10 developers. Strong advocate for clean code, test-driven development, and continuous integration.",
    yearsOfExperience: 8,
    keySpecializations: ["React & Next.js", "Node.js & Express", "AWS & Cloud Architecture", "Team Leadership", "Agile Methodologies"]
  },
  
  experience: {
    sectionTitle: "Professional Experience",
    experienceItems: [
      {
        jobTitle: "Senior Full Stack Developer",
        company: "TechCorp Solutions",
        dateRange: { startDate: "Jan 2021", endDate: "Present", isCurrent: true },
        description: "Lead developer for enterprise SaaS platform serving 100K+ users. Architected microservices infrastructure reducing deployment time by 60%. Mentored junior developers and established coding standards.",
        responsibilities: [
          "Architected and implemented microservices using Node.js and Docker",
          "Led migration from monolith to microservices architecture",
          "Reduced API response time by 40% through optimization",
          "Mentored team of 5 junior developers"
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        hasLink: true,
        linkType: "video",
        viewMode: "timeline",
        textVariant: "detailed"
      },
      {
        jobTitle: "Full Stack Developer",
        company: "StartupXYZ",
        dateRange: { startDate: "Jun 2018", endDate: "Dec 2020" },
        description: "Core developer for fintech startup. Built real-time trading dashboard processing 1M+ transactions daily. Implemented automated testing reducing bugs by 75%.",
        responsibilities: [
          "Developed real-time dashboard using React and WebSockets",
          "Implemented CI/CD pipeline with Jenkins and Docker",
          "Built RESTful APIs handling 10K requests/second"
        ],
        technologies: ["Vue.js", "Python", "MongoDB", "Kubernetes", "GCP"],
        githubUrl: "https://github.com/alexjohnson/trading-platform",
        hasLink: true,
        linkType: "github",
        viewMode: "timeline",
        textVariant: "detailed"
      }
    ]
  },
  
  education: {
    sectionTitle: "Education",
    educationItems: [
      {
        degree: "Master of Science",
        fieldOfStudy: "Computer Science",
        institution: "Stanford University",
        dateRange: { startDate: "2016", endDate: "2018" },
        gpa: 3.9,
        honors: ["Dean's List", "Graduate Research Assistant"],
        relevantCoursework: ["Machine Learning", "Distributed Systems", "Advanced Algorithms"],
        description: "Focused on distributed systems and machine learning. Published research on real-time data processing.",
        imageUrl: "/placeholder-logo.png",
        hasLink: true,
        linkType: "image",
        viewMode: "timeline",
        textVariant: "detailed"
      },
      {
        degree: "Bachelor of Science",
        fieldOfStudy: "Software Engineering",
        institution: "UC Berkeley",
        dateRange: { startDate: "2012", endDate: "2016" },
        gpa: 3.8,
        honors: ["Summa Cum Laude", "Computer Science Honor Society"],
        linkUrl: "https://berkeley.edu/academics/cs",
        hasLink: true,
        linkType: "website",
        viewMode: "timeline",
        textVariant: "detailed"
      }
    ]
  },
  
  skills: {
    sectionTitle: "Technical Skills",
    skillCategories: [
      {
        categoryName: "Frontend",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "GraphQL"]
      },
      {
        categoryName: "Backend",
        skills: ["Node.js", "Python", "Express", "Django", "PostgreSQL", "MongoDB"]
      },
      {
        categoryName: "DevOps & Cloud",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"]
      },
      {
        categoryName: "Tools & Methods",
        skills: ["Git", "Agile/Scrum", "TDD", "Microservices", "REST APIs", "WebSockets"]
      }
    ],
    ungroupedSkills: ["Problem Solving", "Team Leadership", "Code Review", "Technical Writing"]
  },
  
  projects: {
    sectionTitle: "Featured Projects",
    projectItems: [
      {
        projectTitle: "AI-Powered Code Review Tool",
        role: "Lead Developer",
        dateRange: { startDate: "2023", endDate: "2024" },
        description: "Built an AI-powered tool that automatically reviews code and suggests improvements. Used GPT-4 API for intelligent code analysis. Achieved 85% accuracy in detecting potential bugs.",
        technologies: ["Python", "OpenAI API", "React", "FastAPI", "PostgreSQL"],
        outcomes: "50K+ downloads, featured on Product Hunt",
        githubUrl: "https://github.com/alexjohnson/ai-code-reviewer",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        hasLink: true,
        linkType: "github",
        viewMode: "github",
        textVariant: "detailed"
      },
      {
        projectTitle: "Real-Time Collaboration Platform",
        role: "Full Stack Developer",
        dateRange: { startDate: "2022", endDate: "2023" },
        description: "Developed a Figma-like collaboration tool for developers. Implemented real-time sync using WebRTC and CRDTs. Supports concurrent editing by 100+ users.",
        technologies: ["React", "WebRTC", "Node.js", "Redis", "Socket.io"],
        outcomes: "10K+ active users, $500K ARR",
        projectUrl: "https://collab-platform.io",
        imageUrl: "/modern-web-app-interface.png",
        hasLink: true,
        linkType: "website",
        viewMode: "images",
        textVariant: "detailed"
      },
      {
        projectTitle: "Open Source CLI Tool",
        role: "Creator & Maintainer",
        dateRange: { startDate: "2021", endDate: "Present" },
        description: "Created a popular CLI tool for automating Docker deployments. 2K+ GitHub stars, active community of contributors.",
        technologies: ["Go", "Docker", "GitHub Actions"],
        githubUrl: "https://github.com/alexjohnson/deploy-cli",
        hasLink: true,
        linkType: "github",
        viewMode: "github",
        textVariant: "detailed"
      }
    ]
  },
  
  achievements: {
    sectionTitle: "Key Achievements",
    achievements: [
      {
        value: "40%",
        label: "API Performance Improvement",
        contextOrDetail: "Optimized database queries and caching strategy",
        timeframe: "2023",
        linkUrl: "https://techblog.example.com/performance-optimization",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        value: "$2.5M",
        label: "Cost Savings",
        contextOrDetail: "Through AWS infrastructure optimization",
        timeframe: "2022-2023",
        imageUrl: "/financial-graph-savings.png",
        hasLink: true,
        linkType: "image",
        viewMode: "images",
        textVariant: "detailed"
      },
      {
        value: "100K+",
        label: "Active Users",
        contextOrDetail: "On platform I architected from scratch",
        timeframe: "2021-Present",
        videoUrl: "https://vimeo.com/123456789",
        hasLink: true,
        linkType: "video",
        viewMode: "video",
        textVariant: "detailed"
      },
      {
        value: "15",
        label: "Team Members Mentored",
        contextOrDetail: "Helped junior developers advance their careers",
        timeframe: "2020-Present",
        hasLink: false,
        viewMode: "text",
        textVariant: "detailed"
      }
    ]
  },
  
  certifications: {
    sectionTitle: "Certifications",
    certificationItems: [
      {
        title: "AWS Solutions Architect Professional",
        organization: "Amazon Web Services",
        dateObtained: "March 2023",
        expirationDate: "March 2026",
        credentialId: "AWS-PSA-123456",
        verificationUrl: "https://aws.amazon.com/verification/123456",
        imageUrl: "/placeholder-logo.png",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        title: "Google Cloud Professional Developer",
        organization: "Google Cloud",
        dateObtained: "January 2022",
        credentialId: "GCP-PD-789012",
        verificationUrl: "https://cloud.google.com/cert/789012",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        title: "Certified Kubernetes Administrator",
        organization: "CNCF",
        dateObtained: "June 2021",
        credentialId: "CKA-2021-456",
        linkUrl: "https://cncf.io/certification/cka",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      }
    ]
  },
  
  languages: {
    sectionTitle: "Languages",
    languageItems: [
      {
        language: "English",
        proficiency: "Native",
        certification: null
      },
      {
        language: "Spanish",
        proficiency: "Professional Working",
        certification: "DELE B2"
      },
      {
        language: "Mandarin",
        proficiency: "Basic",
        certification: "HSK 2"
      }
    ]
  },
  
  volunteer: {
    sectionTitle: "Volunteer Experience",
    volunteerItems: [
      {
        role: "Technical Mentor",
        organization: "Code for Good",
        dateRange: { startDate: "2020", endDate: "Present" },
        description: "Teaching underprivileged youth web development skills. Developed curriculum for 12-week bootcamp program. Helped 50+ students land their first tech jobs.",
        impact: "50+ students placed in tech roles",
        imageUrl: "/team-volunteering.png",
        hasLink: true,
        linkType: "image",
        viewMode: "images",
        textVariant: "detailed"
      },
      {
        role: "Open Source Contributor",
        organization: "Mozilla Firefox",
        dateRange: { startDate: "2019", endDate: "2021" },
        description: "Regular contributor to Firefox DevTools. Fixed 30+ bugs and implemented 5 new features.",
        githubUrl: "https://github.com/mozilla/firefox-devtools",
        hasLink: true,
        linkType: "github",
        viewMode: "github",
        textVariant: "detailed"
      }
    ]
  },
  
  publications: {
    sectionTitle: "Publications",
    publications: [
      {
        title: "Optimizing Real-Time Data Processing in Distributed Systems",
        publicationType: "Conference Paper",
        venue: "IEEE International Conference on Cloud Computing",
        datePublished: "July 2023",
        coAuthors: ["Dr. Jane Smith", "Prof. John Doe"],
        abstract: "Novel approach to optimizing data processing in distributed environments...",
        publicationUrl: "https://ieee.org/paper/123456",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        title: "Machine Learning in Production: Best Practices",
        publicationType: "Blog Post",
        venue: "Tech Blog",
        datePublished: "March 2023",
        linkUrl: "https://techblog.example.com/ml-production",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      }
    ]
  },
  
  speaking: {
    sectionTitle: "Speaking Engagements",
    speakingEngagements: [
      {
        eventName: "React Summit 2023",
        topic: "Building Scalable React Applications",
        venue: "Amsterdam, Netherlands",
        date: "June 2023",
        audienceSize: 2000,
        presentationUrl: "https://slides.com/alexj/react-summit-2023",
        videoUrl: "https://www.youtube.com/watch?v=conference123",
        hasLink: true,
        linkType: "video",
        viewMode: "video",
        textVariant: "detailed"
      },
      {
        eventName: "NodeConf EU",
        topic: "Microservices with Node.js",
        venue: "Berlin, Germany",
        date: "November 2022",
        audienceSize: 500,
        eventUrl: "https://nodeconf.eu/2022",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      }
    ]
  },
  
  courses: {
    sectionTitle: "Professional Development",
    courseItems: [
      {
        courseName: "Advanced React Patterns",
        institution: "Frontend Masters",
        completionDate: "December 2023",
        certificateUrl: "https://frontendmasters.com/cert/12345",
        description: "Deep dive into advanced React patterns and performance optimization",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        courseName: "System Design Interview Preparation",
        institution: "Educative.io",
        completionDate: "October 2023",
        certificateUrl: "https://educative.io/cert/67890",
        videoUrl: "https://www.youtube.com/watch?v=coursevideo",
        hasLink: true,
        linkType: "video",
        viewMode: "video",
        textVariant: "detailed"
      }
    ]
  },
  
  memberships: {
    sectionTitle: "Professional Memberships",
    memberships: [
      {
        organizationName: "Association for Computing Machinery (ACM)",
        membershipType: "Professional Member",
        dateRange: { startDate: "2018", endDate: "Present" },
        role: "Active Member",
        description: "Participating in local chapter events and conferences",
        linkUrl: "https://acm.org",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "detailed"
      },
      {
        organizationName: "JavaScript Developer Community",
        membershipType: "Core Contributor",
        dateRange: { startDate: "2020", endDate: "Present" },
        description: "Active in community discussions and code reviews",
        githubUrl: "https://github.com/js-community",
        hasLink: true,
        linkType: "github",
        viewMode: "github",
        textVariant: "detailed"
      }
    ]
  },
  
  hobbies: {
    sectionTitle: "Interests & Hobbies",
    hobbyItems: [
      {
        title: "Open Source Development",
        description: "Contributing to various open source projects",
        githubUrl: "https://github.com/alexjohnson",
        hasLink: true,
        linkType: "github",
        viewMode: "github",
        textVariant: "simple"
      },
      {
        title: "Photography",
        description: "Landscape and street photography",
        imageUrl: "/pixel-art-landscape.png",
        hasLink: true,
        linkType: "image",
        viewMode: "images",
        textVariant: "simple"
      },
      {
        title: "Tech Blogging",
        description: "Writing about web development and best practices",
        linkUrl: "https://alexjohnson.blog",
        hasLink: true,
        linkType: "website",
        viewMode: "uri",
        textVariant: "simple"
      },
      {
        title: "Rock Climbing",
        description: "Indoor and outdoor climbing enthusiast",
        videoUrl: "https://www.youtube.com/watch?v=climbing123",
        hasLink: true,
        linkType: "video",
        viewMode: "video",
        textVariant: "simple"
      },
      {
        title: "Chess",
        description: "Competitive online chess player (1800 ELO)",
        hasLink: false,
        viewMode: "text",
        textVariant: "simple"
      }
    ]
  },
  
  patents: {
    sectionTitle: "Patents",
    patentItems: [
      {
        title: "Real-Time Data Synchronization Method",
        patentNumber: "US10123456B2",
        status: "Granted",
        dateIssued: "January 15, 2023",
        description: "Method for synchronizing data across distributed systems with minimal latency"
      }
    ]
  },
  
  testimonials: {
    sectionTitle: "Testimonials",
    testimonialItems: [
      {
        name: "Sarah Chen",
        role: "CTO",
        company: "TechCorp Solutions",
        text: "Alex is an exceptional developer who consistently delivers high-quality code. Their leadership skills and technical expertise have been invaluable to our team.",
        date: "November 2023"
      },
      {
        name: "Michael Rodriguez",
        role: "Product Manager",
        company: "StartupXYZ",
        text: "Working with Alex was a game-changer for our product. They brought innovative solutions and a deep understanding of user needs.",
        date: "December 2020"
      }
    ]
  }
};