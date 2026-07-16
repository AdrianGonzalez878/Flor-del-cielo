"use client";

import { NextStudio } from "next-sanity/studio";

import { StudioSetup } from "@/components/studio/StudioSetup";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <StudioSetup />;
  }

  return <NextStudio config={config} />;
}
