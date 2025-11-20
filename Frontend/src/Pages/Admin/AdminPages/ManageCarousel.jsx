import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchSlides, uploadSlide, deleteSlide, updateSlide } from "../../../utils/carousel";
import { toast } from "react-toastify";
import { Plus, UploadCloud, Image as ImageIcon, Edit, Trash2, GripVertical, X, Loader2 } from "lucide-react";
import OpenModel from "../../../Components/OpenModel";

const initialFormState = { title: "", description: "", link: "" };

export default function ManageCarousel() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const listRef = useRef(null);
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSlides();
      setSlides(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (err) {
      console.error("Failed to load slides:", err);
      toast.error("Failed to fetch slides. Please check the console.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setFile(null);
    setPreview(null);
    setEditingSlideId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingSlideId) {
      toast.warn("Please choose an image to upload.");
      return;
    }

    setLoading(true);
    try {
      if (editingSlideId) {
        // Update existing slide
        const updatedSlide = await updateSlide(editingSlideId, { ...form, imageFile: file });
        setSlides(slides.map(s => s._id === editingSlideId ? { ...s, ...updatedSlide } : s).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        toast.success("Slide updated successfully!");
      } else {
        // Add new slide
        const newSlide = await uploadSlide({
          ...form,
          imageFile: file,
          order: slides.length, // Append to the end
        });
        setSlides([...slides, newSlide]);
        toast.success("Slide uploaded successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("Form submission failed:", err);
      toast.error(editingSlideId ? "Failed to update slide." : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setModalState({
      isOpen: true,
      title: "Delete Slide",
      message: `Are you sure you want to delete the slide "${name || 'Untitled'}"? This action cannot be undone.`,
      btnMessage: "Delete",
      onConfirm: async () => {
        try {
          await deleteSlide(id);
          setSlides(slides.filter((s) => s._id !== id));
          toast.success("Slide deleted successfully.");
        } catch (err) {
          console.error("Delete failed:", err);
          toast.error("Failed to delete slide.");
        }
        closeModal();
      },
    });
  };

  const handleEdit = (slide) => {
    setEditingSlideId(slide._id);
    setForm({ title: slide.title, description: slide.description, link: slide.link });
    setPreview(slide.image);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  // Drag & Drop Logic
  const onDragStart = (e, idx) => {
    dragIndex.current = idx;
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("bg-indigo-100", "shadow-lg");
  };

  const onDragEnter = (e, idx) => {
    e.preventDefault();
    dragOverIndex.current = idx;
    e.currentTarget.classList.add("bg-gray-200");
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-gray-200");
  };

  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("bg-indigo-100", "shadow-lg");
    dragIndex.current = null;
    dragOverIndex.current = null;
    // Clean up all hover effects
    Array.from(listRef.current.children).forEach(child => child.classList.remove("bg-gray-200"));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const from = dragIndex.current;
    const to = dragOverIndex.current;

    if (from === null || to === null || from === to) return;

    const items = [...slides];
    const [movedItem] = items.splice(from, 1);
    items.splice(to, 0, movedItem);

    const reorderedSlides = items.map((s, i) => ({ ...s, order: i }));
    setSlides(reorderedSlides);
    persistOrder(reorderedSlides);
  };

  const persistOrder = useCallback(async (reorderedSlides) => {
    setIsSavingOrder(true);
    toast.info("Saving new order...");
    try {
      await Promise.all(
        reorderedSlides.map((s, i) => updateSlide(s._id, { order: i }))
      );
      toast.success("Order saved successfully!");
      await loadSlides(); // Reload to confirm canonical order
    } catch (err) {
      console.error("Failed to persist order:", err);
      toast.error("Failed to save new order. Reverting changes.");
      await loadSlides(); // Revert on failure
    } finally {
      setIsSavingOrder(false);
    }
  }, [loadSlides]);

  const onFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <OpenModel isOpen={modalState.isOpen} onClose={closeModal} {...modalState} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Carousel Management</h1>
            <p className="text-slate-600">Add, edit, and reorder home page slides.</p>
          </div>
        </div>
        {isSavingOrder && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Saving order...</span>
          </div>
        )}
      </div>

      {/* Form Section */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
          {editingSlideId ? "Edit Slide" : "Add New Slide"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input id="title" name="title" value={form.title} onChange={onFormChange} placeholder="e.g., Summer Sale" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={onFormChange} placeholder="e.g., Up to 50% off on all items!" rows={3} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
              <input id="link" name="link" value={form.link} onChange={onFormChange} placeholder="e.g., /collections/sale" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          {/* Right: Image Upload & Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center p-4 relative overflow-hidden">
              {preview ? (
                <img src={preview} alt="Slide Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <UploadCloud className="w-10 h-10 mb-2" />
                  <span className="text-sm">Image Preview</span>
                  <span className="text-xs mt-1">Recommended: 1600x600px</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
              {file ? `Selected: ${file.name}` : "Choose Image"}
            </label>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-3 flex items-center gap-4 pt-6 border-t">
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : editingSlideId ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
              {loading ? (editingSlideId ? "Updating..." : "Uploading...") : (editingSlideId ? "Update Slide" : "Add Slide")}
            </button>
            <button type="button" onClick={resetForm} className="inline-flex items-center justify-center bg-white text-gray-700 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50">
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* Existing Slides Section */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Existing Slides</h2>
        {loading && slides.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Loading slides...</div>
        ) : slides.length > 0 ? (
          <div ref={listRef} onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className="space-y-3">
            {slides.map((slide, idx) => (
              <div
                key={slide._id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragEnter={(e) => onDragEnter(e, idx)}
                onDragLeave={onDragLeave}
                onDragEnd={onDragEnd}
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-all duration-200 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="text-gray-400 flex-shrink-0" />
                <div className="w-32 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                  <img src={slide.image} alt={slide.title || "slide"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{slide.title || "Untitled Slide"}</p>
                  <p className="text-xs text-gray-500 truncate">{slide.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(slide._id, slide.title)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            No slides found. Add one using the form above.
          </div>
        )}
        {slides.length > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            Drag and drop slides to reorder. The new order is saved automatically.
          </div>
        )}
      </section>
    </div>
  );
}
