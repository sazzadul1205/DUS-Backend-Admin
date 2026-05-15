// resources/js/Pages/Frontend/Home.jsx

// Inertia
import { Head, usePage } from '@inertiajs/react';

// Icons
import { Menu, X } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

// Layouts
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import JobsSection from './Sections/JobsSection';
import BannerSection from './Sections/BannerSection';
import StoriesSection from './Sections/StoriesSection';
import AboutUsSection from './Sections/AboutUsSection';
import OurActionSection from './Sections/OurActionSection';
import OurProgramsSection from './Sections/OurProgramsSection';
import WhereWeWorkSection from './Sections/WhereWeWorkSection';
import ProgramImpactSection from './Sections/ProgramImpactSection';
import UpcomingEventsSection from './Sections/UpcomingEventsSection';

export default function Home() {
  // Get authentication status from Inertia page props
  const { auth } = usePage().props;

  // Banner Data (updated for better responsiveness)
  const bannerData = {
    background: {
      src: "/storage/uploads/banners/Background.jpg",
      alt: "Background"
    },
    overlay: {
      darkOverlay: "bg-black/40 lg:bg-black/50",
      gradient: "bg-gradient-to-r from-black/85 via-black/10 to-transparent"
    },
    content: {
      tagline: {
        text: "Together, We Create Impact",
        className: "uppercase tracking-[4px]  font-semibold"
      },
      title: {
        text: "Be the Light for Someone in Need",
        className: " font-bold leading-tight"
      },
      description: {
        text: "Your kindness has the power to change lives. Join us in bringing hope, support, and brighter futures to those in need. Every donation makes a difference big or small.",
        className: "font-normal  leading-tight"
      }
    },
    buttons: [
      {
        id: 1,
        text: "Become a Volunteer",
        variant: "primary",
        className: "bg-[#009BE2] text-white hover:bg-[#009BE2]/80",
        icon: true
      },
      {
        id: 2,
        text: "How can I help?",
        variant: "secondary",
        className: "bg-white/90 lg:bg-white text-black hover:bg-white",
        icon: true
      }
    ]
  };

  // About Us Data
  const aboutUsData = {
    section: {
      title: "About us",
      description: "A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur's promotion and capacity building of the underprivileged directing towards a just society. Interventions, DUS strives to bring about positive change in the quality of life of the poor community of rural Bangladesh.",
      button: {
        text: "More about us",
        link: "/about"
      }
    },
    mission: {
      title: "The mission of our organization",
      items: [
        {
          id: 1,
          icon: "/storage/uploads/Home/AboutUs/education.png",
          title: "Education for All",
          description: "Charity is dedicated to ensuring that every child has access to quality education.",
          alt: "Education Icon"
        },
        {
          id: 2,
          icon: "/storage/uploads/Home/AboutUs/healthcare.png",
          title: "Health and Wellness",
          description: "Our commitment to health and wellness extends across borders.",
          alt: "Health Icon"
        },
        {
          id: 3,
          icon: "/storage/uploads/Home/AboutUs/disaster-recovery.png",
          title: "Disaster Relief",
          description: "In times of crisis, Charity responds swiftly to provide emergency relief.",
          alt: "Disaster Relief Icon"
        },
        {
          id: 4,
          icon: "/storage/uploads/Home/AboutUs/investment.png",
          title: "Community Development",
          description: "Charity invests in sustainable community development projects to create.",
          alt: "Community Development Icon"
        }
      ]
    },
    impact: {
      title: "Impact In Numbers",
      stats: [
        {
          id: 1,
          value: "20",
          suffix: "+",
          label: "Years of Service"
        },
        {
          id: 2,
          value: "15",
          suffix: "+",
          label: "Project Program"
        },
        {
          id: 3,
          value: "10",
          suffix: "+",
          label: "Award Received"
        }
      ]
    },
    image: {
      src: "https://placehold.es/2048x2048/cccccc/webp?text=Placeholder",
      alt: "About Us Image"
    }
  };

  // Our Action Data
  const ourActionData = {
    section: {
      title: "Our Actions for Social Change",
      description: "We turn compassion into action by implementing community-led programs, advocating for social justice, and promoting education, health, and equality"
    },
    actions: [
      {
        id: 1,
        icon: "/storage/uploads/Home/OurAction/006-mortarboard.png",
        title: "Education",
        description: "We empower communities by investing in sustainable projects, training livelihood programs.",
        alt: "Education Icon"
      },
      {
        id: 2,
        icon: "/storage/uploads/Home/OurAction/004-financial-inclusion.png",
        title: "Microfinance",
        description: "We empower communities by investing in sustainable projects, training livelihood programs.",
        alt: "Microfinance Icon"
      },
      {
        id: 3,
        icon: "/storage/uploads/Home/OurAction/007-cardiogram.png",
        title: "Health",
        description: "Providing nutritious meals and groceries to individuals and families in need.",
        alt: "Health Icon"
      },
      {
        id: 4,
        icon: "/storage/uploads/Home/OurAction/008-leadership.png",
        title: "Organizational Development",
        description: "We empower underprivileged children with the opportunity to learn, grow, and succeed.",
        alt: "Organizational Development Icon"
      },
      {
        id: 5,
        icon: "/storage/uploads/Home/OurAction/003-global-warming.png",
        title: "Climate Change",
        description: "From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.",
        alt: "Climate Change Icon"
      },
      {
        id: 6,
        icon: "/storage/uploads/Home/OurAction/002-action.png",
        title: "Human Rights",
        description: "From free medical camps to life-saving treatments, we support initiatives that provide critical aid to access to proper.",
        alt: "Human Rights Icon"
      },
      {
        id: 7,
        icon: "/storage/uploads/Home/OurAction/009-teamwork.png",
        title: "Human Resource",
        description: "Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.",
        alt: "Human Resource Icon"
      },
      {
        id: 8,
        icon: "/storage/uploads/Home/OurAction/001-user.png",
        title: "Social Enterprises",
        description: "We empower communities by investing in sustainable projects, training livelihood programs.",
        alt: "Social Enterprises Icon"
      },
      {
        id: 9,
        icon: "/storage/uploads/Home/OurAction/010-food-safety.png",
        title: "Agriculture Food Security",
        description: "Bringing clean and safe drinking water to communities, improving sanitation, and preventing waterborne diseases.",
        alt: "Agriculture Food Security Icon"
      }
    ]
  };

  // Where We Work Data
  const whereWeWorkData = {
    section: {
      title: "Where We Work"
    },
    stats: [
      {
        id: 1,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "450K",
        label: "Total Member Reach",
        alt: "Member Reach Icon"
      },
      {
        id: 2,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "450K",
        label: "Total Member Reach",
        alt: "Member Reach Icon"
      },
      {
        id: 3,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "450K",
        label: "Total Member Reach",
        alt: "Member Reach Icon"
      },
      {
        id: 4,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "41,382",
        label: "Mail Engaged in Diverse Livelihoods Options",
        alt: "Mail Engaged Icon"
      },
      {
        id: 5,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "35,193",
        label: "Women Engaged in Diverse Livelihoods Options",
        alt: "Women Engaged Icon"
      },
      {
        id: 6,
        icon: "/storage/uploads/Home/WhereWeWork/001-kindness.png",
        value: "41,382",
        label: "Mail Engaged in Diverse Livelihoods Options",
        alt: "Mail Engaged Icon"
      }
    ],
    image: {
      src: "https://placehold.es/710x930/cccccc/webp?text=Map%20Place%20holder%20Text",
      alt: "Map Place holder Text",
      className: "w-full h-232.5 object-cover rounded-4xl"
    }
  };

  // Our Programs Data
  const ourProgramsData = {
    section: {
      title: "Our Programs",
      description: "We design and develop modern web solutions with a professional design using latest technologies and trends.",
      button: {
        text: "View all Projects and programs",
        link: "/projects-programs"
      }
    },
    programs: [
      {
        id: 1,
        title: "Micro-Finance <br /> Program",
        description: "Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Micro-Finance",
        bgColor: "bg-[#E6F3E7]",
        link: "/programs/micro-finance"
      },
      {
        id: 2,
        title: "Climate Change and Disaster Management Program",
        description: "DUS is geographically located at very exposed disaster risk area of Coastal Bangladesh, most of its beneficiaries as well as core staffs of the organization and volunteers including general members are experienced by the influence of topography & living experience with the community, to cope with and face any natural disaster. Further during its lifetime DUS was active in major emergency in relief and rehabilitation programs following Nov. 1970 cyclone relief, 1988/1991-cyclone recovery, 1998 flood response, SIDR 2007 etc. DUS is now moving beyond relief and rehabilitation into institutionalized preparedness, risk reduction and management interventions as well as long term adaptation strategies as consequence of lessons learnt while helping communities cope with the devastating effects of Cyclone SIDR, which struck in November 2007.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Climate+Change",
        bgColor: "bg-[#F3EDE6]",
        link: "/programs/climate-change"
      },
      {
        id: 3,
        title: "Community Radio",
        description: "Strengthening Hatiya Island community for pioneering-connecting and empowering their Voice for Change Bangladesh Government has already acknowledged the importance of community radio and announced the Community Radio Installation, Broadcast & Operation Policy. Bangladesh is the 2nd country in South Asia in formulating policy for Community Radio. Meanwhile, Govt.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#E8E6F3]",
        link: "/programs/community-radio"
      },
      {
        id: 4,
        title: "Research and Documentation",
        description: "DUS has a strong Research and Documentation Cell to conduct quality research in diverse areas of human and social development sectors, covering most importantly education, health, livelihood development, environment, human rights and social justice. The R&D cell works as a professional support services unit to fulfill the growing demand for generation and systematic analysis of information in connection with the increasing involvement of DUS in its development activities. Thus it engages in survey and research activities addressing the in-house needs of the organization for exploring and examining the feasible approaches for development, planning, designing, piloting, assessing and improving the implementation and performance of a wide range of projects, and determining the best practices and models of socio-economic interventions.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#F3E6EA]",
        link: "/programs/community-radio"
      },
      {
        id: 5,
        title: "WATSAN Program",
        description: "Building on its long experience of providing water and sanitation services to communities, DUS started its Water and Sanitation program with the financial and technical support of the Netherland Govt. The program is implementing in Nangolia Char and Nalerchar under Hatiya Upazilla. Our goal is to provide sustainable and integrated WATSAN services in the rural areas and break the contamination cycle of unsanitary latrines, contaminated water and unsafe hygiene practices, as well as ensure sustainability and scaling-up of WATSAN services. The program aims to ensure access to sanitation services for four thousand six hundred & five household, safe water services with 250 nos. DTW and hygiene education for around 20000 people of the respective area of DUS.",
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        bgColor: "bg-[#F2F3E6]",
        link: "/programs/community-radio"
      }
    ]
  };

  // Stories Data
  const storiesData = {
    section: {
      title: "Insights, Stories & Impact",
      description: "Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact."
    },
    stories: [
      {
        id: 1,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "Invest in Kindness, Reap a Better Future",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/invest-in-kindness"
      },
      {
        id: 2,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/custom-pool-design"
      },
      {
        id: 3,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "June 6, 2023",
        title: "The Benefits of Mindfulness in Daily Life",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        link: "/stories/mindfulness-benefits"
      },
      {
        id: 4,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "July 15, 2023",
        title: "Empowering Women Through Microfinance",
        description: "Discover how small loans are making a big difference in the lives of women entrepreneurs in rural communities. Our microfinance program has helped thousands of women start their own businesses and achieve financial independence.",
        link: "/stories/empowering-women"
      },
      {
        id: 5,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "August 2, 2023",
        title: "Building Resilient Communities Against Climate Change",
        description: "Learn about our initiatives to help coastal communities adapt to the impacts of climate change through sustainable farming practices, disaster preparedness, and ecosystem restoration.",
        link: "/stories/climate-resilience"
      },
      {
        id: 6,
        image: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
        date: "September 10, 2023",
        title: "Providing Clean Water to Remote Villages",
        description: "Access to clean water is a basic human right. See how our WATSAN program is bringing safe drinking water to communities that have never had it before.",
        link: "/stories/clean-water"
      }
    ]
  };

  // Upcoming Events Data
  const upcomingEventsData = {
    section: {
      title: "Upcoming Events & Community Actions",
      description: "Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.",
      button: {
        text: "Explore All Events",
        link: "/events"
      }
    },
    image: {
      src: "https://placehold.es/700x500/cccccc/webp?text=Community+Radio",
      alt: "Events Image",
      className: "mt-15 rounded-2xl h-139.25 w-auto"
    },
    events: [
      {
        id: 1,
        date: {
          day: "25",
          month: "Apr",
          weekday: "THU",
          dayNumber: "1",
          time: "10:30AM"
        },
        location: "International Convention City Bashundhara - ICCB",
        title: "Participate in our community clean-up day and make a difference together",
        description: "Let's shape the future of the food industry together! Participate at the 9th Food Bangladesh Int'l Expo 2026,",
        link: "/events/community-cleanup"
      },
      {
        id: 2,
        date: {
          day: "28",
          month: "Apr",
          weekday: "SUN",
          dayNumber: "2",
          time: "02:00PM"
        },
        location: "Dhaka University Campus - Dhaka",
        title: "Education for All: Scholarship Distribution Ceremony",
        description: "Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education.",
        link: "/events/scholarship-ceremony"
      },
      {
        id: 3,
        date: {
          day: "05",
          month: "May",
          weekday: "MON",
          dayNumber: "3",
          time: "09:00AM"
        },
        location: "Hatiya Island Community Center - Noakhali",
        title: "Climate Adaptation Workshop for Coastal Communities",
        description: "Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas.",
        link: "/events/climate-workshop"
      }
    ]
  };

  // Jobs Data
  const jobsData = {
    section: {
      title: "Join our big family",
      description: "Join us on this journey of kindness, and let's make a difference, one act of charity at a time."
    },
    filter: {
      placeholder: "Browse By",
      options: [
        { value: "", label: "Browse By" },
        { value: "all", label: "All Jobs" },
        { value: "full-time", label: "Full Time" },
        { value: "part-time", label: "Part Time" },
        { value: "contract", label: "Contract" },
        { value: "remote", label: "Remote" },
        { value: "internship", label: "Internship" }
      ]
    },
    jobs: [
      {
        id: 1,
        type: "Full time",
        department: "Management",
        location: "Dhaka, Bangladesh",
        title: "Senior Program Manager - Microfinance",
        description: "Lead and oversee microfinance program operations, manage team of field officers, and ensure sustainable financial inclusion for underserved communities.",
        link: "/jobs/senior-program-manager"
      },
      {
        id: 2,
        type: "Part time",
        department: "Development",
        location: "Anywhere in Bangladesh",
        title: "Program Coordinator - Youth Empowerment",
        description: "Develop and deliver workshops, mentorship programs, and educational events for underprivileged youth to build essential life skills.",
        link: "/jobs/youth-coordinator"
      },
      {
        id: 3,
        type: "Full time",
        department: "Climate Action",
        location: "Hatiya, Noakhali",
        title: "Climate Change Specialist",
        description: "Design and implement climate adaptation strategies, conduct risk assessments, and train communities on disaster preparedness.",
        link: "/jobs/climate-specialist"
      },
      {
        id: 4,
        type: "Contract",
        department: "Research",
        location: "Remote",
        title: "Research Associate - Impact Assessment",
        description: "Conduct qualitative and quantitative research, analyze program data, and prepare impact reports for stakeholders.",
        link: "/jobs/research-associate"
      },
      {
        id: 5,
        type: "Internship",
        department: "Media",
        location: "Chattogram",
        title: "Radio Production Intern",
        description: "Assist in content creation, audio production, and community outreach programs for our community radio station.",
        link: "/jobs/radio-intern"
      }
    ]
  };

  // Program Impact Data
  const programImpactData = {
    section: {
      title: "Program Impact and SDGs",
      mainImage: {
        images: [
          "https://placehold.co/700x745/cccccc/webp?text=Community+Radio+1",
          "https://placehold.co/700x745/bbbbbb/webp?text=Community+Radio+2",
          "https://placehold.co/700x745/aaaaaa/webp?text=Community+Radio+3",
          "https://placehold.co/700x745/dddddd/webp?text=Community+Radio+4"
        ]
      }
    },
    sdgImages: [
      { id: 1, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+1", alt: "No Poverty" },
      { id: 2, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+2", alt: "Zero Hunger" },
      { id: 3, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+3", alt: "Good Health" },
      { id: 4, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+4", alt: "Quality Education" },
      { id: 5, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+5", alt: "Gender Equality" },
      { id: 6, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+6", alt: "Clean Water" },
      { id: 7, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+7", alt: "Clean Energy" },
      { id: 8, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+8", alt: "Decent Work" },
      { id: 9, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+9", alt: "Industry Innovation" },
      { id: 10, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+10", alt: "Reduced Inequalities" },
      { id: 11, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+11", alt: "Sustainable Cities" },
      { id: 12, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+12", alt: "Responsible Consumption" },
      { id: 13, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+13", alt: "Climate Action" },
      { id: 14, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+14", alt: "Life Below Water" },
      { id: 15, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+15", alt: "Life On Land" },
      { id: 16, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+16", alt: "Peace Justice" },
      { id: 17, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+17", alt: "Partnerships" },
      { id: 18, src: "https://placehold.es/200x200/cccccc/webp?text=SDG+18", alt: "SDG 18" }
    ]
  };

  // Top Bar Data
  const topBarData = {
    contactInfo: {
      email: {
        text: "dus.eddus@gmail.com",
        icon: "/images/TopBar/Email.svg",
        alt: "Email"
      },
      phone: {
        text: "+880 1761-493412",
        icon: "/images/TopBar/Phone.svg",
        alt: "Phone"
      },
      hours: {
        text: "Sun - Thu 9:00AM - 5:00PM",
        icon: "/images/TopBar/Clock.svg",
        alt: "Clock"
      }
    },
    languages: [
      { code: 'us', name: 'English', flag: '/images/Flags/united-states.png' },
      { code: 'bd', name: 'Bengali', flag: '/images/Flags/bangladesh.png' },
      { code: 'fr', name: 'French', flag: '/images/Flags/france.png' },
    ],
    userMenu: {
      guest: [
        { label: "Login", route: "login", type: "link" },
        { label: "Register", route: "register", type: "link" }
      ],
      authenticated: [
        { divider: true },
        { label: "Dashboard", route: "dashboard", type: "link" },
        { label: "Logout", type: "button", action: "logout" }
      ]
    },
    socialLinks: [
      { id: 1, name: "Facebook", url: "https://facebook.com", icon: FaFacebook, hoverColor: "hover:text-blue-400" },
      { id: 2, name: "Instagram", url: "https://instagram.com", icon: FaInstagram, hoverColor: "hover:text-pink-400" },
      { id: 3, name: "Twitter", url: "https://twitter.com", icon: FaXTwitter, hoverColor: "hover:text-gray-400" },
      { id: 4, name: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin, hoverColor: "hover:text-blue-500" }
    ],
    search: {
      placeholder: "Search...",
      buttonText: "Search"
    }
  };

  // Navbar Data
  const navbarData = {
    logo: {
      src: "/images/Icon.svg",
      alt: "DUS Logo",
      className: "h-17.5 w-auto",
      href: "/"
    },
    navLinks: [
      { name: 'About', href: '/about' },
      { name: 'Projects & Programs', href: '/projects-programs' },
      { name: 'Workplace Area', href: '/workplace-area' },
      { name: 'Posts', href: '/posts' },
      { name: 'Media', href: '/media' },
      { name: 'Get Involved', href: '/get-involved' },
    ],
    button: {
      text: "Contact Us",
      href: "/contact",
      className: "capitalize text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200"
    },
    mobileMenu: {
      buttonOpenIcon: Menu,
      buttonCloseIcon: X,
      className: "md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
    }
  };

  // Footer Data
  const footerData = {
    logo: {
      src: "/images/Icon-bottom.svg",
      alt: "DUS Logo",
      className: "h-41.25 w-auto"
    },
    description: "A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur's promotion and capacity building of the underprivileged directing towards a just society",
    socialLinks: [
      { icon: FaFacebook, url: "#", hoverColor: "hover:text-blue-400", ariaLabel: "Facebook" },
      { icon: FaInstagram, url: "#", hoverColor: "hover:text-pink-400", ariaLabel: "Instagram" },
      { icon: FaXTwitter, url: "#", hoverColor: "hover:text-gray-400", ariaLabel: "Twitter" },
      { icon: FaLinkedin, url: "#", hoverColor: "hover:text-blue-500", ariaLabel: "LinkedIn" }
    ],
    address: {
      title: "Address",
      details: "24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207",
    },
    contact: {
      title: "Call",
      numbers: [
        "+88 01761 493407",
        "+88 01622 093793 – (In Emergency)",
        "+88 02 48110362"
      ]
    },
    email: {
      title: "Email Us",
      addresses: [
        "dusdhaka@gmail.com",
        "dus.eddus@gmail.com"
      ]
    },
    quickLinks: [
      "About Us", "Community Radio", "Evaluation", "Working Area",
      "Publication", "Mission & Visions", "Blogs", "Contact Us"
    ],
    programs: [
      "Micro-Finance Program", "Disaster Management", "Community Radio", "Education",
      "ICT for Development", "Health Program", "Livelihood", "Member Facilities",
      "Social Development", "Legal Support", "Agriculture", "Water and Sanitation",
      "Research and Documentation", "Training Facilities", "Tourism"
    ],
    newsletter: {
      title: "Subscribe to Our Newsletter",
      placeholder: "Enter your email address",
      buttonText: "Subscribe"
    },
    bottomFooter: {
      copyright: "© 2026 Dwip Unnayan. All rights reserved.",
      links: [
        { text: "Terms of Service", url: "/terms" },
        { text: "Privacy Policy", url: "/privacy" }
      ]
    }
  };


  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} >
      {/* Meta */}
      <Head title="DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Banner Section */}
      <BannerSection bannerData={bannerData} />

      {/* About Us Section */}
      <AboutUsSection aboutUsData={aboutUsData} />

      {/* Our Action Section */}
      <OurActionSection actionData={ourActionData} />

      {/* Where We Work Section */}
      <WhereWeWorkSection workData={whereWeWorkData} />

      {/* Our Programs Section */}
      <OurProgramsSection programsData={ourProgramsData} />

      {/* Stories Section */}
      <StoriesSection storiesData={storiesData} />

      {/* Upcoming Events Section */}
      <UpcomingEventsSection eventsData={upcomingEventsData} />

      {/* Jobs Section */}
      <JobsSection jobsData={jobsData} />

      {/* Program Impact Section */}
      <ProgramImpactSection impactData={programImpactData} />
    </PublicLayout>
  );
}