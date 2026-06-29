"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
}

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "text-slate-500",
  medium: "text-orange-500",
  high: "text-red-500 font-semibold",
};

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, filterPriority]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterPriority !== "all") params.append("priority", filterPriority);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/tickets/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      fetchTickets();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <span className="ml-auto text-sm text-slate-500">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="px-6 py-4 overflow-x-auto">
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No tickets found</div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800">{ticket.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{ticket.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{ticket.subject}</td>
                  <td className="px-4 py-3 text-sm capitalize">{ticket.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {ticket.status === "open" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "in_progress")}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          In Progress
                        </button>
                      )}
                      {(ticket.status === "open" || ticket.status === "in_progress") && (
                        <button
                          onClick={() => updateStatus(ticket.id, "resolved")}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Resolve
                        </button>
                      )}
                      {ticket.status !== "closed" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "closed")}
                          className="text-xs px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
