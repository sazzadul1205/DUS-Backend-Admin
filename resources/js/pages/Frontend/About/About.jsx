// resources/js/Pages/Frontend/About/About.jsx

// Inertia
import { Head } from "@inertiajs/react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import LegalSection from "./LegalSection/LegalSection";
import BannerSection from "./BannerSection/BannerSection";
import HeroFigureSection from "./HeroFigureSection/HeroFigureSection";

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

  const EvolutionaryChanges = {
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

  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData}>
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
      />

      <HeroFigureSection
        layout="text-left"
        data={interventionalData}
        sectionId="interventional-approaches"
      />

      <LegalSection />

      <HeroFigureSection
        layout="text-left"
        data={EvolutionaryChanges}
        sectionId="evolutionary-changes"
      />

    </PublicLayout>
  );
};

export default About;