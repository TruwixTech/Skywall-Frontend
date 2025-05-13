import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import { GoogleAnalytics } from "../utils/Ga4";

// Lazy load components
const HeroSection = lazy(() => import("../Components/HomepageComponents/HeroSection"));
const TelevisionCollections = lazy(() => import("../Components/HomepageComponents/TelevisionCollections"));
const VideoSection = lazy(() => import("../Components/HomepageComponents/VideoSection"));
const Section4 = lazy(() => import("../Components/HomepageComponents/Section4"));

function Homepage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <GoogleAnalytics trackingId='G-5FW6Z2SZGF' />
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <TelevisionCollections />
        <VideoSection />
        <Section4 />
      </Suspense>
    </div>
  );
}

export default Homepage;
