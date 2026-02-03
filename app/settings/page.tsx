'use client';

import { useState } from 'react';
import { Users, Building2, Shield, Plus, Edit, Trash2, Search, UserPlus, ShieldPlus, Check, X, Eye, FileEdit, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'users' | 'departments' | 'permissions' | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [users, setUsers] = useState([
    { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', department: 'IT', role: 'مدير', status: 'نشط' },
    { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', department: 'HR', role: 'كاتب', status: 'نشط' },
    { id: '3', name: 'محمد خالد', email: 'mohammed@example.com', department: 'Finance', role: 'مشاهد', status: 'معطل' },
  ]);

  const [departments, setDepartments] = useState([
    { id: '1', name: 'المعلوماتية', code: 'IT', manager: 'أحمد محمد', usersCount: 12, parent: null },
    { id: '2', name: 'المصادر البشرية', code: 'HR', manager: 'فاطمة علي', usersCount: 8, parent: null },
    { id: '3', name: 'المالية', code: 'Finance', manager: 'محمد خالد', usersCount: 15, parent: null },
    { id: '4', name: 'تطوير البرمجيات', code: 'DEV', manager: 'سارة أحمد', usersCount: 5, parent: '1' },
  ]);

  const [roles, setRoles] = useState([
    { id: '1', name: 'مدير النظام', permissions: ['all'], usersCount: 2 },
    { id: '2', name: 'مدير إدارة', permissions: ['read', 'write', 'approve'], usersCount: 5 },
    { id: '3', name: 'كاتب', permissions: ['read', 'write'], usersCount: 12 },
    { id: '4', name: 'مراجع', permissions: ['read', 'review'], usersCount: 8 },
    { id: '5', name: 'مشاهد', permissions: ['read'], usersCount: 20 },
  ]);

  const filteredUsers = users.filter(u => 
    u.name.includes(searchTerm) || u.email.includes(searchTerm) || u.department.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mb-2">
          الإعدادات
        </h1>
        <p className="text-lg text-gray-600 font-medium">إدارة النظام والمستخدمين والإعدادات</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* User Management Card */}
        <div className={`group relative overflow-hidden rounded-2xl border-2 ${activeSection === 'users' ? 'border-blue-400' : 'border-gray-200'} bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-3 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">إدارة المستخدمين</h2>
                <p className="text-sm text-gray-600 font-medium">{users.length} مستخدم</p>
              </div>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="إضافة مستخدم"
            >
              <UserPlus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {users.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSection(activeSection === 'users' ? null : 'users')}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {activeSection === 'users' ? 'إخفاء القائمة' : 'عرض جميع المستخدمين'}
          </button>
        </div>

        {/* Departments Card */}
        <div className={`group relative overflow-hidden rounded-2xl border-2 ${activeSection === 'departments' ? 'border-green-400' : 'border-gray-200'} bg-gradient-to-br from-white to-green-50/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">الأقسام والإدارات</h2>
                <p className="text-sm text-gray-600 font-medium">{departments.length} قسم</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="إضافة قسم"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {departments.slice(0, 3).map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                    {dept.code}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{dept.name}</p>
                    <p className="text-xs text-gray-500">{dept.usersCount} مستخدم</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSection(activeSection === 'departments' ? null : 'departments')}
            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {activeSection === 'departments' ? 'إخفاء القائمة' : 'عرض جميع الأقسام'}
          </button>
        </div>

        {/* Permissions Card */}
        <div className={`group relative overflow-hidden rounded-2xl border-2 ${activeSection === 'permissions' ? 'border-orange-400' : 'border-gray-200'} bg-gradient-to-br from-white to-orange-50/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-600 p-3 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">الأدوار والصلاحيات</h2>
                <p className="text-sm text-gray-600 font-medium">{roles.length} دور</p>
              </div>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              title="إضافة دور"
            >
              <ShieldPlus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {roles.slice(0, 3).map((role) => (
              <div key={role.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{role.name}</p>
                    <p className="text-xs text-gray-500">{role.usersCount} مستخدم</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                    <SettingsIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSection(activeSection === 'permissions' ? null : 'permissions')}
            className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {activeSection === 'permissions' ? 'إخفاء القائمة' : 'عرض جميع الأدوار'}
          </button>
        </div>
      </div>

      {/* Expanded Sections */}
      {activeSection === 'users' && (
        <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">قائمة المستخدمين</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                إضافة مستخدم
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">القسم</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الدور</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="تعديل">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="عرض">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="حذف">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSection === 'departments' && (
        <div className="mt-8 rounded-2xl border-2 border-green-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">قائمة الأقسام والإدارات</h2>
            <button
              onClick={() => setShowDeptModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              إضافة قسم
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                      {dept.parent && (
                        <p className="text-xs text-gray-500">تابع لـ: {departments.find(d => d.id === dept.parent)?.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">المدير:</span> {dept.manager}
                  </div>
                  <div>
                    <span className="font-semibold">المستخدمين:</span> {dept.usersCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'permissions' && (
        <div className="mt-8 rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">الأدوار والصلاحيات</h2>
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              إضافة دور
            </button>
          </div>
          
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.usersCount} مستخدم</p>
                    </div>
                  </div>
                  <button className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors">
                    <SettingsIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {perm === 'all' ? 'جميع الصلاحيات' : 
                       perm === 'read' ? 'قراءة' :
                       perm === 'write' ? 'كتابة' :
                       perm === 'approve' ? 'موافقة' :
                       perm === 'review' ? 'مراجعة' : perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إضافة مستخدم جديد</h2>
              <button onClick={() => setShowUserModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">القسم</label>
                <select className="w-full px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400">
                  <option>المعلوماتية</option>
                  <option>المصادر البشرية</option>
                  <option>المالية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الدور</label>
                <select className="w-full px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400">
                  <option>مدير</option>
                  <option>كاتب</option>
                  <option>مراجع</option>
                  <option>مشاهد</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowUserModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                إلغاء
              </button>
              <button onClick={() => setShowUserModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إضافة قسم جديد</h2>
              <button onClick={() => setShowDeptModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم القسم</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رمز القسم</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">القسم الرئيسي</label>
                <select className="w-full px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400">
                  <option>لا يوجد</option>
                  <option>المعلوماتية</option>
                  <option>المصادر البشرية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">مدير القسم</label>
                <select className="w-full px-4 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400">
                  <option>اختر المدير</option>
                  <option>أحمد محمد</option>
                  <option>فاطمة علي</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowDeptModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                إلغاء
              </button>
              <button onClick={() => setShowDeptModal(false)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إضافة دور جديد</h2>
              <button onClick={() => setShowRoleModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الدور</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الصلاحيات</label>
                <div className="space-y-2 border border-gray-300 rounded-lg p-3">
                  {['قراءة', 'كتابة', 'تعديل', 'حذف', 'موافقة', 'رفض', 'أرشيف'].map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-sm text-gray-700">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                إلغاء
              </button>
              <button onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="mt-8 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">معلومات النظام</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600">اسم النظام</p>
            <p className="text-lg text-gray-900">نظام إدارة المراسلات</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">الإصدار</p>
            <p className="text-lg text-gray-900">1.0.0</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">المطور</p>
            <p className="text-lg text-gray-900">ISELECT</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">السنة</p>
            <p className="text-lg text-gray-900">2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
