// resources/js/Pages/Frontend/Home/Home.jsx

// Inertia
import { Head } from "@inertiajs/react";


// Components
import PublicLayout from "../../../layouts/PublicLayout";

// Sections
import JobsSection from "./Sections/JobsSection";
import BannerSection from "./Sections/BannerSection";
import StoriesSection from "./Sections/StoriesSection";
import AboutUsSection from "./Sections/AboutUsSection";
import OurActionSection from "./Sections/OurActionSection";
import WhereWeWorkSection from "./Sections/WhereWeWorkSection";
import OurProgramsSection from "./Sections/OurProgramsSection";
import ProgramImpactSection from "./Sections/ProgramImpactSection";
import UpcomingEventsSection from "./Sections/UpcomingEventsSection";

// resources/js/Pages/Frontend/Home.jsx
export default function Home({
  bannerData,
  aboutUsData,
  ourActionData,
  whereWeWorkData,
  ourProgramsData,
  storiesData,
  upcomingEventsData,
  jobsData,
  programImpactData,
  topBarData,
  navbarData,
  footerData
}) {
  // No need to define data here anymore - it comes from controller!

  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData}>
      <Head title="DUS - Dwip Unnayan Society | Empowering Communities" />

      <BannerSection bannerData={bannerData} />
      <AboutUsSection aboutUsData={aboutUsData} />
      <OurActionSection actionData={ourActionData} />
      <WhereWeWorkSection workData={whereWeWorkData} />
      <OurProgramsSection programsData={ourProgramsData} />
      <StoriesSection storiesData={storiesData} />
      <UpcomingEventsSection eventsData={upcomingEventsData} />
      <JobsSection jobsData={jobsData} />
      <ProgramImpactSection impactData={programImpactData} />
    </PublicLayout>
  );
}