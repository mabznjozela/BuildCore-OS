import React, { useState, useEffect } from 'react';
import { KitchenSpecs, Job } from '../types';
import { Wrench, Shield, Check, Save, Layers, Flame, Table, Snowflake, Eye } from 'lucide-react';

interface SpecificationsSectionProps {
  job: Job;
  onUpdateSpecs: (updatedSpecs: KitchenSpecs) => void;
}

export default function SpecificationsSection({ job, onUpdateSpecs }: SpecificationsSectionProps) {
  const [specs, setSpecs] = useState<KitchenSpecs>({ ...job.specs });
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Sync state if job changes
  useEffect(() => {
    setSpecs({ ...job.specs });
    setIsSaved(false);
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSpecs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSpecs(specs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Warning check: Solid stone quartzite is normally 30mm or 20mm. Let's warn if empty or non-standard!
  const isNonStandardStone =
    specs.stoneThickness &&
    !['20mm', '30mm', '40mm', '12mm', '20', '30'].includes(specs.stoneThickness.trim().toLowerCase());

  return (
    <div id={`specs-section-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-2">
        <div>
          <h2 className="text-xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Wrench className="h-5 w-5 text-indigo-600" />
            Kitchen Specifications
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Everything David keeps in his head, now documented, queryable, and locked in the cloud.
          </p>
        </div>
        <button
          id={`save-specs-btn-${job.id}`}
          onClick={handleSubmit}
          className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all font-semibold shadow-sm cursor-pointer ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white active:scale-95'
          }`}
        >
          {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaved ? 'Specs Saved & Synced!' : 'Save & Lock Specs'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Cabinet Construction */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-indigo-500" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
              1. Cabinet Construction & Carcass
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Carcass / Board Type</label>
              <input
                id={`specs-board-type-${job.id}`}
                type="text"
                name="boardType"
                value={specs.boardType}
                onChange={handleChange}
                placeholder="e.g. Moisture-resistant MDF (18mm)"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Board Supplier</label>
              <input
                id={`specs-board-supplier-${job.id}`}
                type="text"
                name="boardSupplier"
                value={specs.boardSupplier}
                onChange={handleChange}
                placeholder="e.g. Egger UK, Kronospan"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Door Type / Profile</label>
              <input
                id={`specs-door-type-${job.id}`}
                type="text"
                name="doorType"
                value={specs.doorType}
                onChange={handleChange}
                placeholder="e.g. Handleless Shaker, J-Pull Matt Lacquer"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Door Supplier</label>
              <input
                id={`specs-door-supplier-${job.id}`}
                type="text"
                name="doorSupplier"
                value={specs.doorSupplier}
                onChange={handleChange}
                placeholder="e.g. In-house spray workshop, Stock Panel"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Hardware Features - Modern Switches */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
              2. Premium Hardware Fittings
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <label className={`flex flex-col justify-between p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
              specs.softClose
                ? 'border-emerald-500/40 bg-emerald-50/20 text-emerald-900 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}>
              <div className="flex justify-between items-center w-full mb-1">
                <span className="text-xs font-bold">Soft Close Hinges</span>
                <input
                  id={`specs-soft-close-${job.id}`}
                  type="checkbox"
                  name="softClose"
                  checked={specs.softClose}
                  onChange={handleChange}
                  className="h-4 w-4 accent-emerald-600 rounded"
                />
              </div>
              <span className="text-[10px] text-gray-400">Smooth drawer damper standard</span>
            </label>

            <label className={`flex flex-col justify-between p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
              specs.ledLighting
                ? 'border-indigo-500/40 bg-indigo-50/20 text-indigo-900 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}>
              <div className="flex justify-between items-center w-full mb-1">
                <span className="text-xs font-bold">Integrated LED</span>
                <input
                  id={`specs-led-lighting-${job.id}`}
                  type="checkbox"
                  name="ledLighting"
                  checked={specs.ledLighting}
                  onChange={handleChange}
                  className="h-4 w-4 accent-indigo-600 rounded"
                />
              </div>
              <span className="text-[10px] text-gray-400">Ambient under-cabinet strip</span>
            </label>

            <label className={`flex flex-col justify-between p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
              specs.pushToOpen
                ? 'border-indigo-500/40 bg-indigo-50/20 text-indigo-900 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}>
              <div className="flex justify-between items-center w-full mb-1">
                <span className="text-xs font-bold">Push-To-Open</span>
                <input
                  id={`specs-push-to-open-${job.id}`}
                  type="checkbox"
                  name="pushToOpen"
                  checked={specs.pushToOpen}
                  onChange={handleChange}
                  className="h-4 w-4 accent-indigo-600 rounded"
                />
              </div>
              <span className="text-[10px] text-gray-400">Handleless mechanical touch</span>
            </label>

            <label className={`flex flex-col justify-between p-3.5 border rounded-xl cursor-pointer select-none transition-all ${
              specs.glassDoors
                ? 'border-indigo-500/40 bg-indigo-50/20 text-indigo-900 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}>
              <div className="flex justify-between items-center w-full mb-1">
                <span className="text-xs font-bold">Glass display door</span>
                <input
                  id={`specs-glass-doors-${job.id}`}
                  type="checkbox"
                  name="glassDoors"
                  checked={specs.glassDoors}
                  onChange={handleChange}
                  className="h-4 w-4 accent-indigo-600 rounded"
                />
              </div>
              <span className="text-[10px] text-gray-400">Tinted/fluted accent frames</span>
            </label>
          </div>
        </div>

        {/* Row 3: Stone Specifications */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
              3. Worktops & Stone Elements
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stone Supplier</label>
              <input
                id={`specs-stone-supplier-${job.id}`}
                type="text"
                name="stoneSupplier"
                value={specs.stoneSupplier}
                onChange={handleChange}
                placeholder="e.g. Gerald Culnane"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stone Design Colour</label>
              <input
                id={`specs-stone-colour-${job.id}`}
                type="text"
                name="stoneColour"
                value={specs.stoneColour}
                onChange={handleChange}
                placeholder="e.g. Calacatta Classic Quartzite"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Thickness (Slab)</label>
              <input
                id={`specs-stone-thickness-${job.id}`}
                type="text"
                name="stoneThickness"
                value={specs.stoneThickness}
                onChange={handleChange}
                placeholder="e.g. 20mm or 30mm"
                className={`w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors text-gray-950 font-sans ${
                  isNonStandardStone ? 'border-amber-400 bg-amber-50/10' : 'border-gray-300'
                }`}
              />
              {isNonStandardStone && (
                <p className="text-[10px] text-amber-600 font-semibold mt-1">
                  ⚠️ Note: Custom/non-standard thickness requires careful reinforcement check.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Appliance Package */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-rose-500" />
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
              4. Premium Integrated Appliances
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Oven Spec</label>
              <input
                id={`specs-oven-${job.id}`}
                type="text"
                name="oven"
                value={specs.oven}
                onChange={handleChange}
                placeholder="Brand & Model details"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hob / Cooktop</label>
              <input
                id={`specs-hob-${job.id}`}
                type="text"
                name="hob"
                value={specs.hob}
                onChange={handleChange}
                placeholder="Brand & Model details"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Extractor Hood</label>
              <input
                id={`specs-extractor-${job.id}`}
                type="text"
                name="extractor"
                value={specs.extractor}
                onChange={handleChange}
                placeholder="Downdraft / Canopy spec"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-950 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fridge-Freezer</label>
              <input
                id={`specs-fridge-${job.id}`}
                type="text"
                name="fridge"
                value={specs.fridge}
                onChange={handleChange}
                placeholder="Integrated french-door, etc"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-950 font-sans"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
