import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMenus, deleteMenu, uploadMenuImage } from "../services/api";
import type { Menu } from "../types";
import "../App.css";

function UploadModal({
  menuId,
  onClose,
  onSuccess,
}: {
  menuId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadMenuImage(menuId, file);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Gambar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-4xl mb-2">🖼️</span>
          <p className="text-sm text-gray-500">
            Drop your files here or{" "}
            <span className="text-blue-500 underline">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Maximum size: 50MB</p>
        </label>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="border rounded-xl h-40 flex items-center justify-center bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-gray-300 text-5xl">🖼️</span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-5 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploadMenuId, setUploadMenuId] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchMenus = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getMenus(page, 10);
      if (res.code === 200) {
        setMenus(res.data.menus ?? []);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus(currentPage);
  }, [currentPage]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMenu(deleteTarget.id);
      showToast(`Resep "${deleteTarget.name}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      fetchMenus(currentPage);
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus resep", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="px-4 md:px-12 py-8">
          <h1 className="text-3xl font-bold mb-6">Kelola Resep</h1>

          <button
            onClick={() => navigate("/manage/add")}
            className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold mb-8 hover:bg-yellow-600 transition"
          >
            Tambah Resep
          </button>

          {loading ? (
            <p className="text-gray-400">Memuat data...</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-gray-500 text-left">
                    <th className="py-3 px-4 font-medium">Nama Resep</th>
                    <th className="py-3 px-4 font-medium">Kategori</th>
                    <th className="py-3 px-4 font-medium">File ID</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu, index) => (
                    <tr
                      key={menu.id}
                      className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="py-3 px-4 font-medium">{menu.name}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {menu.category.name}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs truncate max-w-[160px]">
                        {menu.file_id ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setDeleteTarget(menu)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Del
                          </button>
                          <button
                            onClick={() => navigate(`/manage/edit/${menu.id}`)}
                            className="text-yellow-500 hover:text-yellow-700 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setUploadMenuId(menu.id)}
                            className="text-green-500 hover:text-green-700 text-xs font-medium"
                          >
                            Gambar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center gap-1 mt-6">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1.5 border rounded-lg text-sm transition ${
                  p === currentPage
                    ? "bg-gray-900 text-white border-gray-900"
                    : "hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {uploadMenuId !== null && (
        <UploadModal
          menuId={uploadMenuId}
          onClose={() => setUploadMenuId(null)}
          onSuccess={() => fetchMenus(currentPage)}
        />
      )}
      {deleteTarget && (
        <div
          className="confirm-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Hapus resep ini?</h3>
            <p className="confirm-desc">
              Resep <strong>"{deleteTarget.name}"</strong> akan dihapus secara
              permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-btn confirm-btn-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="confirm-btn confirm-btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
