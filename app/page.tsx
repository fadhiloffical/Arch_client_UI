"use client"

import { useState } from "react"
import { LandingScreen } from "@/components/screens/landing-screen"
import { StyleDiscoveryScreen } from "@/components/screens/style-discovery-screen"
import { RequirementsScreen } from "@/components/screens/requirements-screen"
import { SummaryScreen } from "@/components/screens/summary-screen"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectedFeature = {
  id: string
  title: string
  titleMl: string
  icon: string
}

type Screen = "landing" | "style" | "requirements" | "summary"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [selectedLanguages, setSelectedLanguages] = useState<("en" | "ml")[]>([])
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [requirementsNotes, setRequirementsNotes] = useState("")
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [bhk, setBhk] = useState(3)
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>([])
  const [houseType, setHouseType] = useState<"single" | "double">("double")
  const [budgetRange, setBudgetRange] = useState<[number, number]>([50, 150])
  const [sqftRange, setSqftRange] = useState<[number, number]>([1500, 3000])
  const [submitted, setSubmitted] = useState(false)

  const handleLanguageToggle = (lang: "en" | "ml") => {
    setSelectedLanguages([lang])
  }

  // Primary display language (first selected, or default to "en")
  const language = selectedLanguages[0] || "en"

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        return prev.filter((id) => id !== styleId)
      }
      return [...prev, styleId]
    })
  }

  const handleFeatureToggle = (feature: SelectedFeature) => {
    setSelectedFeatures((prev) =>
      prev.some((f) => f.id === feature.id)
        ? prev.filter((f) => f.id !== feature.id)
        : [...prev, feature]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const screens: Screen[] = ["landing", "style", "requirements", "summary"]
  const currentIndex = screens.indexOf(currentScreen)

  const canGoNext = () => {
    if (currentScreen === "landing") return true
    if (currentScreen === "style") return selectedStyles.length > 0
    if (currentScreen === "requirements") return true
    return false
  }

  const goNext = () => {
    if (!canGoNext()) return
    const nextIndex = currentIndex + 1
    if (nextIndex < screens.length) {
      setCurrentScreen(screens[nextIndex])
    }
  }

  const goBack = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setCurrentScreen(screens[prevIndex])
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-light text-foreground mb-3">
            {language === "en" ? "Request Sent!" : "അഭ്യർത്ഥന അയച്ചു!"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {language === "en"
              ? "Our architects will review your project passport and contact you within 24 hours."
              : "ഞങ്ങളുടെ ആർക്കിടെക്റ്റുകൾ നിങ്ങളുടെ പ്രോജക്ട് പാസ്പോർട്ട് അവലോകനം ചെയ്ത് 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ ബന്ധപ്പെടും."}
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setCurrentScreen("landing")
              setSelectedLanguages([])
              setAdditionalNotes("")
              setRequirementsNotes("")
              setSelectedStyles([])
              setBhk(3)
              setSelectedFeatures([])
              setBudgetRange([50, 150])
              setSqftRange([1500, 3000])
              setHouseType("double")
            }}
            className="mt-8 text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            {language === "en" ? "Start a new project" : "ഒരു പുതിയ പ്രോജക്ട് ആരംഭിക്കുക"}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Progress Bar (visible after landing) */}
      {currentScreen !== "landing" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "en" ? "Back" : "പിന്നോട്ട്"}
            </button>
            <div className="flex gap-2">
              {["style", "requirements", "summary"].map((screen, i) => (
                <div
                  key={screen}
                  className={cn(
                    "w-8 h-1 rounded-full transition-colors",
                    screens.indexOf(currentScreen) > i || currentScreen === screen
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              ))}
            </div>
            {currentScreen !== "summary" ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  canGoNext()
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                {language === "en" ? "Next" : "അടുത്തത്"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-16" />
            )}
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className={cn(currentScreen !== "landing" && "pt-14")}>
        {currentScreen === "landing" && (
          <LandingScreen
            onLanguageToggle={handleLanguageToggle}
            selectedLanguages={selectedLanguages}
            onContinue={() => setCurrentScreen("style")}
          />
        )}
        {currentScreen === "style" && (
          <StyleDiscoveryScreen
            language={language}
            selectedStyles={selectedStyles}
            onStyleToggle={handleStyleToggle}
            additionalNotes={additionalNotes}
            onNotesChange={setAdditionalNotes}
          />
        )}
        {currentScreen === "requirements" && (
          <RequirementsScreen
            language={language}
            houseType={houseType}
            onHouseTypeChange={setHouseType}
            bhk={bhk}
            onBhkChange={setBhk}
            selectedFeatures={selectedFeatures}
            onFeatureToggle={handleFeatureToggle}
            budgetRange={budgetRange}
            onBudgetChange={setBudgetRange}
            sqftRange={sqftRange}
            onSqftChange={setSqftRange}
            additionalNotes={requirementsNotes}
            onNotesChange={setRequirementsNotes}
            selectedStyles={selectedStyles}
            styleNotes={additionalNotes}
          />
        )}
        {currentScreen === "summary" && (
          <SummaryScreen
            language={language}
            styles={selectedStyles}
            houseType={houseType}
            bhk={bhk}
            features={selectedFeatures}
            budgetRange={budgetRange}
            sqftRange={sqftRange}
            notes={requirementsNotes}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  )
}
