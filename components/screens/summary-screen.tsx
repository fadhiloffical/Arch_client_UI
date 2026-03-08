"use client"

import { Check, Shield, Bed, Home, Car, Flower2, Palette, IndianRupee, Bath, BookOpen, Laptop, Tv, Utensils, Armchair, DoorOpen, Package, Sprout, Flame, Coffee, Archive, Umbrella, Dumbbell, Droplet, CloudRain, Zap, Recycle, Warehouse, Trees } from "lucide-react"

interface SummaryScreenProps {
  language: "en" | "ml"
  styles: string[]
  bhk: number
  features: string[]
  budgetRange: [number, number]
  onSubmit: () => void
}

const styleLabels: Record<string, { en: string; ml: string }> = {
  traditional: { en: "Traditional Kerala", ml: "പരമ്പരാഗത കേരളം" },
  modern: { en: "Modern Minimalist", ml: "ആധുനിക മിനിമലിസ്റ്റ്" },
  fusion: { en: "Contemporary Fusion", ml: "സമകാലിക ഫ്യൂഷൻ" },
  tropical: { en: "Tropical Resort", ml: "ട്രോപ്പിക്കൽ റിസോർട്ട്" },
}

const featureLabels: Record<string, { en: string; ml: string; icon: typeof Home }> = {
  pooja: { en: "Pooja Room", ml: "പൂജാമുറി", icon: Flower2 },
  prayer: { en: "Prayer Hall", ml: "പ്രെയർ ഹാൾ", icon: BookOpen },
  nadumuttam: { en: "Nadumuttam", ml: "നടുമുറ്റം", icon: Home },
  carporch: { en: "Car Porch", ml: "കാർ പോർച്ച്", icon: Car },
  attachedbath: { en: "Attached Bath", ml: "അറ്റാച്ച്ഡ് ബാത്ത്", icon: Bath },
  study: { en: "Study Room", ml: "സ്റ്റഡി റൂം", icon: Laptop },
  theater: { en: "Home Theater", ml: "ഹോം തിയേറ്റർ", icon: Tv },
  workarea: { en: "Work Area", ml: "വർക്ക് ഏരിയ", icon: Utensils },
  balcony: { en: "Balcony", ml: "ബാൽക്കണി", icon: Armchair },
  padippura: { en: "Padippura", ml: "പടിപ്പുര", icon: DoorOpen },
  aatukattil: { en: "Aatu Kattil", ml: "ആട്ടുകട്ടിൽ", icon: Armchair },
  charupady: { en: "Charupady", ml: "ചാരുപടി", icon: Armchair },
  pathayappura: { en: "Pathayappura", ml: "പത്തായപ്പുര", icon: Warehouse },
  sarpakavu: { en: "Sacred Grove", ml: "സർപ്പക്കാവ്", icon: Trees },
  smokekitchen: { en: "Smoke Kitchen", ml: "വിറക് അടുക്കള", icon: Flame },
  pantry: { en: "Pantry", ml: "പാൻട്രി", icon: Coffee },
  storeroom: { en: "Store Room", ml: "സ്റ്റോർ റൂം", icon: Archive },
  outdoordeck: { en: "Outdoor Deck", ml: "ഔട്ട്ഡോർ ഡെക്ക്", icon: Umbrella },
  gym: { en: "Gym / Yoga", ml: "ജിം / യോഗ", icon: Dumbbell },
  well: { en: "Well", ml: "കിണർ", icon: Droplet },
  rainwater: { en: "Rainwater Harvest", ml: "മഴവെള്ള സംഭരണി", icon: CloudRain },
  solar: { en: "Solar Provisions", ml: "സോളാർ", icon: Zap },
  greywater: { en: "Greywater Recycle", ml: "ജല പുനരുപയോഗം", icon: Recycle },
}

function formatBudget(value: number): string {
  if (value >= 100) {
    return `${(value / 100).toFixed(1)} Cr`
  }
  return `${value} Lakhs`
}

export function SummaryScreen({
  language,
  styles,
  bhk,
  features,
  budgetRange,
  onSubmit,
}: SummaryScreenProps) {
  return (
    <div className="min-h-screen bg-background px-5 py-8 flex flex-col">
      <div className="max-w-md mx-auto flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {language === "en" ? "Step 3 of 3" : "ഘട്ടം 3/3"}
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground">
            {language === "en" ? "Project Passport" : "പ്രോജക്ട് പാസ്പോർട്ട്"}
          </h2>
        </div>

        {/* Summary Card */}
        <div className="border border-border bg-card p-6 relative">
          {/* AI Verified Badge */}
          <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            {language === "en" ? "AI Verified" : "AI പരിശോധിച്ചു"}
          </div>

          {/* Summary Items */}
          <div className="space-y-6 mt-4">
            {/* Style */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {language === "en" ? "Architecture Style" : "വാസ്തുവിദ്യാ ശൈലി"}
                </p>
                <p className="text-foreground font-medium">
                  {styles.length > 0
                    ? styles.map((s) => styleLabels[s]?.[language] || s).join(", ")
                    : "-"}
                </p>
              </div>
              <Check className="w-5 h-5 text-accent shrink-0" />
            </div>

            {/* BHK */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {language === "en" ? "Bedrooms" : "കിടപ്പുമുറികൾ"}
                </p>
                <p className="text-foreground font-medium">{bhk} BHK</p>
              </div>
              <Check className="w-5 h-5 text-accent shrink-0" />
            </div>

            {/* Features */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1.5">
                  {language === "en" ? "Special Features" : "പ്രത്യേക സവിശേഷതകൾ"}
                </p>
                {features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feat) => {
                      const label = featureLabels[feat]
                      return (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1"
                        >
                          {label?.[language] || feat}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-foreground font-medium text-sm">
                    {language === "en" ? "None selected" : "ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല"}
                  </p>
                )}
              </div>
              <Check className="w-5 h-5 text-accent shrink-0" />
            </div>

            {/* Budget */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {language === "en" ? "Budget Range" : "ബജറ്റ് ശ്രേണി"}
                </p>
                <p className="text-foreground font-medium">
                  {formatBudget(budgetRange[0])} – {formatBudget(budgetRange[1])}
                </p>
              </div>
              <Check className="w-5 h-5 text-accent shrink-0" />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-border my-6" />

          {/* Project ID */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {language === "en" ? "Project Reference" : "പ്രോജക്ട് റഫറൻസ്"}
            </p>
            <p className="font-mono text-sm text-foreground tracking-wider">
              KL-{new Date().getFullYear()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="max-w-md mx-auto w-full pt-6 pb-2">
        <button
          onClick={onSubmit}
          className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
        >
          {language === "en" ? "Send to Architect" : "ആർക്കിടെക്റ്റിന് അയയ്ക്കുക"}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          {language === "en"
            ? "You'll receive a response within 24 hours"
            : "24 മണിക്കൂറിനുള്ളിൽ നിങ്ങൾക്ക് മറുപടി ലഭിക്കും"}
        </p>
      </div>
    </div>
  )
}
