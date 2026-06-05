// resources/js/Pages/Frontend/About/About.jsx

// Inertia
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import LegalSection from "./LegalSection/LegalSection";
import CardsSection from "./CardsSection/CardsSection";
import BannerSection from "./BannerSection/BannerSection";
import HeroFigureSection from "./HeroFigureSection/HeroFigureSection";
import FAQSection from "./FAQSection/FAQSection";

const About = ({
  topBarData,
  navbarData,
  footerData,
}) => {

  const bannerData = {
    background: {
      src: 'https://placehold.co/1920x589',
      alt: 'Background'
    },
    'overlay': {
      'darkOverlay': 'bg-black/40 lg:bg-black/50',
      'gradient': 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
    },
    'content': {
      'title': {
        'text': 'About Us',
        'className': 'font-bold leading-tight'
      },
      'description': {
        'text': 'Our mission is to help all the people in need',
        'className': 'font-normal leading-tight'
      }
    },
  };

  const visionAndMissionData = {
    section: {
      title: 'Vision, Mission, Goal, Objectives and Core values'
    },
    content: {
      vision: {
        title: 'Vision',
        paragraphs: [
          'DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice leading an equitable and gender balanced communities.',
        ]
      },
      mission: {
        title: 'Mission',
        paragraphs: [
          'Coastal areas of Bangladesh are regularly stricken by natural disasters. Most of the people living here are almost poor. Due to regular natural disasters occurs here inhabitants are lacking asset and resources and they are deepened in illiterate, malnourished and culturally remain backward. DUS believes that optimizing utilization of hidden humane capacity & power and local resources intensively could gradually alleviate this condition. It perceives to bring down all this scope of development affords in an integrated manner so that sustainable livelihood ventures emerge in the community according to their aspiration.',
          'Initiating, activating, promoting and facilitating the sustainable development of the targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protected equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.',
        ]
      },
      functions: {
        buttonText: 'Learn More About Vision, Mission, Goal,',
        link: '/about/functions'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Vision and Mission',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const backgroundData = {
    section: {
      title: 'Background, Roles and Functions'
    },
    content: {
      background: {
        title: 'Background:',
        paragraphs: [
          'The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.',
          'DUS, by virtue of its roles, functions and services being visioned and dreamt by the founder and associates, is basically a development and philanthropic organization located at Hatiya Island under Noakhali district in southern Bangladesh. The main focus and concentration of the organization since its inception has been to humanitarian and rehabilitation work for war and cyclone victim affected populations which in the passage of time has turned into integrated socio-economic and sustainable community development services directing towards a just society free from all sorts of exploitation, injustice and deprivation.',
          'Until 1981, DUS has been well-thought-out and recognized as a volunteer initiative for providing aid, relief and rehabilitation related activities and gaining experiences on the said services over last one decade since its inception, the structural based organizational formation took into shape in 1982, announcing its mandate as an association/platform for land development, protection and restoration.'
        ]
      },
      functions: {
        buttonText: 'Learn More About Functions',
        link: '/about/functions'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Background',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const legalData = {
    background: {
      src: 'https://placehold.co/1920x589',
      alt: 'Background'
    },
    overlay: {
      darkOverlay: 'bg-black/40',
    },
    textBox: {
      title: 'Legal Status and Org.',
      titleLine2: 'Affiliations',
      buttonText: 'Learn More Affiliations',
      buttonLink: '/about/legal'
    }
  }

  const interventionalData = {
    section: {
      title: 'Interventional Approaches and DUS Priorities'
    },
    content: {
      Poverty_Reduction: {
        title: 'Sustainable Poverty Reduction and Human Development:',
        paragraphs: [
          'The development interventional unit of GoB is each Household. DUS believes if the member of the HHs are developed then they can play an active role to bring immense changes within their families. As a whole each household take part into the process of socio-economic development of the country.',
          'This Organization\'s aim to help its member\'s inherent abilities to ﬂourish such a way so that they are endowed with the key to their progress to a sustainable livelihood restoration. With renewed confidence and hope, the poor, then, move ahead and break free from the shackles of multidimensional poverty and indignity and achieve living standards characterized by human freedom and dignity, along with material uplift. '
        ]
      },
      Focus: {
        title: 'Focus on Landless poor',
        paragraphs: [
          'DUS concentrates on the settlement of landless poor families who are victims of major riverbank erosion & affected by several natural disasters like tropical cyclone, salinity, tidal surge etc that are living below poverty line in the coastal district of Bangladesh.'
        ]
      },
      Empowerment: {
        title: 'Empowerment of Women',
        paragraphs: [
          'Over 87% of our target population/beneficiaries are poor women. DUS believes if women are empowered towards right direction, they can play an active role to bring vital changes within their families as well as in the communities.'
        ]
      },
      functions: {
        buttonText: 'Learn More About Interventional Approaches',
        link: '/about/functions'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Interventional Approaches',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const EvolutionaryChangesData = {
    section: {
      title: 'Evolutionary Changes and Footings'
    },
    content: {
      1972: {
        title: 'Year 1972-1985',
        type: 'list',
        listGap: 'gap-[1px]',
        listItemGap: 'ml-1 mr-2',
        items: [
          'DUS was formed by a group of young volunteers and started working for the victims of Bangladesh Liberation War of 1971 and devastating 1970 cyclone affected households at Hatiya Island focusing on humanitarian service to mankind',
          'Relief and rehabilitation program for the victims and initiate disaster management program at local level',
          'Rehabilitation of 2000 landless river bank eroded farmers in the newly accreted Govt. Khash land',
          'DUS turn into an organizational shape and named as Dwip Unnayan Sangstha in 1982',
          'Community Mobilization and revolving credit support to community started in 1984',
          'Registered with Ministry of Social Services & Welfare.',
          'Registered with NGO Affairs Bureau.',
          'Socio-economic development programs for the poor initiative from 1985',
        ]
      },
      1986: {
        title: 'Year 1986-2000',
        type: 'list',
        listGap: 'gap-[1px]',
        listItemGap: 'ml-1 mr-2',
        items: [
          'Strengthening Local Govt. bodies through capacity building in good governance, accountancy and resource management supported by IVS/ USAID',
          'Capacity building of Union Parishad and Upazila Parishad for effective disaster management in four coastal district of Bangladesh supported by CARE-Bangladesh & USAID',
          'Island fisheries development project implementation supported by DFID.',
          'Disaster rehabilitation support project implementation supported by AusAid/Oxfam-America/Oxfam-UK, Oxfam-Hong Kong British ODA',
          'Cyclone shelter Construction supported by CAA Australia',
          'Housing support for poor supported by British ODA/CARE-Bangladesh/AusAid',
          'Livestock development for poor supported by DANIDA, CIDA',
          'Integrated Socio-economic development program supported by Oxfam-UK',
          'Emergency Relief and Rehabilitation for Cyclone in coastal islands supported by Oxfam-UK, British ODA, CARE-Bangladesh',
          'Livelihood Rehabilitation for Flood Affected Fisheries Households in Hatiya Island supported by DFID',
          'Flood 98 Rehabilitation program supported by DFID, Oxfam-GB',
        ]
      },

      functions: {
        buttonText: 'Learn More About 2001 - 2020',
        link: '/about/functions'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Interventional Approaches',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const GovernanceData = {
    section: {
      title: 'Governance'
    },
    content: {
      governance: {
        paragraphs: [
          'DUS believes in democratic practice and public-private participation to achieve its goal, purpose and objectives and accordingly the internal management system has been framed comprising the following structures:',
          'General Body: The General Body consists of 31 members who are the permanent resident of the coastal community. Of them 30% are women. The social and professional status of the members include teachers, lawyers, social workers, freedom fighters and community leaders.',
          'Executive Committee: DUS has an Executive Committee of 7 members duly elected by the General Body for a period of three years.  DUS is represented by its Executive Director who is the Member Secretary of the Executive Committee. ED and his core staff members are appointed by the board. Executive Director is treated as the Chief Executive of the organization. The Executive Director is the overall authority to implement the projects and programs on behalf of the Executive Comm',
        ],
      },
      functions: {
        buttonText: 'Learn More About Governance',
        link: '/about/functions'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Interventional Approaches',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const CardsData = {
    section: {
      title: 'Cards Section'
    },
    cards: [
      {
        id: 'operational-areas',
        image: {
          src: 'https://placehold.co/335x440',
          alt: 'Operational Areas',
          className: 'mx-auto object-contain'
        },
        title: 'Operational Areas',
        buttonText: 'Explore Our Areas of Operation',
        buttonLink: '/about/operational-areas',
        bgColor: 'bg-[#F5F5F5]',
        cardBgColor: 'bg-white'
      },
      {
        id: 'achievements',
        image: {
          src: 'https://placehold.co/670x420',
          alt: 'Our Achievements',
          className: 'mx-auto object-contain'
        },
        title: 'Our Achievements',
        buttonText: 'Explore Our Evolution',
        buttonLink: '/about/achievements',
        bgColor: 'bg-[#F5F5F5]',
        cardBgColor: 'bg-white'
      }
    ]
  };

  const ProgramsData = {
    section: {
      title: 'Programs/Activities',
    },
    content: {
      'Micro-Finance Program': {
        title: 'Micro-Finance Program',
        paragraphs: [
          'Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.  ',
          'Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass rote level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.'
        ]
      },
      "Jagoron": {
        title: 'Jagoron',
        paragraphs: [
          'Jagoron is the name of a credit instrument of PKSF to initiate household based enterprise development in Bangladesh. As a Partner Organization of PKSF, DUS is implementing this program which is now comprised with Rural Micro finance and Urban Micro finance. Rural Micro finance is that types of loan which allows rural women to finance their small scale agriculture production at homestead level. ',
          'RMC Loans are allowed as working capital loans to promote poor and disadvantaged households in income earnings. RMC loan range from 10K to 59K to allowed for one year and service charge is 24% (Reducing Balancing Method)/12.0% (Flat Rate Method) per year. The weekly savings of RMC members are 10/= per week.'
        ],
      },
      functions: {
        buttonText: 'Learn More About Programs',
        link: '/about/programs'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Interventional Approaches',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const TrainingData = {
    section: {
      title: 'Training and Other Facilities',
    },
    content: {
      'training': {
        paragraphs: [
          'DUS believes that training is a key element of the development approach which focuses on people and their participation. Training has been introduced as an essential element of DUS’s intervention strategy.',
          'DUS takes up need based training programs, prepares module and training curriculum. The training programs generally involve flip chart, posters, handouts, cards & charts, audiocassettes, videocassettes, original model, curriculum, modules, photographs etc. DUS has already developed a training and communication Unit fully equipped with all possible physical and human resources. DUS is organized different type of training since last two decades:',
          'DUS is organized different type of training for its staffs as well as beneficiaries. DUS always prepare its yearly training plan which is incorporated basic skill development training for staffs, MIS, ToT general, Branch management and Finance management etc.',
          'DUS conducts it’s skill development training through identification of people who need skill training. This is done by conducting survey to identify marketable skills, developing modules of livelihood skills program, conducting training to the selected people, select graduates of the skill program to receive capital, linking other graduates to employment or credit program, following up the graduates to see whether they are able to achieve sustainable livelihood. The skills training programs include tree nursery management, sustainable agriculture, poultry and cattle rearing etc.',
          'Leadership development training is a very important intervention of DUS. Leadership development training is intended for the group members under different project interventions. The training programs focus financial management of community fund, conflict management, and bottom-up planning for sustainable rural livelihoods.',
        ]
      },
      functions: {
        buttonText: 'Learn More About Dus Facilities',
        link: '/about/facilities'
      }
    },
    image: {
      src: 'https://placehold.co/730x730',
      alt: 'Interventional Approaches',
      className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
    }
  };

  const FAQData = {
    section: {
      title: 'Key Questions Answered About Our Us',
      subtitle: 'Explore our Frequently Asked Questions for answers about our charity\'s mission, projects, and how to help.'
    },
    faqs: [
      {
        id: 1,
        question: 'What is the mission of your charity?',
        answer: 'Any company that is using spreadsheets and emails to manage the people side of their business is wasting time on admin and making life more difficult for themselves. A well-designed HR system like PiHR automates menial tasks allowing business owners to focus on the strategic work of growing the business. It improves the recruitment process, enriches payroll management, provides real-time feedback, improves employees, improves data security, helps make decisions.',
      },
      {
        id: 2,
        question: 'Who benefits from your programs?',
        answer: 'Our programs benefit underprivileged communities, women and children, disaster-affected families, and landless poor in coastal areas of Bangladesh.',
      },
      {
        id: 3,
        question: 'Can I make a recurring donation?',
        answer: 'Yes, you can make recurring donations monthly, quarterly, or annually. Visit our donation page to set up your recurring contribution.',
      },
      {
        id: 4,
        question: 'Can I visit the projects I support?',
        answer: 'Yes, we welcome donors to visit our project sites. Please contact our office in advance to arrange a visit and meet the communities you are supporting.',
      },
      {
        id: 5,
        question: 'How can I get involved?',
        answer: 'You can get involved by donating, volunteering, sponsoring a child, or becoming a community ambassador. Visit our "Get Involved" page for more details.',
      },
      {
        id: 6,
        question: 'How can I make a donation?',
        answer: 'You can make a donation online through our secure payment portal, bank transfer, or by visiting our office. We accept one-time and recurring donations.',
      },
      {
        id: 7,
        question: 'How do you maintain accountability?',
        answer: 'We maintain transparency through regular audits, annual reports, community feedback mechanisms, and public disclosure of our financial statements.',
      },
      {
        id: 8,
        question: 'Are donations tax-deductible?',
        answer: 'Yes, donations to DUS are tax-deductible under applicable tax laws. You will receive a receipt for your donation for tax purposes.',
      }
    ]
  };


  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} >
      <Head title="DUS - Dwip Unnayan Society | Empowering Communities" />

      <BannerSection bannerData={bannerData} />

      <HeroFigureSection
        layout="text-left"
        data={backgroundData}
        sectionId="background"
      />

      <HeroFigureSection
        layout="text-right"
        data={visionAndMissionData}
        sectionId="vision-and-mission"
        bgColor="bg-[#F5F5F5]"
      />

      <HeroFigureSection
        layout="text-left"
        data={interventionalData}
        sectionId="interventional-approaches"
      />

      <LegalSection legalData={legalData} />

      <HeroFigureSection
        layout="text-left"
        data={EvolutionaryChangesData}
        sectionId="evolutionary-changes"
      />

      <HeroFigureSection
        layout="text-right"
        data={GovernanceData}
        sectionId="governance"
        bgColor="bg-[#F5F5F5]"
      />

      <CardsSection cardsData={CardsData} />

      <HeroFigureSection
        layout="text-right"
        data={ProgramsData}
        sectionId="programs-activities"
        bgColor="bg-[#F5F5F5]"
      />

      <HeroFigureSection
        layout="text-left"
        data={TrainingData}
        sectionId="training"
      />

      <FAQSection faqData={FAQData} />
    </PublicLayout >
  );
};

export default About;