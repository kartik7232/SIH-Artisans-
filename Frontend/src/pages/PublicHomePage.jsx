import React from 'react';
import HeritageHero from '../components/public/HeritageHero';
import ProblemSection from '../components/public/ProblemSection';
import ArtisanHeritageGallery from '../components/public/ArtisanHeritageGallery';
import HowItWorks from '../components/public/HowItWorks';
import CraftShowcaseSection from '../components/public/CraftShowcaseSection';
import ImpactSection from '../components/public/ImpactSection';
import HeritageFooter from '../components/public/HeritageFooter';

export default function PublicHomePage() {
  return (
    <div className="public-home-page">
      <HeritageHero />
      <ProblemSection />
      <ArtisanHeritageGallery />
      <HowItWorks />
      <CraftShowcaseSection />
      <ImpactSection />
      <HeritageFooter />
    </div>
  );
}
