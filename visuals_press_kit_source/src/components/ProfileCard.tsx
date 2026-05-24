import React, { useState, useEffect } from "react";
import { ArtistProfile } from "../types";
import { Mail, Instagram, Bookmark, Laptop, Cpu, Layers, Plus, X, Globe, Upload, Image, Twitter } from "lucide-react";

interface ProfileCardProps {
  profile: ArtistProfile;
  onChange: (updated: ArtistProfile) => void;
  isEditMode: boolean;
  accentColor: string;
}

export default function ProfileCard({ profile, onChange, isEditMode, accentColor }: ProfileCardProps) {
  const [newSoftware, setNewSoftware] = useState("");
  const [newHardware, setNewHardware] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profile.avatarUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleTextChange("avatarUrl", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const getColorClass = (type: "border" | "text" | "bg" | "focus") => {
    switch (accentColor) {
      case "violet":
        if (type === "border") return "border-violet-500/40";
        if (type === "text") return "text-violet-400";
        if (type === "bg") return "bg-violet-500/10";
        return "focus:border-violet-500";
      case "emerald":
        if (type === "border") return "border-emerald-500/40";
        if (type === "text") return "text-emerald-400";
        if (type === "bg") return "bg-emerald-500/10";
        return "focus:border-emerald-500";
      case "amber":
        if (type === "border") return "border-amber-500/40";
        if (type === "text") return "text-amber-400";
        if (type === "bg") return "bg-amber-500/10";
        return "focus:border-amber-500";
      case "cyan":
      default:
        if (type === "border") return "border-cyan-500/40";
        if (type === "text") return "text-cyan-400";
        if (type === "bg") return "bg-cyan-500/10";
        return "focus:border-cyan-500";
    }
  };

  const handleTextChange = (key: keyof ArtistProfile, val: string) => {
    onChange({
      ...profile,
      [key]: val,
    });
  };

  const removeSoftware = (index: number) => {
    const updated = [...profile.software];
    updated.splice(index, 1);
    onChange({ ...profile, software: updated });
  };

  const addSoftware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoftware.trim()) return;
    onChange({
      ...profile,
      software: [...profile.software, newSoftware.trim()],
    });
    setNewSoftware("");
  };

  const removeHardware = (index: number) => {
    const updated = [...profile.hardware];
    updated.splice(index, 1);
    onChange({ ...profile, hardware: updated });
  };

  const addHardware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHardware.trim()) return;
    onChange({
      ...profile,
      hardware: [...profile.hardware, newHardware.trim()],
    });
    setNewHardware("");
  };

  // Assign distinct placeholder patterns per artist (e.g., checker vs dot-matrix)
  const isFirstArtist = profile.name.toLowerCase().includes("joaqu") || profile.role.toLowerCase().includes("programador");
  const patternClass = isFirstArtist ? "photo-placeholder-1" : "photo-placeholder-2";
  const indexLabelNum = isFirstArtist ? "01" : "02";

  const getCleanTwitterHandle = (val: string | undefined): string => {
    if (!val) return "twitter / x";
    let handle = val.trim();
    // Remove query params first
    handle = handle.split("?")[0];
    // Remove protocol and domains
    handle = handle.replace(/^(https?:\/\/)?(www\.)?(twitter|x)\.com\//i, "");
    // Remove any trailing or leading slashes
    handle = handle.replace(/^\/|\/$/g, "");
    if (!handle) return "twitter / x";
    return handle.startsWith("@") ? handle : `@${handle}`;
  };

  const getTwitterUrl = (val: string | undefined): string => {
    if (!val) return "#";
    const trimmed = val.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const cleanHandle = trimmed.replace("@", "");
    return `https://x.com/${cleanHandle}`;
  };

  return (
    <div className={`bg-[#131313] border border-[#2A2A2A] rounded-none p-6 md:p-8 hover:border-[#383838] transition-all flex flex-col md:flex-row gap-6 md:gap-14 xl:gap-20 relative ${isEditMode ? "ring-1 ring-zinc-700" : ""}`}>
      
      {/* Photo and Contact Info Column */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left gap-5 md:w-[240px] lg:w-[260px] md:shrink-0">
        <div className={`relative w-32 h-32 md:w-[220px] md:h-[220px] lg:w-[240px] lg:h-[240px] rounded-none overflow-hidden border border-[#2D2D2D] group shadow-inner ${patternClass}`}>
          {(!profile.avatarUrl || imageError) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-zinc-900/40">
              <Image className="w-8 h-8 text-zinc-600 mb-1" />
              <span className="font-mono text-[9px] uppercase text-zinc-500 font-medium">Sin Imagen</span>
              <span className="font-mono text-[8px] text-zinc-600 mt-1 truncate max-w-full">
                {profile.avatarUrl ? "Error de carga" : "Vacío"}
              </span>
            </div>
          ) : (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-105 transition-all duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
          
          {isEditMode && (
            <label className="absolute inset-0 bg-black/75 hover:bg-black/85 cursor-pointer flex flex-col items-center justify-center transition-all opacity-0 group-hover:opacity-100">
              <Upload className="w-5 h-5 text-zinc-300 mb-1" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Subir Imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {isEditMode && (
          <div className="w-full flex flex-col gap-1.5 px-0.5">
            <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-550">Imagen de Perfil:</span>
            
            <input
              id={`avatar-url-${profile.name.replace(/\s+/g,'')}`}
              type="text"
              value={profile.avatarUrl}
              onChange={(e) => handleTextChange("avatarUrl", e.target.value)}
              placeholder="Ruta o URL"
              className="w-full text-[10px] bg-zinc-950 border border-zinc-850 text-zinc-300 rounded-none px-2 py-1 outline-none font-mono focus:border-zinc-700"
              title="Cambiar URL de imagen de perfil o ruta local"
            />
            
            <label className="w-full flex items-center justify-center gap-1.5 bg-[#1C1C1E] hover:bg-[#2C2C2F] border border-zinc-800 text-zinc-300 py-1 px-2 text-[10px] uppercase font-mono cursor-pointer transition-all mt-0.5">
              <Upload className="w-3 h-3 text-zinc-400" />
              <span>Cargar de PC</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="mt-1">
              <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-600 block mb-1">Archivos locales:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  id={`preset-foto-j-${profile.name.replace(/\s+/g,'')}`}
                  type="button"
                  onClick={() => handleTextChange("avatarUrl", "/assets/images/foto de perfil j.jpg")}
                  className="text-[8px] font-mono py-0.5 px-1.5 bg-[#161618] hover:bg-[#2E2E32] border border-zinc-800 text-zinc-400 hover:text-white rounded-none cursor-pointer truncate max-w-full"
                  title="/assets/images/foto de perfil j.jpg"
                >
                  [foto_j]
                </button>
                <button
                  id={`preset-foto-down-${profile.name.replace(/\s+/g,'')}`}
                  type="button"
                  onClick={() => handleTextChange("avatarUrl", "/assets/images/imagen perfil down.jpg")}
                  className="text-[8px] font-mono py-0.5 px-1.5 bg-[#161618] hover:bg-[#2E2E32] border border-zinc-800 text-zinc-400 hover:text-white rounded-none cursor-pointer truncate max-w-full"
                  title="/assets/images/imagen perfil down.jpg"
                >
                  [foto_down]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Links */}
        <div className="w-full flex flex-col gap-2 pt-2 border-t border-[#262626]">
          <div className="font-mono text-[9px] text-[#555] uppercase tracking-wider mb-0.5">contact</div>
          {isEditMode ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-[#0C0C0C] px-2.5 py-1 rounded-none border border-zinc-800">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  id={`edit-email-${profile.name.replace(/\s+/g,'')}`}
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleTextChange("email", e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 outline-none w-full font-mono"
                  placeholder="Email"
                />
              </div>
              <div className="flex items-center gap-2 bg-[#0C0C0C] px-2.5 py-1 rounded-none border border-zinc-800">
                <Instagram className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  id={`edit-ig-${profile.name.replace(/\s+/g,'')}`}
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => handleTextChange("instagram", e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 outline-none w-full font-mono"
                  placeholder="@instagram"
                />
              </div>
              <div className="flex items-center gap-2 bg-[#0C0C0C] px-2.5 py-1 rounded-none border border-zinc-800">
                <Twitter className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  id={`edit-twitter-${profile.name.replace(/\s+/g,'')}`}
                  type="text"
                  value={profile.twitter || ""}
                  onChange={(e) => handleTextChange("twitter", e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 outline-none w-full font-mono"
                  placeholder="@twitter/X"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors bg-[#0D0D0E] hover:bg-zinc-900 py-1 px-2 border border-[#242426]"
              >
                <Mail className="w-3.2 h-3.2 text-zinc-500" />
                <span className="truncate text-[11px]">{profile.email}</span>
              </a>
              <a
                href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors bg-[#0D0D0E] hover:bg-zinc-900 py-1 px-2 border border-[#242426]"
              >
                <Instagram className="w-3.2 h-3.2 text-zinc-500" />
                <span className="text-[11px]">{profile.instagram}</span>
              </a>
              <a
                href={getTwitterUrl(profile.twitter)}
                target={profile.twitter ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors bg-[#0D0D0E] hover:bg-zinc-900 py-1 px-2 border border-[#242426]"
              >
                <Twitter className="w-3.2 h-3.2 text-zinc-500" />
                <span className="truncate text-[11px]">
                  {getCleanTwitterHandle(profile.twitter)}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Profile Descriptions and Tech Setup Column */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Bio Header */}
        <div className="flex flex-col gap-1">
          {isEditMode ? (
            <div className="flex flex-col gap-2">
              <input
                id={`edit-name-${profile.name.replace(/\s+/g,'')}`}
                type="text"
                value={profile.name}
                onChange={(e) => handleTextChange("name", e.target.value)}
                className="text-2xl font-display font-medium text-white border-b border-zinc-850 bg-zinc-950 p-1 rounded-none outline-none"
                placeholder="Nombre del Artista"
              />
              <input
                id={`edit-role-${profile.name.replace(/\s+/g,'')}`}
                type="text"
                value={profile.role}
                onChange={(e) => handleTextChange("role", e.target.value)}
                className={`text-xs font-mono p-1 rounded-none bg-zinc-950/20 outline-none border border-zinc-850 ${getColorClass("text")}`}
                placeholder="Rol Creativo"
              />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight leading-none">
                {profile.name.toUpperCase()}
              </h2>
              
              {/* Geometric mini accent-line element */}
              <div className="geometric-line my-1.5" style={{ backgroundColor: getAccentColorHex() }} />

              <div className="flex items-center gap-2">
                <p className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${getColorClass("text")}`}>
                  {profile.role}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Biography text */}
        <div className="text-sm text-zinc-300 font-sans leading-relaxed">
          {isEditMode ? (
            <textarea
              id={`edit-bio-${profile.name.replace(/\s+/g,'')}`}
              value={profile.bio}
              onChange={(e) => handleTextChange("bio", e.target.value)}
              rows={4}
              className="w-full text-xs text-zinc-300 font-sans bg-zinc-950 border border-zinc-800 p-2 rounded-none outline-none h-28 focus:border-zinc-700 font-normal leading-relaxed"
              placeholder="Escribe una biografía concisa pero potente..."
            />
          ) : (
            <p className="whitespace-pre-line text-zinc-400 text-[13px] font-normal">{profile.bio}</p>
          )}
        </div>

        {/* Live Tech Stack Details */}
        <div className="pt-4 border-t border-[#252528]">
          
          {/* Software stack taglist */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-zinc-350 font-mono text-[10px] uppercase tracking-widest font-semibold">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              {isEditMode ? (
                <input
                  id={`edit-software-title-${profile.name.replace(/\s+/g,'')}`}
                  type="text"
                  value={profile.softwareTitle ?? "Entorno de Trabajo"}
                  onChange={(e) => handleTextChange("softwareTitle", e.target.value)}
                  className="text-[10px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded-none outline-none focus:border-zinc-700 uppercase tracking-widest font-semibold w-56"
                  placeholder="Workspace Environment"
                />
              ) : (
                <span>{profile.softwareTitle ?? "Entorno de Trabajo"}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.software.map((sw, index) => (
                <span
                  key={index}
                  className={`text-[10px] font-mono py-0.5 px-2.5 rounded-none border flex items-center gap-1 ${
                    isEditMode 
                      ? "bg-zinc-900 border-zinc-750 text-zinc-300 hover:border-red-500/50 hover:bg-red-950/15" 
                      : `${getColorClass("bg")} ${getColorClass("border")} ${getColorClass("text")}`
                  }`}
                >
                  <span>{sw}</span>
                  {isEditMode && (
                    <button
                      id={`del-soft-${profile.name.replace(/\s+/g,'')}-${index}`}
                      type="button"
                      onClick={() => removeSoftware(index)}
                      className="text-zinc-600 hover:text-red-400 cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {profile.software.length === 0 && (
                <span className="text-[10px] text-zinc-600 italic font-mono">Sin software cargado</span>
              )}
            </div>

            {isEditMode && (
              <form onSubmit={addSoftware} className="flex gap-1.5 mt-1">
                <input
                  id={`new-soft-input-${profile.name.replace(/\s+/g,'')}`}
                  type="text"
                  value={newSoftware}
                  onChange={(e) => setNewSoftware(e.target.value)}
                  placeholder="Añadir software..."
                  className="flex-1 text-[11px] font-mono bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-none text-zinc-300 outline-none"
                />
                <button
                  id={`add-soft-btn-${profile.name.replace(/\s+/g,'')}`}
                  type="submit"
                  className="p-1 rounded-none bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
