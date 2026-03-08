"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LandingScreenProps {
  onContinue: () => void
  onLanguageToggle: (lang: "en" | "ml") => void
  selectedLanguages: ("en" | "ml")[]
}

export function LandingScreen({
  onContinue,
  onLanguageToggle,
  selectedLanguages,
}: LandingScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Image */}
      <div className="relative flex-1 min-h-[60vh]">
        <Image
          src="/images/kerala-villa-hero.jpg"
          alt="Kerala-style villa with traditional architecture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-12 pt-8 -mt-32 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-foreground mb-3">
            Design Your
            <br />
            <span className="font-medium">Dream Home</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-10 max-w-xs mx-auto leading-relaxed">
            Begin your architectural journey with Kerala&apos;s finest designers
          </p>

          {/* Language Selection */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => onLanguageToggle("en")}
              className={cn(
                "px-5 py-2 text-sm border transition-all duration-200",
                selectedLanguages.includes("en")
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/50"
              )}
            >
              English
            </button>
            <button
              onClick={() => onLanguageToggle("ml")}
              className={cn(
                "px-5 py-2 text-sm border transition-all duration-200",
                selectedLanguages.includes("ml")
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/50"
              )}
            >
              മലയാളം
            </button>
          </div>

          {/* Get Started Button */}
          <button
            onClick={onContinue}
            className="w-full max-w-[280px] py-4 text-sm font-medium tracking-wide bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
