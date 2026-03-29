"use client"

import { useState, useEffect } from "react"
import { Check, Shield, Bed, Home, Palette, IndianRupee, FileText, Download, Sprout, Ruler, Layers, Map } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { generateArchitectSummary } from "./chat"
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf"

export type SelectedFeature = {
  id: string;
  title: string;
  titleMl: string;
  icon: string;
};

interface SummaryScreenProps {
  language: "en" | "ml"
  styles: string[]
  houseType: "single" | "double"
  bhk: number
  features: SelectedFeature[]
  budgetRange: [number, number]
  sqftRange: [number, number]
  notes: string
  onSubmit: () => void
}

type PlanRoom = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type JsonPlan = {
  viewBox: { width: number; height: number };
  rooms?: PlanRoom[];
  groundFloor?: PlanRoom[];
  firstFloor?: PlanRoom[];
};

const styleLabels: Record<string, { en: string; ml: string }> = {
  traditional: { en: "Traditional Kerala", ml: "പരമ്പരാഗത കേരളം" },
  modern: { en: "Modern Minimalist", ml: "ആധുനിക മിനിമലിസ്റ്റ്" },
  fusion: { en: "Contemporary Fusion", ml: "സമകാലിക ഫ്യൂഷൻ" },
  tropical: { en: "Tropical Resort", ml: "ട്രോപ്പിക്കൽ റിസോർട്ട്" },
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
  houseType,
  bhk,
  features,
  budgetRange,
  sqftRange,
  notes,
  onSubmit,
}: SummaryScreenProps) {
  const [architectBrief, setArchitectBrief] = useState<string>("")
  const [isLoadingBrief, setIsLoadingBrief] = useState(true)
  const [jsonPlan, setJsonPlan] = useState<JsonPlan | null>(null)
  const [projectRef] = useState(`KL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)

  useEffect(() => {
    async function fetchBrief() {
      setIsLoadingBrief(true)
      const featureTitles = features.map(f => f.title)
      const res = await generateArchitectSummary({ styles, houseType, bhk, sqftRange, features: featureTitles, budgetRange, notes }, language)
      if (res.brief) {
        setArchitectBrief(res.brief);
        setJsonPlan(res.jsonPlan || null);
      } else {
        const errorMsg = language === "en" ? "Failed to generate brief." : "സംഗ്രഹം സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല.";
        setArchitectBrief(errorMsg);
      }
      setIsLoadingBrief(false)
    }
    fetchBrief()
  }, [styles, houseType, bhk, sqftRange, features, budgetRange, notes, language])

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add a Formal Document Header
    doc.setFontSize(18);
    doc.text("Senior Architect Requirement Analysis", 15, 20);
    
    doc.setFontSize(11);
    doc.text(`Project Reference: ${projectRef}`, 15, 30);
    doc.text(`Architecture Style: ${styles.length > 0 ? styles.map((s) => styleLabels[s]?.["en"] || s).join(", ") : "Not specified"}`, 15, 37);
    doc.text(`Property Type: ${houseType === "single" ? "Single Story" : "Double Story"}`, 15, 44);
    doc.text(`Bedrooms: ${bhk} BHK`, 15, 51);
    doc.text(`Area: ${sqftRange[0]} - ${sqftRange[1] >= 10000 ? "10,000+" : sqftRange[1]} Sq.Ft`, 15, 58);
    doc.text(`Budget Range: ${formatBudget(budgetRange[0])} - ${formatBudget(budgetRange[1])}`, 15, 65);
    
    doc.text("Selected Features:", 15, 75);
    const featureTexts = features.length > 0 ? features.map(f => f.title).join(", ") : "None";
    const splitFeatures = doc.splitTextToSize(featureTexts, 180);
    doc.text(splitFeatures, 15, 82);

    const dividerY = 82 + (splitFeatures.length * 5);
    doc.line(15, dividerY, 195, dividerY); // Divider line
    
    let nextY = dividerY + 10;
    const pageHeight = 297; // Standard A4 portrait height in mm
    const margin = 20;
    const lineHeight = 5.5; // Safe, fixed line height to ensure proper pagination

    // Append the AI generated brief text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const cleanBrief = architectBrief.replace(/\r\n/g, '\n');
    const splitText = doc.splitTextToSize(cleanBrief, 180);

    for (const line of splitText) {
      if (nextY + lineHeight > pageHeight - margin) {
        doc.addPage();
        nextY = margin;
      }
      doc.text(line, 15, nextY);
      nextY += lineHeight;
    }

    doc.save(`Requirement_Analysis_${projectRef}.pdf`);
  }

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

            {/* House Type */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {language === "en" ? "Property Type" : "കെട്ടിടത്തിന്റെ തരം"}
                </p>
                <p className="text-foreground font-medium">
                  {houseType === "single" 
                    ? (language === "en" ? "Single Story" : "സിംഗിൾ സ്റ്റോറി")
                    : (language === "en" ? "Double Story" : "ഡബിൾ സ്റ്റോറി")}
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

            {/* Area SqFt */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border rounded-full flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {language === "en" ? "Area (Sq.Ft)" : "വിസ്തീർണ്ണം (Sq.Ft)"}
                </p>
                <p className="text-foreground font-medium">
                  {sqftRange[0]} - {sqftRange[1] >= 10000 ? "10,000+" : sqftRange[1]}
                </p>
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
                      const Icon = (LucideIcons as any)[feat.icon] || Sprout
                      return (
                        <span
                          key={feat.id}
                          className="inline-flex items-center gap-1.5 text-xs bg-secondary text-secondary-foreground px-2.5 py-1.5 rounded-sm"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {language === "en" ? feat.title : feat.titleMl}
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
              {projectRef}
            </p>
          </div>
        </div>

        {/* AI Architectural Brief Section */}
        <div className="border border-border bg-card p-6 mt-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {language === "en" ? "Architectural Brief" : "ആർക്കിടെക്ചറൽ ബ്രീഫ്"}
            </h3>
            {!isLoadingBrief && architectBrief && (
              <div className="flex items-center gap-4">
                <button onClick={handleDownload} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  {language === "en" ? "Brief (.pdf)" : "ബ്രീഫ് (.pdf)"}
                </button>
              </div>
            )}
          </div>
          {isLoadingBrief ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-[75%]" />
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {architectBrief}
              </div>
            </>
          )}
        </div>

        {/* AI 2D Plan Section */}
        {jsonPlan && !isLoadingBrief && (
          <div className="border border-border bg-card p-6 mt-6 relative">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-primary" />
              {language === "en" ? "Conceptual 2D Plan" : "കൺസെപ്ച്വൽ 2D പ്ലാൻ"}
            </h3>
            <div 
              className="relative w-full bg-muted rounded-md aspect-video overflow-hidden"
              style={{
                aspectRatio: `${jsonPlan.viewBox.width} / ${jsonPlan.viewBox.height}`
              }}
            >
              {(jsonPlan.rooms || jsonPlan.groundFloor)?.map((room) => (
                <div
                  key={room.id}
                  className="absolute border border-primary/50 bg-primary/5 flex items-center justify-center text-center p-1"
                  style={{
                    left: `${(room.x / jsonPlan.viewBox.width) * 100}%`,
                    top: `${(room.y / jsonPlan.viewBox.height) * 100}%`,
                    width: `${(room.width / jsonPlan.viewBox.width) * 100}%`,
                    height: `${(room.height / jsonPlan.viewBox.height) * 100}%`,
                  }}
                >
                  <span className="text-[8px] md:text-[10px] text-primary/80 font-medium leading-tight">{room.name}</span>
                </div>
              ))}
              {jsonPlan.firstFloor?.map((room) => (
                 <div
                  key={room.id}
                  className="absolute border border-accent/50 bg-accent/5 flex items-center justify-center text-center p-1"
                  style={{
                    left: `${(room.x / jsonPlan.viewBox.width) * 100}%`,
                    top: `${(room.y / jsonPlan.viewBox.height) * 100}%`,
                    width: `${(room.width / jsonPlan.viewBox.width) * 100}%`,
                    height: `${(room.height / jsonPlan.viewBox.height) * 100}%`,
                  }}
                >
                  <span className="text-[8px] md:text-[10px] text-accent-foreground/80 font-medium leading-tight">{room.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
