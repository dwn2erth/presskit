import React, { useState } from "react";
import { RiderRequirements } from "../types";
import { ShieldAlert, Trash, Plus, HelpCircle, Laptop, Radio, AlignLeft } from "lucide-react";

interface TechnicalRiderProps {
  rider: RiderRequirements;
  onChange: (updated: RiderRequirements) => void;
  isEditMode: boolean;
  accentColor: string;
}

export default function TechnicalRider({ rider, onChange, isEditMode, accentColor }: TechnicalRiderProps) {
  const [newGear, setNewGear] = useState("");
  const [newReq, setNewReq] = useState("");

  const getColorClass = (type: "border" | "text" | "bg") => {
    switch (accentColor) {
      case "violet":
        if (type === "border") return "border-violet-500/30";
        if (type === "text") return "text-violet-400";
        return "bg-violet-950/10";
      case "emerald":
        if (type === "border") return "border-emerald-500/30";
        if (type === "text") return "text-emerald-400";
        return "bg-emerald-950/10";
      case "amber":
        if (type === "border") return "border-amber-500/30";
        if (type === "text") return "text-amber-400";
        return "bg-amber-950/10";
      case "cyan":
      default:
        if (type === "border") return "border-cyan-500/30";
        if (type === "text") return "text-cyan-400";
        return "bg-cyan-950/10";
    }
  };

  const handleFieldChange = (key: keyof RiderRequirements, val: any) => {
    onChange({
      ...rider,
      [key]: val,
    });
  };

  // Own equipment helper functions
  const addOwnEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGear.trim()) return;
    const current = rider.ownEquipment || [];
    handleFieldChange("ownEquipment", [...current, newGear.trim()]);
    setNewGear("");
  };

  const removeOwnEquipment = (index: number) => {
    const current = rider.ownEquipment || [];
    const updated = [...current];
    updated.splice(index, 1);
    handleFieldChange("ownEquipment", updated);
  };

  const editOwnEquipment = (index: number, value: string) => {
    const current = rider.ownEquipment || [];
    const updated = [...current];
    updated[index] = value;
    handleFieldChange("ownEquipment", updated);
  };

  // Stage requirements helper functions
  const addStageRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.trim()) return;
    const current = rider.stageRequirements || [];
    handleFieldChange("stageRequirements", [...current, newReq.trim()]);
    setNewReq("");
  };

  const removeStageRequirement = (index: number) => {
    const current = rider.stageRequirements || [];
    const updated = [...current];
    updated.splice(index, 1);
    handleFieldChange("stageRequirements", updated);
  };

  const editStageRequirement = (index: number, value: string) => {
    const current = rider.stageRequirements || [];
    const updated = [...current];
    updated[index] = value;
    handleFieldChange("stageRequirements", updated);
  };

  const ownEquipmentList = rider.ownEquipment || [];
  const stageReqList = rider.stageRequirements || [];

  return (
    <div className={`font-mono ${isEditMode ? "border border-dashed border-zinc-800 p-6 bg-zinc-950/20" : ""}`}>
      
      {/* Rider Header */}
      <div className="flex flex-col mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2C2C2F] pb-3 mb-6 gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${getColorClass("text")}`} />
            {isEditMode ? (
              <input
                id="edit-rider-header-title"
                type="text"
                value={rider.sectionTitle ?? "TECHNICAL SHEETS AND RIDER"}
                onChange={(e) => handleFieldChange("sectionTitle", e.target.value)}
                className="text-base font-display font-medium text-white bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded-none outline-none focus:border-zinc-700 uppercase tracking-wider w-80"
              />
            ) : (
              <h3 className="text-base font-display font-medium text-white uppercase tracking-wider">
                {rider.sectionTitle ?? "TECHNICAL SHEETS AND RIDER"}
              </h3>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
        
        {/* Left Column: Own Equipment */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-200 uppercase tracking-wider font-semibold">
            <span className={`w-1.5 h-1.5 rounded-none ${isEditMode ? "bg-zinc-600" : getColorClass("text")}`} style={{ backgroundColor: isEditMode ? "#555" : undefined }} />
            <Laptop className="w-4 h-4 text-zinc-500" />
            {isEditMode ? (
              <input
                id="edit-rider-own-eq-title"
                type="text"
                value={rider.ownEquipmentTitle ?? "01. Own Equipment (Duo)"}
                onChange={(e) => handleFieldChange("ownEquipmentTitle", e.target.value)}
                className="text-xs text-zinc-200 font-sans font-semibold bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-none outline-none focus:border-cyan-500 uppercase tracking-wider w-64 block"
              />
            ) : (
              <span>{rider.ownEquipmentTitle ?? "01. Own Equipment (Duo)"}</span>
            )}
          </div>

          <div className="flex flex-col gap-2 pl-0">
            {ownEquipmentList.map((eq, index) => (
              <div key={index} className="flex gap-2 items-center text-xs text-zinc-400 py-1">
                <span className="w-1.5 h-1.5 opacity-0 shrink-0" />
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <span className={`text-[12px] font-semibold ${getColorClass("text")}`}>•</span>
                </div>
                {isEditMode ? (
                  <input
                    id={`edit-own-eq-${index}`}
                    type="text"
                    value={eq}
                    onChange={(e) => editOwnEquipment(index, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-zinc-350 outline-none border-b border-zinc-850 hover:border-zinc-700 focus:border-cyan-500 font-mono"
                  />
                ) : (
                  <span className="flex-1 text-zinc-300 font-mono">{eq}</span>
                )}
                {isEditMode && (
                  <button
                    id={`del-own-eq-${index}`}
                    type="button"
                    onClick={() => removeOwnEquipment(index)}
                    className="text-zinc-650 hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {ownEquipmentList.length === 0 && (
              <p className="text-xs text-zinc-600 italic">No equipment specified.</p>
            )}

            {isEditMode && (
              <form onSubmit={addOwnEquipment} className="flex gap-1.5 mt-1">
                <input
                  id="new-gear-input"
                  type="text"
                  value={newGear}
                  onChange={(e) => setNewGear(e.target.value)}
                  placeholder="Add equipment (e.g. Computer)..."
                  className="flex-1 text-[11px] font-mono bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-none text-zinc-300 outline-none"
                />
                <button
                  id="add-gear-btn"
                  type="submit"
                  className="p-1.5 rounded-none bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Stage / Venue Requirements */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-200 uppercase tracking-wider font-semibold">
            <span className={`w-1.5 h-1.5 rounded-none ${isEditMode ? "bg-zinc-600" : getColorClass("text")}`} style={{ backgroundColor: isEditMode ? "#555" : undefined }} />
            <Radio className="w-4 h-4 text-zinc-500" />
            {isEditMode ? (
              <input
                id="edit-rider-stage-req-title"
                type="text"
                value={rider.stageRequirementsTitle ?? "02. Stage / Venue Requirements"}
                onChange={(e) => handleFieldChange("stageRequirementsTitle", e.target.value)}
                className="text-xs text-zinc-200 font-sans font-semibold bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-none outline-none focus:border-cyan-500 uppercase tracking-wider w-64 block"
              />
            ) : (
              <span>{rider.stageRequirementsTitle ?? "02. Stage / Venue Requirements"}</span>
            )}
          </div>

          <div className="flex flex-col gap-2 pl-0">
            {stageReqList.map((req, index) => (
              <div key={index} className="flex gap-2 items-center text-xs text-zinc-400 py-1">
                <span className="w-1.5 h-1.5 opacity-0 shrink-0" />
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <span className={`text-[12px] font-semibold ${getColorClass("text")}`}>•</span>
                </div>
                {isEditMode ? (
                  <input
                    id={`edit-stage-req-${index}`}
                    type="text"
                    value={req}
                    onChange={(e) => editStageRequirement(index, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-zinc-350 outline-none border-b border-zinc-850 hover:border-zinc-700 focus:border-cyan-500 font-mono"
                  />
                ) : (
                  <span className="flex-1 text-zinc-300 font-mono">{req}</span>
                )}
                {isEditMode && (
                  <button
                    id={`del-stage-req-${index}`}
                    type="button"
                    onClick={() => removeStageRequirement(index)}
                    className="text-zinc-650 hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                    title="Remove requirement"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {stageReqList.length === 0 && (
              <p className="text-xs text-zinc-600 italic font-sans block">No requirements specified.</p>
            )}

            {isEditMode && (
              <form onSubmit={addStageRequirement} className="flex gap-1.5 mt-1">
                <input
                  id="new-req-input"
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="Add item (e.g. HDMI cable)..."
                  className="flex-1 text-[11px] font-mono bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-none text-zinc-300 outline-none"
                />
                <button
                  id="add-req-btn"
                  type="submit"
                  className="p-1.5 rounded-none bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Additional Notes Section */}
      <div className="mt-6 pt-5 border-t border-[#252528] flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-zinc-200 uppercase tracking-wider font-semibold">
          <AlignLeft className="w-4 h-4 text-zinc-500" />
          {isEditMode ? (
            <input
              id="edit-rider-additional-notes-title"
              type="text"
              value={rider.additionalNotesTitle ?? "Additional notes and venue guidelines"}
              onChange={(e) => handleFieldChange("additionalNotesTitle", e.target.value)}
              className="text-xs text-zinc-200 font-sans font-semibold bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-none outline-none focus:border-cyan-500 uppercase tracking-wider w-80 block"
            />
          ) : (
            <span>{rider.additionalNotesTitle ?? "Additional notes and venue guidelines"}</span>
          )}
        </div>
        {isEditMode ? (
          <textarea
            id="edit-rider-notes"
            value={rider.additionalNotes || ""}
            onChange={(e) => handleFieldChange("additionalNotes", e.target.value)}
            className="w-full text-xs text-zinc-300 font-mono bg-zinc-950 border border-zinc-800 p-3 rounded-none outline-none h-20 focus:border-cyan-500"
            placeholder="Specify additional desk coordinates, connectors, lighting, or power expectations here..."
          />
        ) : (
          <p className="text-xs text-zinc-400 pl-1 font-normal">
            {rider.additionalNotes || "No additional notes specified."}
          </p>
        )}
      </div>



    </div>
  );
}
