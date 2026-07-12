import React, { useState } from 'react';
import { Users, Plus, Edit, Mail, Briefcase, PlusCircle, Trash, X, Clipboard } from 'lucide-react';
import { Employee } from '../types';

interface OrganizationViewProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  searchQuery: string;
}

export default function OrganizationView({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  searchQuery
}: OrganizationViewProps) {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Design');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  // Extract departments for filter list
  const departments = ['All', 'Design', 'Engineering', 'Human Resources', 'Finance', 'IT Infrastructure'];

  // Handle open modal for creating
  const openCreateModal = () => {
    setEditingEmployee(null);
    setName('');
    setRole('');
    setDepartment('Design');
    setEmail('');
    setAvatar('');
    setIsModalOpen(true);
  };

  // Handle open modal for editing
  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setRole(emp.role);
    setDepartment(emp.department);
    setEmail(emp.email);
    setAvatar(emp.avatar);
    setIsModalOpen(true);
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email) return;

    // Use a default avatar if none provided
    const userAvatar = avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;

    if (editingEmployee) {
      onEditEmployee({
        ...editingEmployee,
        name,
        role,
        department,
        email,
        avatar: userAvatar
      });
    } else {
      onAddEmployee({
        name,
        role,
        department,
        email,
        avatar: userAvatar,
        assignedAssets: []
      });
    }
    setIsModalOpen(false);
  };

  // Filter employees based on search query and department filter
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="organization-view-root">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Directory</h1>
          <p className="text-slate-400 text-sm">Manage company departments, active teams, and employee asset profiles.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
          id="add-employee-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2" id="dept-filter-tabs">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedDept === dept
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                : 'bg-[#0f1830] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid List of Employees */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-[#0f1830] border border-slate-800 rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold text-white">No employees found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search filters or add a new team member to represent your company roster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="employees-cards-grid">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id}
              className="bg-[#0f1830] border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  {/* User Profile Avatar */}
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-base leading-tight">{emp.name}</h3>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-blue-400 shrink-0" />
                        <span>{emp.role}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Edit & Delete actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all cursor-pointer"
                      title="Edit employee"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Delete employee"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info Block */}
                <div className="mt-5 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 bg-[#0a1122]/80 px-3 py-1.5 rounded-lg">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 px-3 py-1.5 rounded-lg bg-[#0a1122]/40">
                    <span className="text-slate-400">Department</span>
                    <span className="font-semibold text-white px-2 py-0.5 bg-slate-800/80 rounded text-[10px] uppercase tracking-wider">{emp.department}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Assets summary */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Clipboard className="h-3.5 w-3.5 text-purple-400" />
                    <span>Assigned Hardware</span>
                  </span>
                  <span className="text-xs font-bold text-white bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full">
                    {emp.assignedAssets.length} Devices
                  </span>
                </div>
                {emp.assignedAssets.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {emp.assignedAssets.map((assetName, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] text-slate-300 bg-[#0a1122]/90 border border-slate-800 px-2 py-0.5 rounded-md truncate max-w-full"
                        title={assetName}
                      >
                        {assetName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic mt-1">No hardware assets registered yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" id="employee-modal">
          <div 
            className="bg-[#0f1830] border border-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up"
            id="employee-modal-content"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131d3a]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>{editingEmployee ? 'Edit Employee Profile' : 'Add New Employee'}</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha Patil"
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Work Role / Designation</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead UX Designer"
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a1122] text-sm text-white px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {departments.filter(d => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@assetflow.io"
                    className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Leave empty to auto-assign a fallback profile avatar.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>{editingEmployee ? 'Save Changes' : 'Create Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
