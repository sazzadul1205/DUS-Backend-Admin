// resources/js/Pages/Frontend/Home.jsx

import { Head } from '@inertiajs/react';
import PublicLayout from '../../../layouts/PublicLayout';
import Banner from './Components/Banner';
import AboutUs from './Components/AboutUs';

export default function Home() {
  return (
    <PublicLayout>
      <Head title="Job Match - Find Your Perfect Career" />

      <Banner />

      <AboutUs />
    </PublicLayout>
  );
}