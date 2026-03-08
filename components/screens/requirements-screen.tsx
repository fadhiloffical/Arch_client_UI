"use client"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Home, Car, Flower2, BookOpen, Bath, Laptop, Tv, Utensils, Armchair, DoorOpen, Package, Sprout, Flame, Coffee, Archive, Umbrella, Dumbbell, Droplet, CloudRain, Zap, Recycle, Warehouse, Trees } from "lucide-react"

interface RequirementsScreenProps {
  language: "en" | "ml"
  bhk: number
  onBhkChange: (value: number) => void
  selectedFeatures: string[]
  onFeatureToggle: (feature: string) => void
  budgetRange: [number, number]
  onBudgetChange: (value: [number, number]) => void
  additionalNotes: string
  onNotesChange: (notes: string) => void
}

const featureCategories = [
  {
    title: "Traditional & Cultural",
    titleMl: "പരമ്പരാഗത & സാംസ്കാരികം",
    items: [
      { id: "padippura", title: "Padippura", titleMl: "പടിപ്പുര", icon: DoorOpen },
      { id: "aatukattil", title: "Aatu Kattil", titleMl: "ആട്ടുകട്ടിൽ", icon: Armchair },
      { id: "charupady", title: "Charupady", titleMl: "ചാരുപടി", icon: Armchair },
      { id: "pathayappura", title: "Pathayappura", titleMl: "പത്തായപ്പുര", icon: Warehouse },
      { id: "sarpakavu", title: "Sacred Grove", titleMl: "സർപ്പക്കാവ്", icon: Trees },
      { id: "nadumuttam", title: "Nadumuttam", titleMl: "നടുമുറ്റം", icon: Home },
      { id: "pooja", title: "Pooja Room", titleMl: "പൂജാമുറി", icon: Flower2 },
    ]
  },
  {
    title: "Kitchen & Utility",
    titleMl: "അടുക്കള & യൂട്ടിലിറ്റി",
    items: [
      { id: "smokekitchen", title: "Smoke Kitchen", titleMl: "വിറക് അടുക്കള", icon: Flame },
      { id: "workarea", title: "Work Area", titleMl: "വർക്ക് ഏരിയ", icon: Utensils },
      { id: "pantry", title: "Pantry", titleMl: "പാൻട്രി", icon: Coffee },
      { id: "storeroom", title: "Store Room", titleMl: "സ്റ്റോർ റൂം", icon: Archive },
    ]
  },
  {
    title: "Modern Lifestyle",
    titleMl: "ആധുനിക ജീവിതശൈലി",
    items: [
      { id: "study", title: "Home Office", titleMl: "ഹോം ഓഫീസ്", icon: Laptop },
      { id: "theater", title: "Home Cinema", titleMl: "ഹോം സിനിമ", icon: Tv },
      { id: "prayer", title: "Prayer Hall", titleMl: "പ്രെയർ ഹാൾ", icon: BookOpen },
      { id: "outdoordeck", title: "Outdoor Deck", titleMl: "ഔട്ട്ഡോർ ഡെക്ക്", icon: Umbrella },
      { id: "gym", title: "Gym / Yoga", titleMl: "ജിം / യോഗ", icon: Dumbbell },
      { id: "carporch", title: "Car Porch", titleMl: "കാർ പോർച്ച്", icon: Car },
      { id: "attachedbath", title: "Attached Bath", titleMl: "അറ്റാച്ച്ഡ് ബാത്ത്", icon: Bath },
      { id: "balcony", title: "Balcony", titleMl: "ബാൽക്കണി", icon: Armchair },
    ]
  },
  {
    title: "Technical & Utility",
    titleMl: "സാങ്കേതിക & യൂട്ടിലിറ്റി",
    items: [
      { id: "well", title: "Well (Kinar)", titleMl: "കിണർ", icon: Droplet },
      { id: "rainwater", title: "Rainwater Harvest", titleMl: "മഴവെള്ള സംഭരണി", icon: CloudRain },
      { id: "solar", title: "Solar Provisions", titleMl: "സോളാർ", icon: Zap },
      { id: "greywater", title: "Greywater Recycle", titleMl: "ജല പുനരുപയോഗം", icon: Recycle },
    ]
  }
]

function formatBudget(value: number): string {
  if (value >= 100) {
    return `${(value / 100).toFixed(1)}Cr`
  }
  return `${value}L`
}

export function RequirementsScreen({
  language,
  bhk,
  onBhkChange,
  selectedFeatures,
  onFeatureToggle,
  budgetRange,
  onBudgetChange,
  additionalNotes,
  onNotesChange,
}: RequirementsScreenProps) {
  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {language === "en" ? "Step 2 of 3" : "ഘട്ടം 2/3"}
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground">
            {language === "en" ? "Your Requirements" : "നിങ്ങളുടെ ആവശ്യങ്ങൾ"}
          </h2>
        </div>

        {/* BHK Stepper */}
        <div className="mb-10">
          <label className="text-sm font-medium text-foreground mb-4 block">
            {language === "en" ? "Number of Bedrooms (BHK)" : "കിടപ്പുമുറികളുടെ എണ്ണം (BHK)"}
          </label>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => onBhkChange(Math.max(1, bhk - 1))}
              className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
              disabled={bhk <= 1}
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center min-w-[80px]">
              <span className="font-serif text-5xl font-light text-foreground">{bhk}</span>
              <p className="text-xs text-muted-foreground mt-1">BHK</p>
            </div>
            <button
              onClick={() => onBhkChange(Math.min(8, bhk + 1))}
              className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
              disabled={bhk >= 8}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="mb-10">
          {featureCategories.map((category) => (
            <div key={category.title} className="mb-8 last:mb-0">
              <label className="text-sm font-medium text-foreground mb-4 block">
                {language === "en" ? category.title : category.titleMl}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {category.items.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id)
                  const Icon = feature.icon
                  return (
                    <button
                      key={feature.id}
                      onClick={() => onFeatureToggle(feature.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-4 px-2 border transition-all duration-200 min-h-[100px]",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("w-6 h-6 mb-2", isSelected ? "text-primary" : "text-current")} />
                      <span className="text-xs font-medium text-center leading-tight">
                        {language === "en" ? feature.title : feature.titleMl}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Budget Slider */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">
              {language === "en" ? "Budget Range" : "ബജറ്റ് ശ്രേണി"}
            </label>
            <span className="text-sm text-primary font-medium">
              {formatBudget(budgetRange[0])} - {formatBudget(budgetRange[1])}
            </span>
          </div>
          <div className="px-1">
            <Slider
              value={budgetRange}
              onValueChange={(value) => onBudgetChange(value as [number, number])}
              min={20}
              max={500}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>20L</span>
            <span>5Cr</span>
          </div>
        </div>

        {/* AI Notes Textbox */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {language === "en" ? "Specific Requirements" : "പ്രത്യേക ആവശ്യങ്ങൾ"}
            </p>
          </div>
          <textarea
            value={additionalNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={language === "en" 
              ? "Any specific requirements? (e.g., Vastu compliant, wheelchair access, specific materials...)"
              : "എന്തെങ്കിലും പ്രത്യേക ആവശ്യങ്ങൾ? (ഉദാ: വാസ്തു, വീൽചെയർ സൗകര്യം, പ്രത്യേക നിർമ്മാണ സാമഗ്രികൾ...)"
            }
            className="w-full h-28 px-4 py-3 text-sm bg-card border border-border rounded-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
