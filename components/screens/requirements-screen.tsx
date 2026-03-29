"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Flower2, Zap, Sprout, Send } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getAIResponse, getAIFeatureSuggestions } from "./chat"
import { Skeleton } from "@/components/ui/skeleton"

export type SelectedFeature = {
  id: string;
  title: string;
  titleMl: string;
  icon: string;
};

interface RequirementsScreenProps {
  language: "en" | "ml"
  houseType: "single" | "double"
  onHouseTypeChange: (type: "single" | "double") => void
  bhk: number
  onBhkChange: (value: number) => void
  selectedFeatures: SelectedFeature[]
  onFeatureToggle: (feature: SelectedFeature) => void
  budgetRange: [number, number]
  onBudgetChange: (value: [number, number]) => void
  sqftRange: [number, number]
  onSqftChange: (value: [number, number]) => void
  additionalNotes: string
  onNotesChange: (notes: string) => void
  selectedStyles: string[]
  styleNotes: string
}

type FeatureItem = {
  id: string;
  title: string;
  titleMl: string;
  icon: React.ElementType;
  iconName: string;
};

type FeatureCategory = {
  title: string;
  titleMl: string;
  items: FeatureItem[];
};

function formatBudget(value: number): string {
  if (value >= 100) {
    return `${(value / 100).toFixed(1)}Cr`
  }
  return `${value}L`
}

export function RequirementsScreen({
  language,
  houseType,
  onHouseTypeChange,
  bhk,
  onBhkChange,
  selectedFeatures,
  onFeatureToggle,
  budgetRange,
  onBudgetChange,
  sqftRange,
  onSqftChange,
  additionalNotes,
  onNotesChange,
  selectedStyles,
  styleNotes,
}: RequirementsScreenProps) {
  const [chatFeature, setChatFeature] = React.useState<string | null>(null)
  const [chatInput, setChatInput] = React.useState("")
  const [chatMessages, setChatMessages] = React.useState<{ sender: 'ai' | 'user'; content: React.ReactNode; options?: string[] }[]>([])
  const [isTyping, setIsTyping] = React.useState(false)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)
  const [featureCategories, setFeatureCategories] = React.useState<FeatureCategory[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = React.useState(true);


  const activeFeatureObj = React.useMemo(() => {
    if (!chatFeature) return null
    for (const cat of featureCategories) {
      const found = cat.items.find(i => i.id === chatFeature)
      if (found) return found
    }
    return null
  }, [chatFeature, featureCategories])

  React.useEffect(() => {
    async function fetchFeatures() {
      setIsLoadingFeatures(true);
      const result = await getAIFeatureSuggestions(selectedStyles, styleNotes, language);

      if (result.suggestions) {
        const categoriesWithIcons = result.suggestions.map((category: any) => ({
          ...category,
          items: category.items.map((item: any) => ({
            ...item,
            icon: (LucideIcons as any)[item.icon] || Sprout,
            iconName: item.icon || "Sprout",
          })),
        }));
        setFeatureCategories(categoriesWithIcons);
      } else {
        console.error("Failed to load AI features:", result.error);
        setFeatureCategories([]);
      }
      setIsLoadingFeatures(false);
    }

    // fetchFeatures();
  }, [selectedStyles, language]);

  React.useEffect(() => {
    if (activeFeatureObj) {
      setChatMessages([]);
      setIsTyping(true);

      const fetchInitialGreeting = async () => {
        try {
          const promptMessage = language === "en" 
            ? `I want to add a ${activeFeatureObj.title} to my home. What are the best options or styles for this feature?` 
            : `ഞാൻ ${activeFeatureObj.titleMl} തിരഞ്ഞെടുത്തിട്ടുണ്ട്. ഇതിന്റെ പ്രധാന ഓപ്ഷനുകൾ എന്തൊക്കെയാണ്?`;
            
          const data = await getAIResponse(promptMessage, activeFeatureObj.title, language);
          
          if (data.reply) {
            setChatMessages([{ sender: 'ai', content: data.reply, options: data.options }]);
          } else if (data.error) {
            setChatMessages([{ sender: 'ai', content: `⚠️ Error: ${data.error}` }]);
          }
        } catch (error) {
          console.error('Chat error:', error);
        } finally {
          setIsTyping(false);
        }
      };

      fetchInitialGreeting();
    }
  }, [activeFeatureObj, language])

  React.useEffect(() => {
    if (chatContainerRef.current && !isTyping) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, isTyping])

  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true)
    try {
      const data = await getAIResponse(userMessage, activeFeatureObj?.title || "", language)
      
      if (data.reply) {
        setChatMessages(prev => [...prev, { sender: 'ai', content: data.reply, options: data.options }])
      } else if (data.error) {
        setChatMessages(prev => [...prev, { sender: 'ai', content: `⚠️ Error: ${data.error}` }])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleOptionClick = (option: string) => {
    if (!activeFeatureObj) return

    const userMessage = option
    const newNote = `[${activeFeatureObj.title}]: ${option}`
    onNotesChange(additionalNotes ? `${additionalNotes}\n${newNote}` : newNote)

    setChatMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], options: undefined };
      }
      return [...updated, { sender: 'user', content: userMessage }];
    })

    fetchAIResponse(userMessage)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !activeFeatureObj) return

    const userMessage = chatInput.trim()
    const newNote = `[${activeFeatureObj.title}]: ${userMessage}`
    onNotesChange(additionalNotes ? `${additionalNotes}\n${newNote}` : newNote)

    setChatMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], options: undefined };
      }
      return [...updated, { sender: 'user', content: userMessage }];
    })
    setChatInput("")

    fetchAIResponse(userMessage)
  }

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

        {/* House Type */}
        <div className="mb-10">
          <label className="text-sm font-medium text-foreground mb-4 block">
            {language === "en" ? "Property Type" : "കെട്ടിടത്തിന്റെ തരം"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onHouseTypeChange("single")}
              className={cn(
                "py-3 px-4 border rounded-md text-sm font-medium transition-colors",
                houseType === "single" 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {language === "en" ? "Single Story" : "സിംഗിൾ സ്റ്റോറി"}
            </button>
            <button
              onClick={() => onHouseTypeChange("double")}
              className={cn(
                "py-3 px-4 border rounded-md text-sm font-medium transition-colors",
                houseType === "double" 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {language === "en" ? "Double Story" : "ഡബിൾ സ്റ്റോറി"}
            </button>
          </div>
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
          {isLoadingFeatures ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-8">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-[100px] w-full rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            featureCategories.map((category) => (
              <div key={category.title} className="mb-8 last:mb-0">
                <label className="text-sm font-medium text-foreground mb-4 block">
                  {language === "en" ? category.title : category.titleMl}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {category.items.map((feature) => {
                    const isSelected = selectedFeatures.some(f => f.id === feature.id)
                    const Icon = feature.icon
                    return (
                      <button
                        key={feature.id}
                        onClick={() => {
                          onFeatureToggle({ id: feature.id, title: feature.title, titleMl: feature.titleMl, icon: feature.iconName })
                          if (!isSelected) {
                            setChatFeature(feature.id)
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center py-4 px-2 border transition-all duration-200 min-h-[100px] rounded-md",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("w-8 h-8 mb-3", isSelected ? "text-primary" : "text-current")} />
                        <span className="text-xs font-medium text-center leading-tight">
                          {language === "en" ? feature.title : feature.titleMl}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
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

        {/* Area Slider */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">
              {language === "en" ? "Area (Sq.Ft)" : "വിസ്തീർണ്ണം (Sq.Ft)"}
            </label>
            <span className="text-sm text-primary font-medium">
              {sqftRange[0]} - {sqftRange[1] >= 10000 ? "10,000+" : sqftRange[1]}
            </span>
          </div>
          <div className="px-1">
            <Slider
              value={sqftRange}
              onValueChange={(value) => onSqftChange(value as [number, number])}
              min={500}
              max={10000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>500</span>
            <span>10,000+</span>
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

        {/* Chat Dialog */}
        <Dialog open={!!chatFeature} onOpenChange={(open) => {
          if (!open) setChatFeature(null)
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                {language === "en" ? "AI Assistant" : "AI അസിസ്റ്റൻ്റ്"}
              </DialogTitle>
              <DialogDescription>
                {language === "en" 
                  ? `Let's discuss your requirements for the ${activeFeatureObj?.title}.`
                  : `${activeFeatureObj?.titleMl}-നെക്കുറിച്ചുള്ള നിങ്ങളുടെ ആവശ്യങ്ങൾ നമുക്ക് ചർച്ച ചെയ്യാം.`}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 mt-4">
              <div ref={chatContainerRef} className="flex flex-col gap-4 h-[300px] overflow-y-auto p-4 bg-muted/30 rounded-md border border-border">
                {chatMessages.map((message, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className={cn("flex w-full", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-primary/10 text-foreground rounded-tl-sm"
                      )}>
                        {message.content}
                      </div>
                    </div>
                    {message.options && message.options.length > 0 && index === chatMessages.length - 1 && !isTyping && (
                      <div className="flex flex-wrap gap-2 mt-1 ml-2">
                        {message.options.map((opt, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleOptionClick(opt)}
                            className="text-xs border border-primary/20 bg-background text-foreground px-3 py-1.5 rounded-full hover:bg-primary/10 hover:border-primary transition-colors text-left"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex w-full justify-start">
                    <div className="bg-primary/10 text-foreground px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] flex items-center gap-1.5 h-[44px]">
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={language === "en" ? "Type your requirements..." : "നിങ്ങളുടെ ആവശ്യങ്ങൾ ടൈപ്പ് ചെയ്യുക..."}
                  className="flex-1 h-10 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                />
                <button 
                  onClick={handleSendMessage}
                  className="h-10 px-4 bg-primary text-primary-foreground rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
