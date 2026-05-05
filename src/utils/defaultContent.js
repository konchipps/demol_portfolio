export const heroSeed = {
  name: "Aaron Demol",
  title: "Product Designer & Frontend Engineer",
  description:
    "I build brand-forward digital experiences that feel sharp, fast, and human. From product strategy to polished interfaces, I help founders and teams ship work that looks expensive and performs like it means it.",
  location: "New York, United States",
  email: "aarondemol2004@gmail.com",
  phoneNumbers: ["09751876871", "09281453911"],
  resumeUrl: "/aaron-demol-cv.pdf",
  profileImageUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  socialLinks: [
    { label: "GitHub", icon: "github", url: "https://github.com/" },
    { label: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/" },
    { label: "Dribbble", icon: "dribbble", url: "https://dribbble.com/" }
  ],
  stats: [
    { label: "Years Experience", value: "8+" },
    { label: "Happy Clients", value: "42" },
    { label: "Awards Earned", value: "11" }
  ]
};

export const siteSettingsSeed = {
  sections: {
    hero: true,
    services: true,
    resume: true,
    projects: true,
    testimonials: true,
    clients: true,
    contact: true
  }
};

export const servicesSeed = [
  {
    id: "service-brand-systems",
    order: 1,
    icon: "Palette",
    title: "Brand Systems",
    description:
      "Identity, visual direction, and scalable design systems for teams that need a premium digital presence."
  },
  {
    id: "service-product-design",
    order: 2,
    icon: "LayoutDashboard",
    title: "Product Design",
    description:
      "End-to-end UX/UI for dashboards, SaaS platforms, and polished customer-facing web apps."
  },
  {
    id: "service-frontend-builds",
    order: 3,
    icon: "CodeXml",
    title: "Frontend Builds",
    description:
      "Responsive React experiences with motion, clean code, and a deployment path that does not fight back."
  }
];

export const projectsSeed = [
  {
    id: "project-luxe-commerce",
    order: 1,
    title: "Luxe Commerce Dashboard",
    category: "E-commerce",
    status: "Case Study",
    description:
      "A polished storefront and admin analytics concept for tracking revenue, inventory, customers, and launch campaigns in one focused workspace.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "Firebase", "Tailwind"],
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "project-booking-system",
    order: 2,
    title: "Appointment Booking Platform",
    category: "SaaS",
    status: "Prototype",
    description:
      "A responsive scheduling system with service selection, booking flows, customer messaging, and clean admin controls.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "Firestore", "Framer Motion"],
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "project-brand-portfolio",
    order: 3,
    title: "Creator Portfolio CMS",
    category: "Portfolio",
    status: "Live Build",
    description:
      "A fast personal website with editable content sections, contact capture, testimonials, client logos, and a protected admin dashboard.",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    techStack: ["Vite", "React", "Firebase"],
    liveUrl: "#",
    repoUrl: "#"
  },
  {
    id: "project-studio-landing",
    order: 4,
    title: "Studio Launch Experience",
    category: "Brand Site",
    status: "Concept",
    description:
      "A premium landing experience for a digital studio with strong art direction, conversion-focused copy, and smooth motion details.",
    imageUrl:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "Motion", "Design Systems"],
    liveUrl: "#",
    repoUrl: "#"
  }
];

export const resumeSeed = {
  experience: [
    {
      id: "exp-1",
      title: "Lead Product Designer",
      organization: "Northstar Studio",
      period: "2022 - Present",
      location: "Remote",
      description:
        "Guided UI strategy, motion systems, and design execution for fintech and developer tooling products."
    },
    {
      id: "exp-2",
      title: "Senior Frontend Engineer",
      organization: "Blackline Labs",
      period: "2019 - 2022",
      location: "Brooklyn, NY",
      description:
        "Built performant React interfaces, improved accessibility, and partnered with product teams on launches."
    },
    {
      id: "exp-3",
      title: "Digital Designer",
      organization: "Aster Creative",
      period: "2016 - 2019",
      location: "Boston, MA",
      description:
        "Designed campaign sites, landing experiences, and reusable component systems for startup clients."
    }
  ],
  education: [
    {
      id: "edu-1",
      title: "BFA, Interactive Design",
      organization: "Rhode Island School of Design",
      period: "2012 - 2016",
      location: "Providence, RI",
      description:
        "Focused on digital product design, motion, and human-centered design systems."
    },
    {
      id: "edu-2",
      title: "Advanced Frontend Certification",
      organization: "Frontend Masters",
      period: "2018",
      location: "Online",
      description:
        "Completed advanced coursework in React architecture, accessibility, performance, and animation."
    }
  ]
};

export const testimonialsSeed = [
  {
    id: "testimonial-1",
    order: 1,
    name: "Maya Chen",
    role: "Founder, Arcform",
    rating: 5,
    feedback:
      "Jordan brought a rare mix of product clarity and visual taste. The new launch felt elevated from the first prototype."
  },
  {
    id: "testimonial-2",
    order: 2,
    name: "Evan Brooks",
    role: "VP Product, Northstack",
    rating: 5,
    feedback:
      "Fast, thoughtful, and deeply reliable. We handed over a messy brief and got back a product that made immediate sense."
  },
  {
    id: "testimonial-3",
    order: 3,
    name: "Rina Patel",
    role: "Creative Director, Solstice",
    rating: 4,
    feedback:
      "The blend of design direction and frontend craftsmanship saved us weeks and gave the work a premium finish."
  }
];

export const clientsSeed = [
  {
    id: "client-1",
    order: 1,
    name: "Stripe",
    websiteUrl: "https://stripe.com",
    logoUrl: "/client-logos/stripe.svg"
  },
  {
    id: "client-2",
    order: 2,
    name: "Notion",
    websiteUrl: "https://notion.so",
    logoUrl: "/client-logos/notion.svg"
  },
  {
    id: "client-3",
    order: 3,
    name: "Figma",
    websiteUrl: "https://figma.com",
    logoUrl: "/client-logos/figma.svg"
  },
  {
    id: "client-4",
    order: 4,
    name: "Framer",
    websiteUrl: "https://framer.com",
    logoUrl: "/client-logos/framer.svg"
  }
];
