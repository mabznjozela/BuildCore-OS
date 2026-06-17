import React, { useState } from 'react';
import { Job, JobStatus, ProjectHealth } from '../types';
import { PlusCircle, X, Info } from 'lucide-react';

interface NewJobModalProps {
  onClose: () => void;
  onSave: (newJob: Omit<Job, 'statusSince'>) => void;
}

export default function NewJobModal({ onClose, onSave }: NewJobModalProps) {
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [leadSource, setLeadSource] = useState<string>('Google Search');
  const [status, setStatus] = useState<JobStatus>('1 First Contact');
  const [health, setHealth] = useState<ProjectHealth>('On Track');
  const [quoteValue, setQuoteValue] = useState<string>('25000');
  const [depositReceived, setDepositReceived] = useState<string>('0');
  const [comments, setComments] = useState<string>('');
  const [siteNotes, setSiteNotes] = useState<string>('');

  const [boardType, setBoardType] = useState<string>('Moisture-resistant MDF (18mm)');
  const [boardSupplier, setBoardSupplier] = useState<string>('Egger UK');
  const [doorType, setDoorType] = useState<string>('Traditional Shaker');
  const [doorSupplier, setDoorSupplier] = useState<string>('In-house Spray Workshop');
  const [stoneColour, setStoneColour] = useState<string>('Carrara Quartz');
  const [stoneSupplier, setStoneSupplier] = useState<string>('Classic Stone');
  const [stoneThickness, setStoneThickness] = useState<string>('30mm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    // Generate random Job ID e.g. KL004
    const newId = `KL-${Math.floor(100 + Math.random() * 900)}`;

    onSave({
      id: newId,
      clientName: clientName.trim(),
      phone: phone.trim() || '27820000000',
      email: email.trim() || 'info@client.co.za',
      address: address.trim() || 'Centurion, South Africa',
      area: area.trim() || 'Centurion',
      leadSource: leadSource,
      status: status,
      nextAction: 'Schedule technical site survey or finalise wishlist details',
      health: health,
      quoteValue: parseFloat(quoteValue) || 15000,
      depositReceived: parseFloat(depositReceived) || 0,
      comments: comments.trim() || 'New bespoke premium kitchen design specification project.',
      siteNotes: siteNotes.trim() || 'No special site access problems reported.',
      specs: {
        boardType: boardType,
        boardSupplier: boardSupplier,
        doorType: doorType,
        doorSupplier: doorSupplier,
        softClose: true,
        ledLighting: true,
        pushToOpen: false,
        glassDoors: false,
        stoneSupplier: stoneSupplier,
        stoneColour: stoneColour,
        stoneThickness: stoneThickness,
        oven: 'Neff Smart Integrated',
        hob: 'Induction Cooktop matching standard specs',
        extractor: 'Canopy extractor recirculating',
        fridge: 'Integrated Fridge-Freezer'
      }
    });
  };

  return (
    <div id="new-job-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-150 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-150 p-5 sticky top-0 bg-white z-10 font-sans">
          <div>
            <h2 className="text-lg font-sans font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-600" />
              Add New Project Passport
            </h2>
            <p className="text-xs text-slate-500">Create a master workflow job tracker. Defaults automatically populate initial checklist tasks.</p>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-150 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Client details */}
          <div className="space-y-3 font-sans">
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-indigo-700 mb-1">
              1. Master Client Passport Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Client / Owner Name *</label>
                <input
                  id="new-job-client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Pinecrest Scullery, Driftwood Townhouse"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Geographic Area *</label>
                <input
                  id="new-job-area"
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Eldoraigne, Montana, Irene, Sandton"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Client Phone</label>
                <input
                  id="new-job-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 27833465449"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Client Email</label>
                <input
                  id="new-job-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@example.co.za"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery & Location Address *</label>
                <input
                  id="new-job-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Eldoraigne, Centurion, 0157, South Africa"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Gateways, Valuation, Health */}
          <div className="space-y-3 pt-4 border-t border-gray-100 font-sans">
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-indigo-700 mb-1">
              2. Initial Phase & Valuation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current Gateway Status</label>
                <select
                  id="new-job-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="1 First Contact">1 First Contact</option>
                  <option value="2 Qualifying Lead">2 Qualifying Lead</option>
                  <option value="3 Site Visit Scheduled">3 Site Visit Scheduled</option>
                  <option value="4 Site Visit Done">4 Site Visit Done</option>
                  <option value="5 Design Phase">5 Design Phase</option>
                  <option value="6 Quote Sent">6 Quote Sent</option>
                  <option value="7 Awaiting Deposit">7 Awaiting Deposit</option>
                  <option value="8 Deposit Paid">8 Deposit Paid</option>
                  <option value="9 Production">9 Production</option>
                  <option value="10 Installation Scheduled">10 Installation Scheduled</option>
                  <option value="11 Installation In Progress">11 Installation In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Quote Value (R)</label>
                <input
                  id="new-job-quote"
                  type="number"
                  value={quoteValue}
                  onChange={(e) => setQuoteValue(e.target.value)}
                  placeholder="45000"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Booking Deposit (R)</label>
                <input
                  id="new-job-deposit"
                  type="number"
                  value={depositReceived}
                  onChange={(e) => setDepositReceived(e.target.value)}
                  placeholder="0"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lead Sourcing</label>
                <input
                  id="new-job-lead-source"
                  type="text"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  placeholder="e.g. Repeat Client, Instagram referral"
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 focus:border-indigo-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Project Health Flag</label>
                <select
                  id="new-job-health"
                  value={health}
                  onChange={(e) => setHealth(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="On Track">On Track (Healthy)</option>
                  <option value="Needs Attention">Needs Attention (Amber)</option>
                  <option value="At Risk">At Risk (Red Warning)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Bespoke specifications (Initial drafts) */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-indigo-700 mb-1">
              3. Initial Carcass & Stone Specs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Board Material / Thickness</label>
                <input
                  id="new-job-board-type"
                  type="text"
                  value={boardType}
                  onChange={(e) => setBoardType(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Door Type profile</label>
                <input
                  id="new-job-door-type"
                  type="text"
                  value={doorType}
                  onChange={(e) => setDoorType(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Stone Countertop Colour</label>
                <input
                  id="new-job-stone-colour"
                  type="text"
                  value={stoneColour}
                  onChange={(e) => setStoneColour(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Client Wishlist Comments</label>
              <textarea
                id="new-job-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={2}
                placeholder="Type overall wishlist and core summary aesthetic details..."
                className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-950 outline-none"
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-150 sticky bottom-0 bg-white z-10 p-2">
            <button
              id="new-job-cancel-btn"
              type="button"
              onClick={onClose}
              className="text-xs bg-gray-150 border border-gray-200 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              id="new-job-submit-btn"
              type="submit"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              Add Job & Populate Tasks
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
