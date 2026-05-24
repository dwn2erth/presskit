import React, { useState } from "react";
import { DuoConfig, GigLog } from "../types";
import { Calendar, MapPin, Trash, Plus, User, Play, Youtube, Image, ExternalLink } from "lucide-react";

interface JointWorkProps {
  duoConfig: DuoConfig;
  onChangeConfig: (updated: DuoConfig) => void;
  gigs: GigLog[];
  onChangeGigs: (updated: GigLog[]) => void;
  isEditMode: boolean;
  accentColor: string;
  artist1Name?: string;
  artist2Name?: string;
}

export default function JointWork({
  duoConfig,
  onChangeConfig,
  gigs,
  onChangeGigs,
  isEditMode,
  accentColor,
  artist1Name = "jotta.rs",
  artist2Name = "Sofía Ruiz",
}: JointWorkProps) {
  // Direct state for quick inserting in each column, supporting image and video URLs
  const [newGig1, setNewGig1] = useState({ name: "", city: "", year: "", desc: "", imageUrl: "", videoUrl: "" });
  const [newGig2, setNewGig2] = useState({ name: "", city: "", year: "", desc: "", imageUrl: "", videoUrl: "" });
  
  // Show/Hide forms states per column
  const [showAddForm1, setShowAddForm1] = useState(false);
  const [showAddForm2, setShowAddForm2] = useState(false);

  const getColorClass = (type: "border" | "text" | "bg") => {
    switch (accentColor) {
      case "violet":
        if (type === "border") return "border-violet-500/30";
        if (type === "text") return "text-violet-400";
        return "bg-violet-950/15";
      case "emerald":
        if (type === "border") return "border-emerald-500/30";
        if (type === "text") return "text-emerald-400";
        return "bg-emerald-950/15";
      case "amber":
        if (type === "border") return "border-amber-500/30";
        if (type === "text") return "text-amber-400";
        return "bg-amber-950/15";
      case "cyan":
      default:
        if (type === "border") return "border-cyan-500/30";
        if (type === "text") return "text-cyan-400";
        return "bg-cyan-950/15";
    }
  };

  const handleGigChange = (id: string, field: keyof GigLog, val: string) => {
    const updated = gigs.map((g) => {
      if (g.id === id) {
        return { ...g, [field]: val };
      }
      return g;
    });
    onChangeGigs(updated);
  };

  const deleteGig = (id: string) => {
    const updated = gigs.filter((g) => g.id !== id);
    onChangeGigs(updated);
  };

  const addGigForArtist = (artistId: "artist1" | "artist2", e: React.FormEvent) => {
    e.preventDefault();
    const data = artistId === "artist1" ? newGig1 : newGig2;
    if (!data.name.trim() || !data.city.trim() || !data.year.trim()) return;

    const newGig: GigLog = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 4),
      eventName: data.name.trim(),
      city: data.city.trim(),
      year: data.year.trim(),
      description: data.desc.trim() || "No detailed description of the show available.",
      artistId: artistId,
      imageUrl: data.imageUrl.trim() || "",
      videoUrl: data.videoUrl.trim() || "",
    };

    onChangeGigs([...gigs, newGig]);
    
    if (artistId === "artist1") {
      setNewGig1({ name: "", city: "", year: "", desc: "", imageUrl: "", videoUrl: "" });
      setShowAddForm1(false);
    } else {
      setNewGig2({ name: "", city: "", year: "", desc: "", imageUrl: "", videoUrl: "" });
      setShowAddForm2(false);
    }
  };

  const artist1Gigs = gigs.filter(g => g.artistId === "artist1" || g.artistId === "joint" || !g.artistId);
  const artist2Gigs = gigs.filter(g => g.artistId === "artist2");

  // Custom reusable renderer to keep code clean, beautiful and dry
  const renderGigCard = (gig: GigLog, isArtist1: boolean) => {
    const defaultImage = "/assets/images/visuals_hero_1779482442466.png";
    const coverUrl = gig.imageUrl && gig.imageUrl.trim() !== "" ? gig.imageUrl : defaultImage;
    const hasVideo = gig.videoUrl && gig.videoUrl.trim() !== "";

    const accentBorderClass = isArtist1 ? "hover:border-violet-500/30 font-mono" : "hover:border-emerald-500/30 font-mono";
    const badgeTextClass = isArtist1 ? "bg-violet-950/40 text-violet-400 border-violet-900/40" : "bg-emerald-950/40 text-emerald-400 border-emerald-900/40";

    return (
      <div
        key={gig.id}
        className={`bg-[#111112]/60 border border-[#232325] ${accentBorderClass} rounded-none p-3.5 flex flex-col justify-between gap-3 transition-all group/gig relative`}
      >
        <div className="flex flex-col gap-2.5">
          {/* Header Metadata matching screenshot exact layout preference */}
          <div className="flex flex-col gap-1 inline-block">
            <div className="flex items-start justify-between gap-2">
              {isEditMode ? (
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-[8px] uppercase text-zinc-500 font-bold">Show Title:</span>
                  <input
                    id={`edit-gig-name-${gig.id}`}
                    type="text"
                    value={gig.eventName}
                    onChange={(e) => handleGigChange(gig.id, "eventName", e.target.value)}
                    className="font-sans font-bold text-[11px] text-white bg-zinc-950 p-1 border border-zinc-900 rounded-none w-full outline-none focus:border-zinc-700"
                    placeholder="Event name"
                  />
                </div>
              ) : (
                <h4 className="font-sans font-bold uppercase text-white text-[11px] tracking-wider leading-snug line-clamp-1" title={gig.eventName}>
                  {gig.eventName}
                </h4>
              )}

              {!isEditMode && (
                <span className="text-zinc-500 flex items-center gap-1 text-[9px] uppercase tracking-wide shrink-0 font-mono mt-0.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-zinc-650" />
                  <span className="truncate max-w-[90px]">{gig.city.split(",")[0]}</span>
                </span>
              )}
            </div>

            {/* Year Badge and Location Input in Edit Mode */}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-[10px] font-bold font-mono tracking-wider leading-none ${isArtist1 ? "text-violet-400" : "text-emerald-400"} ${isEditMode ? "px-1.5 py-0.5 border border-zinc-800 bg-zinc-950 rounded-none text-zinc-300" : ""}`}>
                {isEditMode ? (
                  <input
                    id={`edit-gig-year-${gig.id}`}
                    type="text"
                    value={gig.year}
                    onChange={(e) => handleGigChange(gig.id, "year", e.target.value)}
                    className="bg-transparent text-[9px] font-semibold w-8 text-center outline-none text-white font-mono"
                    placeholder="Year"
                  />
                ) : (
                  gig.year
                )}
              </span>

              {isEditMode && (
                <span className="text-zinc-500 flex items-center gap-1 text-[9px] uppercase shrink-0 font-mono">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-zinc-650" />
                  <input
                    id={`edit-gig-city-${gig.id}`}
                    type="text"
                    value={gig.city}
                    onChange={(e) => handleGigChange(gig.id, "city", e.target.value)}
                    className="bg-transparent text-[9px] w-20 text-right outline-none border-b border-transparent focus:border-zinc-800"
                    placeholder="City"
                  />
                </span>
              )}
            </div>
          </div>

          {/* Portada / Cover Image & Video Link wrapping - CLICK TO REDIRECT YOUTUBE */}
          <div className="relative w-full aspect-video overflow-hidden border border-zinc-900 bg-zinc-950 group/cover">
            {hasVideo ? (
              <a
                href={gig.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative cursor-pointer"
                title={isArtist1 ? "Click to view live stream/recording on YouTube" : "Click to view project website"}
              >
                <img
                  src={coverUrl}
                  alt={gig.eventName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Pulse effect overlay and Play Button - ONLY for Artist 1 */}
                {isArtist1 ? (
                  <div className="absolute inset-0 bg-black/45 group-hover/cover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/cover:scale-110 border border-white/20">
                      <Play className="w-3 h-3 fill-current ml-0.5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 bg-zinc-900/90 text-white rounded-full flex items-center justify-center shadow-md border border-white/10">
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                  </div>
                )}
              </a>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={coverUrl}
                  alt={gig.eventName}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5 px-2">
                  <span className="text-[7px] text-zinc-500 tracking-wider uppercase flex items-center gap-1 font-mono">
                    <Image className="w-2.5 h-2.5 text-zinc-700 shrink-0" /> ARCHIVE
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description Text */}
          <div className="text-[13px] leading-relaxed font-sans">
            {isEditMode ? (
              <div className="flex flex-col gap-1">
                <span className="text-[8px] uppercase text-zinc-500 font-bold font-mono">Description / Set Notes:</span>
                <textarea
                  id={`edit-gig-desc-${gig.id}`}
                  value={gig.description}
                  onChange={(e) => handleGigChange(gig.id, "description", e.target.value)}
                  rows={2}
                  className="text-[13px] text-zinc-450 bg-zinc-950 p-1.5 border border-zinc-900 rounded-none w-full outline-none leading-relaxed font-sans focus:border-zinc-700 h-14"
                  placeholder="Show description"
                />
              </div>
            ) : (
              <p className="text-zinc-500 font-sans leading-normal line-clamp-2 text-justify">
                {gig.description}
              </p>
            )}
          </div>
        </div>

        {/* Edit fields for image and video URLs */}
        {isEditMode && (
          <div className="flex flex-col gap-1.5 p-1.5 bg-zinc-950/70 border border-zinc-900/80 mt-1 font-mono text-[8px] rounded-none">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 uppercase font-bold text-[7px]">Cover Image (URL / Local range):</span>
              <input
                type="text"
                value={gig.imageUrl || ""}
                onChange={(e) => handleGigChange(gig.id, "imageUrl", e.target.value)}
                className="bg-[#121213] text-zinc-350 p-1 border border-zinc-900 outline-none w-full text-[9px]"
                placeholder="Local path or URL"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 uppercase font-bold text-[7px]">YouTube Recording Link:</span>
              <input
                type="text"
                value={gig.videoUrl || ""}
                onChange={(e) => handleGigChange(gig.id, "videoUrl", e.target.value)}
                className="bg-[#121213] text-violet-350 p-1 border border-zinc-900 outline-none w-full text-[9px]"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        )}

        {/* Modify ownership / Delete section */}
        {isEditMode && (
          <div className="border-t border-[#1C1C1E] pt-1.5 mt-1 flex items-center justify-between">
            <span className="text-[7px] uppercase text-zinc-650 font-mono font-semibold">Move Column:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleGigChange(gig.id, "artistId", isArtist1 ? "artist2" : "artist1")}
                className="px-1.5 py-0.5 text-[7px] bg-[#1a1a1c] border border-zinc-800 text-zinc-400 hover:text-white transition-colors uppercase font-bold font-mono rounded-none cursor-pointer"
              >
                Move
              </button>
              <button
                id={`del-gig-btn-${gig.id}`}
                type="button"
                onClick={() => deleteGig(gig.id)}
                className="text-red-500 hover:text-red-400 p-0.5 transition-colors flex items-center justify-center cursor-pointer"
                title="Delete"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Historical Gigs / Event Timeline Log */}
      <div className="flex flex-col gap-5 mt-2">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2C2C2F] pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${getColorClass("text")}`} />
            {isEditMode ? (
              <input
                id="edit-section2-inner-title"
                type="text"
                value={duoConfig.section2InnerTitle ?? "SHOWS AND FESTIVALS HISTORY"}
                onChange={(e) => onChangeConfig({ ...duoConfig, section2InnerTitle: e.target.value })}
                className="text-base font-display font-medium text-white bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded-none outline-none focus:border-zinc-700 uppercase tracking-wider w-80"
              />
            ) : (
              <h3 className="text-base font-display font-medium text-white uppercase tracking-wider">
                {duoConfig.section2InnerTitle ?? "SHOWS AND FESTIVALS HISTORY"}
              </h3>
            )}
          </div>
          

        </div>

        {/* Full-width artist sections stacked vertically */}
        <div className="flex flex-col gap-6">
          
          {/* SECTION 1: artist1 (jotta.rs) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#111112] border border-zinc-800/60 p-3 mb-1">
              <div className="flex items-center gap-2 font-mono">
                <User className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="font-sans font-bold text-sm tracking-wide text-white uppercase">{artist1Name}</span>
                <span className="text-[10px] text-zinc-550">({artist1Gigs.length})</span>
              </div>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowAddForm1(!showAddForm1)}
                  className="text-[10px] uppercase font-mono px-2 py-1 border border-zinc-800 hover:border-violet-500/40 text-zinc-400 hover:text-white bg-zinc-950/40 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddForm1 ? "Close" : "Add"}</span>
                </button>
              )}
            </div>

            {/* Quick Add Form Artist 1 */}
            {isEditMode && showAddForm1 && (
              <form
                onSubmit={(e) => addGigForArtist("artist1", e)}
                className="p-4 border border-[#2D2D2F] bg-zinc-950/70 flex flex-col gap-3 font-mono text-xs rounded-none mb-2"
              >
                <div className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>REGISTER SHOW - {artist1Name.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Event</span>
                    <input
                      type="text"
                      value={newGig1.name}
                      onChange={(e) => setNewGig1({ ...newGig1, name: e.target.value })}
                      placeholder="e.g. Mutek AR"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">City</span>
                    <input
                      type="text"
                      value={newGig1.city}
                      onChange={(e) => setNewGig1({ ...newGig1, city: e.target.value })}
                      placeholder="e.g. BsAs, AR"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Year</span>
                    <input
                      type="text"
                      value={newGig1.year}
                      onChange={(e) => setNewGig1({ ...newGig1, year: e.target.value })}
                      placeholder="e.g. 2025"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Cover Route</span>
                    <input
                      type="text"
                      value={newGig1.imageUrl}
                      onChange={(e) => setNewGig1({ ...newGig1, imageUrl: e.target.value })}
                      placeholder="e.g. /assets/images/... or URL"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">YouTube Link</span>
                    <input
                      type="text"
                      value={newGig1.videoUrl}
                      onChange={(e) => setNewGig1({ ...newGig1, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/..."
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-305 outline-none focus:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase text-zinc-500">Description / Set Details</span>
                  <textarea
                    value={newGig1.desc}
                    onChange={(e) => setNewGig1({ ...newGig1, desc: e.target.value })}
                    placeholder="Details about the live-coded visuals or generative parameters..."
                    className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none h-12 font-sans resize-none focus:border-zinc-700"
                  />
                </div>

                <button
                  type="submit"
                  className="py-1 px-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold uppercase text-[10px] self-start transition-colors cursor-pointer rounded-none"
                >
                  Confirm Show
                </button>
              </form>
            )}

            {/* List for Artist 1 (Grid of smaller cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artist1Gigs.map((g) => renderGigCard(g, true))}

              {artist1Gigs.length === 0 && (
                <div className="col-span-full text-center py-6 border border-dashed border-[#242426] bg-zinc-950/10 rounded-none">
                  <p className="text-[11px] text-zinc-500 italic font-sans">No individual shows registered for {artist1Name}.</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: artist2 (Sofía Ruiz) */}
          <div className="flex flex-col gap-4 pt-10">
            <div className="flex items-center justify-between bg-[#111112] border border-zinc-800/60 p-3 mb-1">
              <div className="flex items-center gap-2 font-mono">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-sans font-bold text-sm tracking-wide text-white uppercase">{artist2Name}</span>
                <span className="text-[10px] text-zinc-550">({artist2Gigs.length})</span>
              </div>

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowAddForm2(!showAddForm2)}
                  className="text-[10px] uppercase font-mono px-2 py-1 border border-zinc-800 hover:border-emerald-500/40 text-zinc-400 hover:text-white bg-zinc-950/40 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddForm2 ? "Close" : "Add"}</span>
                </button>
              )}
            </div>

            {/* Quick Add Form Artist 2 */}
            {isEditMode && showAddForm2 && (
              <form
                onSubmit={(e) => addGigForArtist("artist2", e)}
                className="p-4 border border-[#2D2D2F] bg-zinc-950/70 flex flex-col gap-3 font-mono text-xs rounded-none mb-2"
              >
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>REGISTER SHOW - {artist2Name.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Event</span>
                    <input
                      type="text"
                      value={newGig2.name}
                      onChange={(e) => setNewGig2({ ...newGig2, name: e.target.value })}
                      placeholder="e.g. Sónar"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">City</span>
                    <input
                      type="text"
                      value={newGig2.city}
                      onChange={(e) => setNewGig2({ ...newGig2, city: e.target.value })}
                      placeholder="e.g. Barcelona, ES"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Year</span>
                    <input
                      type="text"
                      value={newGig2.year}
                      onChange={(e) => setNewGig2({ ...newGig2, year: e.target.value })}
                      placeholder="e.g. 2026"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">Cover Route</span>
                    <input
                      type="text"
                      value={newGig2.imageUrl}
                      onChange={(e) => setNewGig2({ ...newGig2, imageUrl: e.target.value })}
                      placeholder="e.g. /assets/images/... or URL"
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] uppercase text-zinc-500">YouTube Link</span>
                    <input
                      type="text"
                      value={newGig2.videoUrl}
                      onChange={(e) => setNewGig2({ ...newGig2, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/..."
                      className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-305 outline-none focus:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase text-zinc-500">Description / Set Details</span>
                  <textarea
                    value={newGig2.desc}
                    onChange={(e) => setNewGig2({ ...newGig2, desc: e.target.value })}
                    placeholder="Details about CRT processing, camera feedbacks, analog equipment..."
                    className="bg-zinc-900 border border-zinc-800 rounded-none px-2 py-1 text-[11px] text-zinc-300 outline-none h-12 font-sans resize-none focus:border-zinc-700"
                  />
                </div>

                <button
                  type="submit"
                  className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold uppercase text-[10px] self-start transition-colors cursor-pointer rounded-none"
                >
                  Confirm Show
                </button>
              </form>
            )}

            {/* List for Artist 2 (Grid of smaller cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artist2Gigs.map((g) => renderGigCard(g, false))}

              {artist2Gigs.length === 0 && (
                <div className="col-span-full text-center py-6 border border-dashed border-[#242426] bg-zinc-950/10 rounded-none">
                  <p className="text-[11px] text-zinc-500 italic font-sans">No individual shows registered for {artist2Name}.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
