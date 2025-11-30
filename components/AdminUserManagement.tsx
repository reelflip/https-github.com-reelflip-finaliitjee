import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  User as UserIcon, 
  Shield, 
  Baby, 
  GraduationCap,
  Save,
  X,
  Filter
} from 'lucide-react';

const MOCK_USERS: User[] = [
  { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', role: 'student', institute: 'Allen Kota', targetYear: '2025' },
  { id: 2, name: 'Rajesh Kumar', email: 'parent@example.com', role: 'parent', phone: '+91 9876543210' },
  { id: 3, name: 'System Admin', email: 'admin@iitjee.com', role: 'admin' },
  { id: 4, name: 'Priya Sharma', email: 'priya.s@example.com', role: 'student', institute: 'FIITJEE Delhi', targetYear: '2026' },
  { id: 5, name: 'Rahul Verma', email: 'rahul.v@example.com', role: 'student', institute: 'Self Study', targetYear: '2025' },
];

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentUser({ role: 'student', institute: '', targetYear: 'JEE 2025' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentUser.id) {
      // Update existing
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? currentUser as User : u)));
    } else {
      // Add new
      const newUser = { ...currentUser, id: Date.now() } as User;
      setUsers(prev => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  const RoleBadge = ({ role }: { role: Role }) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Shield size={12} /> Admin</span>;
      case 'parent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Baby size={12} /> Parent</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><GraduationCap size={12} /> Student</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm">Add, edit, or remove system access.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[150px]"
            >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="parent">Parents</option>
                <option value="admin">Admins</option>
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Specifics</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.role === 'student' && (
                        <div>
                          <p><span className="font-semibold text-slate-400 text-xs">Inst:</span> {user.institute || 'N/A'}</p>
                          <p><span className="font-semibold text-slate-400 text-xs">Target:</span> {user.targetYear || 'N/A'}</p>
                        </div>
                      )}
                      {user.role === 'parent' && user.phone && (
                         <p>{user.phone}</p>
                      )}
                      {user.role === 'admin' && <span className="text-slate-400 italic">Full Access</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
           <span>Showing {filteredUsers.length} users</span>
           <span>Database: Connected (Mock Mode)</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditMode ? 'Edit User Details' : 'Add New User'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                <select 
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({...currentUser, role: e.target.value as Role})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={currentUser.name || ''}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. john@example.com"
                />
              </div>

              {/* Conditional Fields based on Role */}
              {currentUser.role === 'student' && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Institute</label>
                      <input 
                        type="text" 
                        value={currentUser.institute || ''}
                        onChange={(e) => setCurrentUser({...currentUser, institute: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Allen"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Year</label>
                      <select 
                        value={currentUser.targetYear || ''}
                        onChange={(e) => setCurrentUser({...currentUser, targetYear: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                         <option value="">Select Year</option>
                         <option value="2025">2025</option>
                         <option value="2026">2026</option>
                         <option value="2027">2027</option>
                      </select>
                   </div>
                </div>
              )}

             {currentUser.role === 'parent' && (
                <div className="pt-2 border-t border-slate-100 mt-2">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={currentUser.phone || ''}
                        onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+91..."
                      />
                   </div>
                </div>
             )}

              <div className="flex gap-3 mt-6 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isEditMode ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;