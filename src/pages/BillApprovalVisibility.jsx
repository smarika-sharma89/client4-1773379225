import { useState } from "react";

const APPROVERS = ["Sarah Mitchell", "James Thornton", "Linda Okafor"];

const MOCK_BILLS = [
  { id: "BILL-001", vendor: "Apex Civil Contractors", amount: 48200, gst: 4820, status: "Awaiting 1st Approval", pendingApprover: "Sarah Mitchell", approvals: [null, null, null], date: "2024-06-01", wbs: "WBS-1100" },
  { id: "BILL-002", vendor: "Strata Earthworks Pty Ltd", amount: 31500, gst: 3150, status: "Awaiting 2nd Approval", pendingApprover: "James Thornton", approvals: ["Sarah Mitchell", null, null], date: "2024-06-03", wbs: "WBS-1200" },
  { id: "BILL-003", vendor: "Bridgepoint Formwork", amount: 87400, gst: 8740, status: "Awaiting Final Approval", pendingApprover: "Linda Okafor", approvals: ["Sarah Mitchell", "James Thornton", null], date: "2024-06-04", wbs: "WBS-1300" },
  { id: "BILL-004", vendor: "HiViz Traffic Management", amount: 12600, gst: 1260, status: "Fully Approved", pendingApprover: null, approvals: ["Sarah Mitchell", "James Thornton", "Linda Okafor"], date: "2024-06-05", wbs: "WBS-1400" },
  { id: "BILL-005", vendor: "Coastal Concrete Supply", amount: 54300, gst: 5430, status: "Awaiting 1st Approval", pendingApprover: "Sarah Mitchell", approvals: [null, null, null], date: "2024-06-06", wbs: "WBS-1100" },
  { id: "BILL-006", vendor: "Ironclad Structural Steel", amount: 102000, gst: 10200, status: "Awaiting 2nd Approval", pendingApprover: "James Thornton", approvals: ["Sarah Mitchell", null, null], date: "2024-06-07", wbs: "WBS-1500" },
];

const MOCK_DOCKET_NOTES = [
  { id: 1, author: "Sarah Mitchell", timestamp: "2024-06-07 09:14", text: "Rates verified against current EBA schedule. Approved for payment." },
  { id: 2, author: "James Thornton", timestamp: "2024-06-07 11:32", text: "Stand-down hours confirmed with site supervisor — inclement weather event on 5 June." },
];

const STATUS_COLORS = {
  "Awaiting 1st Approval": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Awaiting 2nd Approval": "bg-orange-100 text-orange-800 border-orange-200",
  "Awaiting Final Approval": "bg-blue-100 text-blue-800 border-blue-200",
  "Fully Approved": "bg-green-100 text-green-800 border-green-200",
};

const STEP_LABELS = ["1st Approval", "2nd Approval", "Final Approval"];

export default function BillApprovalVisibility() {
  const [bills, setBills] = useState(MOCK_BILLS);
  const [filterApprover, setFilterApprover] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDocket, setShowDocket] = useState(false);
  const [docketNotes, setDocketNotes] = useState(MOCK_DOCKET_NOTES);
  const [newNote, setNewNote] = useState("");
  const [toast, setToast] = useState(null);
  const [editGst, setEditGst] = useState("");
  const [editingGst, setEditingGst] = useState(false);

  const filtered = filterApprover === "All" ? bills : bills.filter(b => b.pendingApprover === filterApprover);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const openBill = (bill) => {
    setSelectedBill(bill);
    setEditGst(String(bill.gst));
    setEditingGst(false);
  };

  const saveGst = () => {
    const val = parseFloat(editGst);
    if (isNaN(val) || val < 0) { showToast("Invalid GST value", "error"); return; }
    setBills(prev => prev.map(b => b.id === selectedBill.id ? { ...b, gst: val } : b));
    setSelectedBill(prev => ({ ...prev, gst: val }));
    setEditingGst(false);
    showToast("GST updated successfully");
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const entry = { id: Date.now(), author: "Current User", timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), text: newNote.trim() };
    setDocketNotes(prev => [...prev, entry]);
    setNewNote("");
    showToast("Note appended to audit log");
  };

  const approveBill = (bill) => {
    const stepIdx = bill.approvals.findIndex(a => a === null);
    if (stepIdx === -1) return;
    const newApprovals = [...bill.approvals];
    newApprovals[stepIdx] = bill.pendingApprover || "Current User";
    const nextPending = stepIdx + 1 < APPROVERS.length ? APPROVERS[stepIdx + 1] : null;
    const newStatus = nextPending ? (stepIdx + 1 === 1 ? "Awaiting 2nd Approval" : "Awaiting Final Approval") : "Fully Approved";
    const updated = { ...bill, approvals: newApprovals, pendingApprover: nextPending, status: newStatus };
    setBills(prev => prev.map(b => b.id === bill.id ? updated : b));
    setSelectedBill(null);
    showToast(`Bill ${bill.id} advanced to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-56 bg-[#0a0a0a] flex flex-col p-4 gap-2 min-h-screen">
        <div className="text-white font-bold text-lg mb-6 mt-2 tracking-tight">Varicon</div>
        {["Dashboard", "Bills", "Day Works", "Reports", "Settings"].map(item => (
          <button key={item} onClick={() => { if (item === "Day Works") setShowDocket(true); else setShowDocket(false); }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item === (showDocket ? "Day Works" : "Bills") ? "bg-[#0ea5e9] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium border ${toast.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {toast.msg}
          </div>
        )}

        {!showDocket ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bills — Approval Tracking</h1>
                <p className="text-sm text-gray-500 mt-0.5">Three-phase approval workflow visibility</p>
              </div>
              <button onClick={() => setShowDocket(true)} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm">
                View Day Works Docket
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Filter by Pending Approver</label>
                <select value={filterApprover} onChange={e => setFilterApprover(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]">
                  <option value="All">All Approvers</option>
                  {APPROVERS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(STATUS_COLORS).map(([s, c]) => (
                  <span key={s} className={`text-xs px-2 py-1 rounded-full border font-medium ${c}`}>{s}: {bills.filter(b => b.status === s).length}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Bill ID", "Vendor", "Date", "Amount (excl. GST)", "GST", "WBS", "Status", "Pending Approver", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(bill => (
                    <tr key={bill.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openBill(bill)}>
                      <td className="px-4 py-3 font-medium text-[#0ea5e9]">{bill.id}</td>
                      <td className="px-4 py-3 text-gray-800">{bill.vendor}</td>
                      <td className="px-4 py-3 text-gray-500">{bill.date}</td>
                      <td className="px-4 py-3 text-gray-800">${bill.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">${bill.gst.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{bill.wbs}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[bill.status]}`}>{bill.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{bill.pendingApprover || "—"}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 text-gray-600" onClick={e => { e.stopPropagation(); openBill(bill); }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No bills match this filter.</div>}
            </div>
          </>
        ) : (
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setShowDocket(false)} className="text-sm text-gray-500 hover:text-gray-700">← Back to Bills</button>
              <h1 className="text-xl font-bold text-gray-900">Day Works Docket — DW-2024-047</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 font-medium">Submitted</span>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[["Vendor", "HiViz Traffic Management"], ["Date", "2024-06-05"], ["Site", "Bridge Rd Overpass"], ["Hours", "8.5 hrs"], ["Stand-down Hours", "2.0 hrs (incl. weather)"], ["Total Charge", "$3,420.00"]].map(([l, v]) => (
                  <div key={l}><span className="text-gray-500 text-xs">{l}</span><div className="font-medium text-gray-800">{v}</div></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Internal Notes & Audit Log</h2>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {docketNotes.map(note => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{note.author}</span>
                      <span className="text-xs text-gray-400">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{note.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()}
                  placeholder="Add internal note (not visible on docket)..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" />
                <button onClick={addNote} className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm font-medium hover:bg-[#0284c7] transition-colors">Append</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Notes are appended to the audit log only — the submitted docket is not modified.</p>
            </div>
          </div>
        )}

        {selectedBill && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4" onClick={() => setSelectedBill(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedBill(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedBill.id}</h2>
              <p className="text-sm text-gray-500 mb-4">{selectedBill.vendor}</p>

              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Approval Progress</p>
                <div className="flex items-center gap-2">
                  {STEP_LABELS.map((label, i) => {
                    const done = selectedBill.approvals[i] !== null;
                    const active = !done && selectedBill.approvals.slice(0, i).every(a => a !== null);
                    return (
                      <div key={label} className="flex items-center gap-2 flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? "bg-green-500 border-green-500 text-white" : active ? "bg-[#0ea5e9] border-[#0ea5e9] text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{label}</span>
                          {done && <span className="text-xs text-green-600 font-medium">{selectedBill.approvals[i]}</span>}
                          {active && <span className="text-xs text-[#0ea5e9] font-medium">Pending</span>}
                        </div>
                        {i < STEP_LABELS.length - 1 && <div className={`h-0.5 w-6 mb-5 ${done ? "bg-green-400" : "bg-gray-200"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm grid grid-cols-2 gap-2">
                <div><span className="text-gray-500 text-xs">Amount (excl. GST)</span><div className="font-medium">${selectedBill.amount.toLocaleString()}</div></div>
                <div>
                  <span className="text-gray-500 text-xs">GST</span>
                  {editingGst ? (
                    <div className="flex gap-1 mt-0.5">
                      <input value={editGst} onChange={e => setEditGst(e.target.value)} className="w-24 text-sm border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]" />
                      <button onClick={saveGst} className="text-xs px-2 py-0.5 rounded bg-[#0ea5e9] text-white">Save</button>
                      <button onClick={() => setEditingGst(false)} className="text-xs px-2 py-0.5 rounded border text-gray-500">✕</button>
                    </div>
                  ) : (
                    <div className="font-medium flex items-center gap-2">${selectedBill.gst.toLocaleString()}
                      <button onClick={() => setEditingGst(true)} className="text-xs text-[#0ea5e9] underline">Edit</button>
                    </div>
                  )}
                </div>
                <div><span className="text-gray-500 text-xs">Total (incl. GST)</span><div className="font-medium">${(selectedBill.amount + selectedBill.gst).toLocaleString()}</div></div>
                <div><span className="text-gray-500 text-xs">WBS Code</span><div className="font-medium">{selectedBill.wbs}</div></div>
              </div>

              <div className="flex gap-2 justify-end">
                {selectedBill.status !== "Fully Approved" && (
                  <button onClick={() => approveBill(selectedBill)} className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white text-sm font-medium hover:bg-[#0284c7] transition-colors">
                    Approve → Advance
                  </button>
                )}
                <button onClick={() => setSelectedBill(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}