"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const styles = [
  {
    id: "traditional",
    title: "Traditional Kerala",
    titleMl: "പരമ്പരാഗത കേരളം",
    image: "/images/style-traditional.jpg",
    description: "Nalukettu & Ettukettu inspired",
  },
  {
    id: "modern",
    title: "Modern Minimalist",
    titleMl: "ആധുനിക മിനിമലിസ്റ്റ്",
    image: "/images/style-modern.jpg",
    description: "Clean lines & open spaces",
  },
  {
    id: "fusion",
    title: "Contemporary Fusion",
    titleMl: "സമകാലിക ഫ്യൂഷൻ",
    image: "/images/style-fusion.jpg",
    description: "Blend of tradition & modern",
  },
  {
    id: "tropical",
    title: "Tropical Resort",
    titleMl: "ട്രോപ്പിക്കൽ റിസോർട്ട്",
    image: "/images/style-tropical.jpg",
    description: "Open air living",
  },
]

interface StyleDiscoveryScreenProps {
  language: "en" | "ml"
  selectedStyles: string[]
  onStyleToggle: (styleId: string) => void
  additionalNotes: string
  onNotesChange: (notes: string) => void
}

export function StyleDiscoveryScreen({
  language,
  selectedStyles,
  onStyleToggle,
  additionalNotes,
  onNotesChange,
}: StyleDiscoveryScreenProps) {
  return (
    <div className="min-h-screen bg-background px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {language === "en" ? "Step 1 of 3" : "ഘട്ടം 1/3"}
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground">
            {language === "en" ? "Style Discovery" : "ശൈലി കണ്ടെത്തൽ"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {language === "en"
              ? "Choose the architectural style that speaks to you"
              : "നിങ്ങളോട് സംസാരിക്കുന്ന വാസ്തുവിദ്യാ ശൈലി തിരഞ്ഞെടുക്കുക"}
          </p>
        </div>

        {/* Style Grid */}
        <div className="grid grid-cols-2 gap-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleToggle(style.id)}
              role="checkbox"
              aria-checked={selectedStyles.includes(style.id)}
              className={cn(
                "relative aspect-[4/5] overflow-hidden border transition-all duration-300 group",
                selectedStyles.includes(style.id)
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              <Image
                src={style.image}
                alt={style.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Selected Indicator */}
              {selectedStyles.includes(style.id) && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-accent-foreground" />
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="font-serif text-lg font-medium text-white mb-0.5">
                  {language === "en" ? style.title : style.titleMl}
                </h3>
                <p className="text-white/70 text-xs">
                  {style.description}
                </p>
              </div>
            </button>
          ))}
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
              {language === "en" ? "For AI Understanding" : "AI മനസ്സിലാക്കാൻ"}
            </p>
          </div>
          <textarea
            value={additionalNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={language === "en" 
              ? "Tell us more about your dream home... (e.g., family size, special requirements, plot details, preferred location, any inspirations)"
              : "നിങ്ങളുടെ സ്വപ്ന ഭവനത്തെക്കുറിച്ച് കൂടുതൽ പറയൂ... (ഉദാ: കുടുംബ വലുപ്പം, പ്രത്യേക ആവശ്യങ്ങൾ, പ്ലോട്ട് വിശദാംശങ്ങൾ)"
            }
            className="w-full h-28 px-4 py-3 text-sm bg-card border border-border rounded-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
          />
          <p className="text-xs text-muted-foreground/70 mt-1.5">
            {language === "en" 
              ? "This helps our AI provide personalized recommendations"
              : "ഇത് ഞങ്ങളുടെ AI-യെ വ്യക്തിഗതമാക്കിയ ശുപാർശകൾ നൽകാൻ സഹായിക്കുന്നു"
            }
          </p>
        </div>
      </div>
    </div>
  )
}
