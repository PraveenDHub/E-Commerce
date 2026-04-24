import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  Pencil,
  X,
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../features/products/User/userSlice.js";
import Loader from "../components/Loader.jsx";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Split into two selectors — avoids shadowing between `user` and `users`
  const { users, usersLoading } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
      toast.error("Not authorized");
    } else {
      dispatch(getAllUsers());
    }
  }, [currentUser, dispatch]);

  // ─── Filtered list ────────────────────────────────────────────────
  const filteredUsers = (users || [])
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u._id?.toLowerCase().includes(term)
      );
    })
    .filter((u) => roleFilter === "all" || u.role === roleFilter);

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u) => u.role === "admin").length || 0;
  const userCount = users?.filter((u) => u.role === "user").length || 0;

  // ─── Edit modal ───────────────────────────────────────────────────
  const openEditModal = (u) => {
    setEditingUser(u);
    setSelectedRole(u.role);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUser(null);
  };

  const handleRoleUpdate = async () => {
    if (selectedRole === editingUser.role) {
      toast("No changes made");
      closeEditModal();
      return;
    }
    setEditLoading(true);
    try {
      await dispatch(
        updateUserRole({ id: editingUser._id, role: selectedRole }),
      ).unwrap();
      toast.success(`${editingUser.name}'s role updated to ${selectedRole}`);
      closeEditModal();
      dispatch(getAllUsers());
    } catch (err) {
      toast.error(err?.message || "Failed to update role");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = (u) => {
    if (u._id === currentUser?._id) {
      toast.error("You cannot delete your own account");
      return;
    }
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-red-600 text-sm">
            🗑️ Delete <span className="font-bold">{u.name}</span> permanently?
          </p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await dispatch(deleteUser(u._id)).unwrap();
                  toast.success(`${u.name} deleted successfully`);
                  dispatch(getAllUsers());
                } catch {
                  toast.error("Delete failed");
                }
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2 bg-gray-200 rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  // ─── Helpers ──────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const avatarColors = [
    "bg-orange-400",
    "bg-blue-400",
    "bg-emerald-400",
    "bg-purple-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-teal-400",
    "bg-indigo-400",
  ];

  const getAvatarColor = (id) =>
    avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length];

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage and monitor all registered accounts
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Total Users
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
        </div>

        {/* ── Stat Pills ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">
              {adminCount} Admins
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">
              {userCount} Users
            </span>
          </div>
        </div>

        {/* ── Search + Filter ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Table (Desktop) ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["User", "Role", "Contact", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                        h === "Actions" ? "text-center" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usersLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-20 text-center text-gray-400 text-sm"
                    >
                      <div className="flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                        <p className="ml-2 text-gray-600">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Users className="w-10 h-10 opacity-30" />
                        <p className="font-medium text-gray-500">
                          No users found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-orange-50/40 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar?.url ? (
                            <img
                              src={u.avatar.url}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${getAvatarColor(u._id)}`}
                            >
                              {getInitials(u.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {u.name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              #{u._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            u.role === "admin"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          {u.role}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {u.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          Joined {formatDate(u.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"
                            title="Edit role"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={u._id === currentUser?._id}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              u._id === currentUser?._id
                                ? "Cannot delete yourself"
                                : "Delete user"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filteredUsers.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                Showing {filteredUsers.length} of {totalUsers} users
              </div>
            )}
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Users className="w-10 h-10 opacity-30" />
                  <p className="font-medium text-gray-500">No users found</p>
                </div>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u._id} className="p-5">
                  <div className="flex items-start gap-4">
                    {u.avatar?.url ? (
                      <img
                        src={u.avatar.url}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getAvatarColor(u._id)}`}
                      >
                        {getInitials(u.name)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {u.name}
                        </p>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        #{u._id?.slice(-6)}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3 shrink-0 text-gray-400" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          Joined {formatDate(u.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openEditModal(u)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-2xl text-sm font-medium transition"
                    >
                      <Pencil className="w-4 h-4" /> Edit Role
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={u._id === currentUser?._id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-2xl text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Role Modal ── */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <Pencil className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">
                  Edit User Role
                </h2>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-7 space-y-5">
              {/* User card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {editingUser.avatar?.url ? (
                  <img
                    src={editingUser.avatar.url}
                    alt={editingUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getAvatarColor(editingUser._id)}`}
                  >
                    {getInitials(editingUser.name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {editingUser.name}
                  </p>
                  <p className="text-sm text-gray-500">{editingUser.email}</p>
                </div>
              </div>

              {/* Role toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assign Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["user", "admin"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 text-sm font-semibold transition ${
                        selectedRole === role
                          ? role === "admin"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : role === "manager"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {role === "admin" ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning when demoting admin */}
              {editingUser.role === "admin" && selectedRole === "user" && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  This will remove admin privileges from this user.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-7 pb-7 flex gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 py-3.5 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                disabled={editLoading}
                className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-2xl text-sm font-semibold transition"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;