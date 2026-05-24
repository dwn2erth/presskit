import React, { useState, useEffect } from "react";
import { DEFAULT_PRESS_KIT_DATA } from "./data";
import { PressKitData, ArtistProfile, DuoConfig, RiderRequirements, GigLog } from "./types";
import InteractiveVisuals from "./components/InteractiveVisuals";
import ProfileCard from "./components/ProfileCard";
import TechnicalRider from "./components/TechnicalRider";
import JointWork from "./components/JointWork";
import {
  Sparkles,
  Layers,
  Laptop,
  Check,
  Copy,
  Printer,
  Undo2,
  FileText,
  Volume2,
  ChevronRight,
  Eye,
  Edit2,
  Lock,
  RefreshCw,
  Sliders,
  ExternalLink,
  Users
} from "lucide-react";

function cleanPaths(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === "string") {
    if (obj.startsWith("/src/assets/images/")) {
      return obj.replace("/src/assets/images/", "/assets/images/");
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanPaths);
  }
  if (typeof obj === "object") {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleaned[key] = cleanPaths(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

const isDev = typeof window !== "undefined" && (
  window.location.hostname.includes("-dev-") ||
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
);

export default function App() {
  const [data, setData] = useState<PressKitData>(() => {
    if (!isDev) {
      // In production/public version, always bypass localStorage caches entirely to avoid any stuck data!
      return cleanPaths(DEFAULT_PRESS_KIT_DATA);
    }

    // Force a cache reset whenever we update the server's official/public default data
    const DATA_VERSION = "2026-05-24-v10";
    const savedVersion = localStorage.getItem("visuals_press_kit_version_stamp");
    if (savedVersion !== DATA_VERSION) {
      localStorage.removeItem("visuals_press_kit_data_v3");
      localStorage.removeItem("visuals_press_kit_data_v2");
      localStorage.removeItem("visuals_press_kit_data_v1");
      localStorage.setItem("visuals_press_kit_version_stamp", DATA_VERSION);
      return cleanPaths(DEFAULT_PRESS_KIT_DATA);
    }

    const savedV3 = localStorage.getItem("visuals_press_kit_data_v3");
    if (savedV3) {
      try {
        const parsed = JSON.parse(savedV3);
        // If they have the old default template data, ignore and force load the clean updated defaults
        if (parsed.gigs && parsed.gigs.length <= 4 && parsed.gigs.some((g: any) => g.eventName === "Mutek Festival AR")) {
          // If the default changed on the server, we load the clean update automatically
          return cleanPaths(DEFAULT_PRESS_KIT_DATA);
        }
        if (parsed.rider && !parsed.rider.ownEquipment) {
          parsed.rider.ownEquipment = DEFAULT_PRESS_KIT_DATA.rider.ownEquipment;
          parsed.rider.stageRequirements = DEFAULT_PRESS_KIT_DATA.rider.stageRequirements;
          parsed.rider.additionalNotes = DEFAULT_PRESS_KIT_DATA.rider.additionalNotes;
        }
        if (parsed.artist1 && parsed.artist1.behance !== undefined && parsed.artist1.twitter === undefined) {
          parsed.artist1.twitter = parsed.artist1.behance;
        }
        if (parsed.artist2 && parsed.artist2.behance !== undefined && parsed.artist2.twitter === undefined) {
          parsed.artist2.twitter = parsed.artist2.behance;
        }
        return cleanPaths(parsed);
      } catch (e) {
        console.warn("Error parsing saved press kit data v3:", e);
      }
    }

    const savedV2 = localStorage.getItem("visuals_press_kit_data_v2");
    if (savedV2) {
      try {
        const parsed = JSON.parse(savedV2);
        parsed.rider = { ...DEFAULT_PRESS_KIT_DATA.rider };
        if (parsed.artist1 && parsed.artist1.behance !== undefined && parsed.artist1.twitter === undefined) {
          parsed.artist1.twitter = parsed.artist1.behance;
        }
        if (parsed.artist2 && parsed.artist2.behance !== undefined && parsed.artist2.twitter === undefined) {
          parsed.artist2.twitter = parsed.artist2.behance;
        }
        return cleanPaths(parsed);
      } catch (e) {
        console.warn("Error parsing saved press kit data v2:", e);
      }
    }
    
    // Smart fallback to v1 to restore the user's edits from yesterday
    const savedV1 = localStorage.getItem("visuals_press_kit_data_v1");
    if (savedV1) {
      try {
        const parsedV1 = JSON.parse(savedV1);
        parsedV1.rider = { ...DEFAULT_PRESS_KIT_DATA.rider };
        if (parsedV1.artist1 && parsedV1.artist1.behance !== undefined && parsedV1.artist1.twitter === undefined) {
          parsedV1.artist1.twitter = parsedV1.artist1.behance;
        }
        if (parsedV1.artist2 && parsedV1.artist2.behance !== undefined && parsedV1.artist2.twitter === undefined) {
          parsedV1.artist2.twitter = parsedV1.artist2.behance;
        }
        console.log("Automatically migrated data from v1:", parsedV1);
        return cleanPaths(parsedV1);
      } catch (e) {
        console.warn("Error parsing saved press kit data v1:", e);
      }
    }
    
    return cleanPaths(DEFAULT_PRESS_KIT_DATA);
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [accentColor, setAccentColor] = useState<"cyan" | "violet" | "emerald" | "amber">("cyan");
  const [copied, setCopied] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "joint" | "artists" | "rider">("all");

  // Enforce isEditMode to false if we are not in the development workspace
  useEffect(() => {
    if (!isDev) {
      setIsEditMode(false);
    }
  }, []);

  // Sync to local storage only in dev environment
  useEffect(() => {
    if (isDev) {
      localStorage.setItem("visuals_press_kit_data_v3", JSON.stringify(data));
    }
  }, [data]);

  // Color text/border style mapping based on selected theme
  const getAccentColorClass = (type: "text" | "border" | "bg" | "gradient" | "ring") => {
    switch (accentColor) {
      case "violet":
        if (type === "text") return "text-violet-400";
        if (type === "border") return "border-violet-500/20";
        if (type === "bg") return "bg-violet-500";
        if (type === "ring") return "ring-violet-500/30";
        return "from-violet-500/10 via-violet-950/5 to-zinc-950";
      case "emerald":
        if (type === "text") return "text-emerald-400";
        if (type === "border") return "border-emerald-500/20";
        if (type === "bg") return "bg-emerald-500";
        if (type === "ring") return "ring-emerald-500/30";
        return "from-emerald-500/10 via-emerald-950/5 to-zinc-950";
      case "amber":
        if (type === "text") return "text-amber-400";
        if (type === "border") return "border-amber-500/20";
        if (type === "bg") return "bg-amber-500";
        if (type === "ring") return "ring-amber-500/30";
        return "from-amber-500/10 via-amber-950/5 to-zinc-950";
      case "cyan":
      default:
        if (type === "text") return "text-cyan-400";
        if (type === "border") return "border-cyan-500/20";
        if (type === "bg") return "bg-cyan-500";
        if (type === "ring") return "ring-cyan-500/30";
        return "from-cyan-500/10 via-cyan-950/5 to-zinc-950";
    }
  };

  const handleArtist1Change = (updated: ArtistProfile) => {
    setData((prev) => ({ ...prev, artist1: updated }));
  };

  const handleArtist2Change = (updated: ArtistProfile) => {
    setData((prev) => ({ ...prev, artist2: updated }));
  };

  const handleDuoConfigChange = (updated: DuoConfig) => {
    setData((prev) => ({ ...prev, duoConfig: updated }));
  };

  const handleRiderChange = (updated: RiderRequirements) => {
    setData((prev) => ({ ...prev, rider: updated }));
  };

  const handleGigsChange = (updated: GigLog[]) => {
    setData((prev) => ({ ...prev, gigs: updated }));
  };

  // Resets full payload to DEFAULT_PRESS_KIT_DATA with confirmation
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all Press Kit information to standard defaults? Local edits will be lost.")) {
      setData(DEFAULT_PRESS_KIT_DATA);
      localStorage.removeItem("visuals_press_kit_data_v3");
      localStorage.removeItem("visuals_press_kit_data_v2");
    }
  };

  // Markdown copier
  const handleCopyToClipboard = () => {
    const md = `# Press Kit - ${data.artist1.name} & ${data.artist2.name}
*${data.duoConfig.subtitle}*

---

## Biographies and Artists Profiles

### 1. ${data.artist1.name} - ${data.artist1.role}
${data.artist1.bio}

* **Software:** ${data.artist1.software.join(", ") || "None"}
* **Hardware:** ${data.artist1.hardware.join(", ") || "None"}
* **Contact:** ${data.artist1.email} | Instagram: ${data.artist1.instagram} | Twitter/X: ${data.artist1.twitter || "Not specified"}

### 2. ${data.artist2.name} - ${data.artist2.role}
${data.artist2.bio}

* **Software:** ${data.artist2.software.join(", ") || "None"}
* **Hardware:** ${data.artist2.hardware.join(", ") || "None"}
* **Contact:** ${data.artist2.email} | Instagram: ${data.artist2.instagram} | Twitter/X: ${data.artist2.twitter || "Not specified"}

---

## Technical Rider

### Own Equipment:
${data.rider.ownEquipment.map((c) => `  - ${c}`).join("\n")}

### Stage / Venue Requirements:
${data.rider.stageRequirements.map((c) => `  - ${c}`).join("\n")}
${data.rider.additionalNotes ? `\n* **Additional Notes:** ${data.rider.additionalNotes}` : ""}

---

## Shows and Festivals History
${data.gigs
  .map(
    (g) => {
      const typeLabel = !g.artistId || g.artistId === "joint"
        ? "Duo"
        : g.artistId === "artist1"
          ? data.artist1.name
          : data.artist2.name;
      return `* **${g.eventName}** (${g.city}, ${g.year}) [${typeLabel}]: ${g.description}`;
    }
  )
  .join("\n")}

---
Press Kit generated interactively.
`;

    navigator.clipboard
      .writeText(md)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch((err) => console.error("Could not copy:", err));
  };

  const getAccentColorHex = () => {
    switch (accentColor) {
      case "violet": return "#8B5CF6";
      case "emerald": return "#10B981";
      case "amber": return "#F59E0B";
      case "cyan":
      default: return "#06B6D4";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen bg-[#0F0F0F] text-zinc-100 flex flex-col transition-colors selection:bg-zinc-800 selection:text-white overflow-x-hidden`}>
      
      {/* Decorative Top Accent Architectural Bar */}
      <div className="w-full h-1.5 transition-colors duration-300" style={{ backgroundColor: getAccentColorHex() }} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col gap-8 print:p-0 print:gap-4_">
        
        {/* UPPER TITLE HEADER AND GLOBAL ADJUSTERS */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C2C2E] pb-6 print:border-b-0 print:pb-0">
          
          <div className="flex flex-col gap-1 pt-2">
            {isEditMode ? (
              <div className="flex flex-col gap-2.5 bg-[#121213] border border-[#2D2D2F] p-3 max-w-xl w-full">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Dossier Tag</label>
                    <input
                      id="edit-header-tag"
                      type="text"
                      value={data.duoConfig.headerTag ?? "ARTIST DOSSIER // STAGE PERFORMANCE"}
                      onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, headerTag: e.target.value })}
                      className="text-[10px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-2 py-1 rounded-none outline-none focus:border-zinc-700 w-full uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-32 shrink-0">
                    <label className="text-[8px] font-mono uppercase text-[#777] tracking-wider">Version / ID</label>
                    <input
                      id="edit-header-version"
                      type="text"
                      value={data.duoConfig.headerVersion ?? "[STAGE_SYSTEM_v1]"}
                      onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, headerVersion: e.target.value })}
                      className="text-[10px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-2 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <label className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Artist 1 (Name)</label>
                    <input
                      id="edit-header-artist1-name"
                      type="text"
                      value={data.artist1.name}
                      onChange={(e) => handleArtist1Change({ ...data.artist1, name: e.target.value })}
                      className="text-sm font-sans font-bold text-white bg-zinc-950 border border-zinc-850 px-2 py-1 rounded-none outline-none focus:border-zinc-700 w-full uppercase"
                    />
                  </div>
                  <span className="text-zinc-650 font-light pt-4">&amp;</span>
                  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                    <label className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Artist 2 (Name)</label>
                    <input
                      id="edit-header-artist2-name"
                      type="text"
                      value={data.artist2.name}
                      onChange={(e) => handleArtist2Change({ ...data.artist2, name: e.target.value })}
                      className="text-sm font-sans font-bold text-white bg-zinc-950 border border-zinc-850 px-2 py-1 rounded-none outline-none focus:border-zinc-700 w-full uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Proposal Subtitle</label>
                  <input
                    id="edit-header-subtitle"
                    type="text"
                    value={data.duoConfig.subtitle}
                    onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, subtitle: e.target.value })}
                    className="text-xs font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-2 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                  />
                </div>

                <div className="border-t border-[#232325] pt-2 mt-2 flex flex-col gap-1.5">
                  <label className="text-[8px] font-mono uppercase text-[#777] tracking-wider font-bold">[TABS LABELS / NOMBRAR PESTAÑAS]</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] font-mono uppercase text-zinc-500 tracking-wider">Tab 1 (All)</label>
                      <input
                        id="edit-tab-all"
                        type="text"
                        value={data.duoConfig.tabAllTitle ?? "[ALL_VIEW]"}
                        onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, tabAllTitle: e.target.value })}
                        className="text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-1.5 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                        placeholder="[ALL_VIEW]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] font-mono uppercase text-zinc-500 tracking-wider">Tab 2 (Bios)</label>
                      <input
                        id="edit-tab-artists"
                        type="text"
                        value={data.duoConfig.tabArtistsTitle ?? "[01_ARTISTS_BIOS]"}
                        onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, tabArtistsTitle: e.target.value })}
                        className="text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-1.5 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                        placeholder="[01_ARTISTS_BIOS]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] font-mono uppercase text-zinc-550 tracking-wider">Tab 3 (Gigs)</label>
                      <input
                        id="edit-tab-gigs"
                        type="text"
                        value={data.duoConfig.tabGigsTitle ?? "[02_SHOWS_HISTORY]"}
                        onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, tabGigsTitle: e.target.value })}
                        className="text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-1.5 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                        placeholder="[02_SHOWS_HISTORY]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] font-mono uppercase text-zinc-550 tracking-wider">Tab 4 (Rider)</label>
                      <input
                        id="edit-tab-rider"
                        type="text"
                        value={data.duoConfig.tabRiderTitle ?? "[03_TECHNICAL_RIDER]"}
                        onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, tabRiderTitle: e.target.value })}
                        className="text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-1.5 py-1 rounded-none outline-none focus:border-zinc-700 w-full"
                        placeholder="[03_TECHNICAL_RIDER]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#999] bg-[#161616] border border-[#2D2D2F] px-2 py-0.5 rounded-none">
                    {data.duoConfig.headerTag ?? "ARTIST DOSSIER // STAGE PERFORMANCE"}
                  </span>
                  <span className={`h-2 w-2 rounded-none ${accentColor === "cyan" ? "bg-cyan-500" : accentColor === "violet" ? "bg-violet-500" : accentColor === "emerald" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                </div>

                <h1 className="text-4xl font-display font-black tracking-tight text-white flex flex-wrap items-baseline gap-2 leading-none uppercase">
                  {data.artist1.name} <span className="text-zinc-600 font-light">&amp;</span> {data.artist2.name}
                  <span className="text-xs font-mono font-normal text-[#666] tracking-normal normal-case">{data.duoConfig.headerVersion ?? "[STAGE_SYSTEM_v1]"}</span>
                </h1>
                <p className="text-xs font-mono font-light text-zinc-400 uppercase tracking-widest mt-1">
                  {data.duoConfig.subtitle}
                </p>
              </>
            )}
          </div>

          {/* Controller Interface Controls */}
          <div id="action-bar" className="flex flex-wrap items-center gap-3 font-mono print:hidden">
            
            {/* Color accent mixer buttons */}
            <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2B2B2D] px-2 py-1 rounded-none">
              <span className="text-[9px] text-[#777] uppercase mr-1">[ACCENT_MIX]:</span>
              <button
                id="color-cyan-btn"
                onClick={() => setAccentColor("cyan")}
                className={`w-3.5 h-3.5 rounded-none bg-cyan-500 transition-transform ${accentColor === "cyan" ? "scale-110 ring-1 ring-white/70" : "opacity-60 hover:opacity-100"}`}
                title="Cyan Color"
              />
              <button
                id="color-violet-btn"
                onClick={() => setAccentColor("violet")}
                className={`w-3.5 h-3.5 rounded-none bg-violet-500 transition-transform ${accentColor === "violet" ? "scale-110 ring-1 ring-white/70" : "opacity-60 hover:opacity-100"}`}
                title="Violet Color"
              />
              <button
                id="color-emerald-btn"
                onClick={() => setAccentColor("emerald")}
                className={`w-3.5 h-3.5 rounded-none bg-emerald-500 transition-transform ${accentColor === "emerald" ? "scale-110 ring-1 ring-white/70" : "opacity-60 hover:opacity-100"}`}
                title="Emerald Color"
              />
              <button
                id="color-amber-btn"
                onClick={() => setAccentColor("amber")}
                className={`w-3.5 h-3.5 rounded-none bg-amber-500 transition-transform ${accentColor === "amber" ? "scale-110 ring-1 ring-white/70" : "opacity-60 hover:opacity-100"}`}
                title="Amber Color"
              />
            </div>

            {/* Toggle viewing/edit mode node */}
            {isDev && (
              <>
                <button
                  id="mode-toggle-btn"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-xs cursor-pointer transition-all ${
                    isEditMode
                      ? "bg-zinc-100 hover:bg-white text-zinc-950 border-white font-medium"
                      : "bg-[#141414] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 border-[#2B2B2D]"
                  }`}
                  style={isEditMode ? { boxShadow: `0 0 8px ${getAccentColorClass("text")}` } : {}}
                >
                  {isEditMode ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Presentation Mode</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Mode</span>
                    </>
                  )}
                </button>

                {/* Actions: Copy and print */}
                <button
                  id="copy-kit-btn"
                  onClick={handleCopyToClipboard}
                  className="p-2 rounded-none bg-[#141414] border border-[#2B2B2D] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 cursor-pointer transition-colors flex items-center justify-center"
                  title="Copy full Press Kit text in Markdown format"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  id="print-kit-btn"
                  onClick={handlePrint}
                  className="p-2 rounded-none bg-[#141414] border border-[#2B2B2D] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 cursor-pointer transition-colors flex items-center justify-center"
                  title="Download PDF version / Save Sheet"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}

          </div>
        </header>

        {isEditMode && (
          <div className="bg-[#18181a] border border-dashed border-[#3A3A3D] rounded-none p-4 flex flex-col gap-3 text-xs font-mono print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2D2D30] pb-3">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="flex h-2 w-2 rounded-none bg-red-400 animate-pulse" />
                <span>[STATUS]: Modo de edición activo. Los cambios se guardan localmente.</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  id="export-config-btn"
                  onClick={() => {
                    const exportStr = JSON.stringify(data, null, 2);
                    navigator.clipboard.writeText(exportStr)
                      .then(() => {
                        setShowExportSuccess(true);
                        setTimeout(() => setShowExportSuccess(false), 9000);
                      })
                      .catch((err) => console.error("Could not copy:", err));
                  }}
                  className="px-2.5 py-1 text-cyan-400 hover:text-white hover:bg-cyan-950/20 border border-cyan-900/40 hover:border-cyan-700 rounded-none font-mono text-[10px] cursor-pointer flex items-center gap-1.5 transition-all uppercase"
                >
                  <FileText className="w-3 h-3" />
                  <span>Exportar para Publicar</span>
                </button>

                <button
                  id="reset-kit-btn"
                  onClick={handleResetData}
                  className="px-2.5 py-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/10 border border-[#252527] hover:border-red-900/30 rounded-none font-mono text-[10px] cursor-pointer flex items-center gap-1.5 transition-all uppercase"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Template</span>
                </button>
              </div>
            </div>

            {showExportSuccess ? (
              <div className="bg-[#0D1515] border border-[#143032] p-3 text-cyan-450 flex flex-col gap-1.5 select-all">
                <div className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡CONFIGURACIÓN COPIADA AL PORTAPAPELES!</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans tracking-normal leading-relaxed">
                  Para que la web pública se actualice para siempre para todos los visitantes, <strong>Pega el contenido que se acaba de copiar en este chat de conversación de IA Studio</strong>. Yo procesaré tu JSON e inmediatamente actualizaré el servidor.
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-500 font-sans tracking-normal leading-relaxed">
                ¿Quieres actualizar la web oficial? Haz clic en <strong>"Exportar para Publicar"</strong>, y luego pega el bloque copiado en este chat para guardarlo de manera permanente en el servidor.
              </p>
            )}
          </div>
        )}

        {/* SITE SECTIONS NAVTABS */}
        <div id="nav-tabs" className="border-b border-[#2C2C2F] flex items-center gap-1 sm:gap-2 font-mono scrollbar-none overflow-x-auto whitespace-nowrap print:hidden flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-2 text-xs border-b-2 font-semibold tracking-wider transition-all cursor-pointer rounded-none ${
              activeTab === "all"
                ? "text-white"
                : "text-zinc-550 hover:text-zinc-300 border-transparent"
            }`}
            style={activeTab === "all" ? { borderColor: getAccentColorHex() } : {}}
          >
            {data.duoConfig.tabAllTitle || "[ALL_VIEW]"}
          </button>

          <button
            onClick={() => setActiveTab("artists")}
            className={`px-3 py-2 text-xs border-b-2 font-semibold tracking-wider transition-all cursor-pointer rounded-none ${
              activeTab === "artists"
                ? "text-white"
                : "text-zinc-550 hover:text-zinc-300 border-transparent"
            }`}
            style={activeTab === "artists" ? { borderColor: getAccentColorHex() } : {}}
          >
            {data.duoConfig.tabArtistsTitle || "[01_ARTISTS_BIOS]"}
          </button>
          
          <button
            onClick={() => setActiveTab("joint")}
            className={`px-3 py-2 text-xs border-b-2 font-semibold tracking-wider transition-all cursor-pointer rounded-none ${
              activeTab === "joint"
                ? "text-white"
                : "text-zinc-550 hover:text-zinc-300 border-transparent"
            }`}
            style={activeTab === "joint" ? { borderColor: getAccentColorHex() } : {}}
          >
            {data.duoConfig.tabGigsTitle || "[02_SHOWS_HISTORY]"}
          </button>

          <button
            onClick={() => setActiveTab("rider")}
            className={`px-3 py-2 text-xs border-b-2 font-semibold tracking-wider transition-all cursor-pointer rounded-none ${
              activeTab === "rider"
                ? "text-white"
                : "text-zinc-550 hover:text-zinc-300 border-transparent"
            }`}
            style={activeTab === "rider" ? { borderColor: getAccentColorHex() } : {}}
          >
            {data.duoConfig.tabRiderTitle || "[03_TECHNICAL_RIDER]"}
          </button>
        </div>

        {/* 1. ARTISTS PROFILES (JOAQUÍN AND FRIEND SOFÍA RUIZ) */}
        {(activeTab === "all" || activeTab === "artists") && (
          <section id="artists-profiles-section" className="flex flex-col gap-4 print:my-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2C2C2F] pb-3 mt-2 mb-6 gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 transition-colors duration-300" style={{ color: getAccentColorHex() }} />
                {isEditMode ? (
                  <input
                    id="edit-section1-title"
                    type="text"
                    value={data.duoConfig.section1Title ?? "ARTISTS BIOGRAPHIES"}
                    onChange={(e) => handleDuoConfigChange({ ...data.duoConfig, section1Title: e.target.value })}
                    className="text-base font-display font-medium text-white bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded-none outline-none focus:border-zinc-700 uppercase tracking-wider w-80"
                  />
                ) : (
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wider">
                    {data.duoConfig.section1Title ?? "ARTISTS BIOGRAPHIES"}
                  </h3>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ProfileCard
                profile={data.artist1}
                onChange={handleArtist1Change}
                isEditMode={isEditMode}
                accentColor={accentColor}
              />
              <ProfileCard
                profile={data.artist2}
                onChange={handleArtist2Change}
                isEditMode={isEditMode}
                accentColor={accentColor}
              />
            </div>
          </section>
        )}

        {/* 2. OUR CREATIVE NARRATIVE / JOINT WORK & SHOWS HISTORY */}
        {(activeTab === "all" || activeTab === "joint") && (
          <section id="colective-details-section" className={`flex flex-col gap-4 print:my-4 ${activeTab === "all" ? "mt-10 md:mt-16 lg:mt-20" : ""}`}>
            <JointWork
              duoConfig={data.duoConfig}
              onChangeConfig={handleDuoConfigChange}
              gigs={data.gigs}
              onChangeGigs={handleGigsChange}
              isEditMode={isEditMode}
              accentColor={accentColor}
              artist1Name={data.artist1.name}
              artist2Name={data.artist2.name}
            />
          </section>
        )}

        {/* 3. TECHNICAL RIDER SHEETS */}
        {(activeTab === "all" || activeTab === "rider") && (
          <section id="rider-sheets-section" className={`flex flex-col gap-4 print:my-4 ${activeTab === "all" ? "mt-10 md:mt-16 lg:mt-20" : ""}`}>
            <TechnicalRider
              rider={data.rider}
              onChange={handleRiderChange}
              isEditMode={isEditMode}
              accentColor={accentColor}
            />
          </section>
        )}

        {/* STYLISH GRAPHICS TEAM DESIGN WORK FOOTER */}
        <footer className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-650 print:hidden text-zinc-500">
          <div className="flex items-center gap-2">
            <span>PRESS_KIT // DIGITAL ART DEVICE</span>
          </div>

          <div className="flex items-center gap-4">
            <span>SINCRO_OS {new Date().getFullYear()}</span>
            <div className="flex gap-2">
              <a
                href={data.artist1.instagram ? `https://instagram.com/${data.artist1.instagram.replace('@', '')}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title={`Instagram de ${data.artist1.name}`}
              >
                {data.artist1.name.split(" ")[0]}
              </a>
              <span>+</span>
              <a
                href={data.artist2.instagram ? `https://instagram.com/${data.artist2.instagram.replace('@', '')}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-350 transition-colors"
                title={`Instagram de ${data.artist2.name}`}
              >
                {data.artist2.name.split(" ")[0]}
              </a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
