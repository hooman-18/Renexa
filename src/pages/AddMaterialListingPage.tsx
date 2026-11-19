import React, { useEffect, useState } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Upload } from 'lucide-react';
import { MaterialImage } from '../components/MaterialImage';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORY_PRESET_IMAGES, PRESET_IMAGE_OPTIONS } from '../data/seedData';
import {
  MATERIAL_CATEGORIES,
  MaterialCategory,
  QuantityUnit,
} from '../types/marketplace';

export function AddMaterialListingPage() {
  const { listings, editingListingId, addListing, updateListing, navigate } = useMarketplace();

  const existingListing = editingListingId
    ? listings.find((l) => l.id === editingListingId) ?? null
    : null;

  const [name, setName] = useState(existingListing?.name ?? '');
  const [category, setCategory] = useState<MaterialCategory>(
    existingListing?.category ?? 'Metal Scrap'
  );
  const [type, setType] = useState(existingListing?.type ?? '');
  const [grade, setGrade] = useState(existingListing?.grade ?? '');
  const [quantity, setQuantity] = useState(
    existingListing ? String(existingListing.quantity) : ''
  );
  const [unit, setUnit] = useState<QuantityUnit>(existingListing?.unit ?? 'TON');
  const [expectedPrice, setExpectedPrice] = useState(
    existingListing?.expectedPrice ? String(existingListing.expectedPrice) : ''
  );
  const [location, setLocation] = useState(existingListing?.location ?? 'Pune');
  const [supplierName, setSupplierName] = useState(
    existingListing?.supplierName ?? 'Deccan Metal Fabricators (Demo Supplier)'
  );
  const [description, setDescription] = useState(existingListing?.description ?? '');
  const [imageUrl, setImageUrl] = useState(
    existingListing?.imageUrl ?? CATEGORY_PRESET_IMAGES['Metal Scrap']
  );
  const [customUploaded, setCustomUploaded] = useState(false);
  const [nonHazardousConfirmed, setNonHazardousConfirmed] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync preset thumbnail when category changes unless user uploaded a custom photo or is editing
  useEffect(() => {
    if (!existingListing && !customUploaded) {
      setImageUrl(CATEGORY_PRESET_IMAGES[category]);
    }
  }, [category, existingListing, customUploaded]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.8 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please choose an image smaller than 1.8 MB for local demo storage.',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setCustomUploaded(true);
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.image;
          return copy;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Material name is required.';
    if (!type.trim()) next.type = 'Material type is required (e.g., Plate Offcuts, Coils).';
    if (!grade.trim()) next.grade = 'Grade or quality specification is required.';
    const qtyNum = Number(quantity);
    if (!quantity || Number.isNaN(qtyNum) || qtyNum <= 0) {
      next.quantity = 'Enter a valid available quantity greater than 0.';
    }
    if (expectedPrice.trim() !== '') {
      const priceNum = Number(expectedPrice);
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        next.expectedPrice = 'Expected price must be a positive number.';
      }
    }
    if (!location.trim()) next.location = 'Location / City is required.';
    if (!supplierName.trim()) next.supplierName = 'Supplier business name is required.';
    if (!description.trim() || description.trim().length < 15) {
      next.description = 'Provide a clear material description (at least 15 characters).';
    }
    if (!nonHazardousConfirmed) {
      next.compliance =
        'Please confirm this listing represents a recoverable, non-hazardous industrial material.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      category,
      type: type.trim(),
      grade: grade.trim(),
      quantity: Number(quantity),
      unit,
      expectedPrice: expectedPrice.trim() ? Number(expectedPrice) : undefined,
      location: location.trim(),
      supplierName: supplierName.trim(),
      description: description.trim(),
      imageUrl,
    };

    if (existingListing) {
      updateListing(existingListing.id, payload);
      navigate('supplier-dashboard');
    } else {
      const created = addListing(payload);
      navigate('material-details', { materialId: created.id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        type="button"
        onClick={() => navigate('supplier-dashboard')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0F172A] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Supplier Dashboard
      </button>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-slate-200">
          <p className="text-xs font-medium text-[#0D3B2E]">
            Supplier Catalog · {existingListing ? 'Edit Material Listing' : 'New Material Listing'}
          </p>
          <h1 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight mt-1">
            {existingListing ? `Edit "${existingListing.name}"` : 'List Recoverable Industrial Material'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Provide clear technical specifications so manufacturing buyers and ReNexa&apos;s matching
            engine can accurately identify your material.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
          {/* Row 1: Material Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="mat-name" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Material Name *
              </label>
              <input
                id="mat-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Galvanized Steel Sheet Offcuts"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="mat-category"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Material Category *
              </label>
              <select
                id="mat-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Material Type & Grade / Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="mat-type" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Material Type *
              </label>
              <input
                id="mat-type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Sheared Plate Offcuts, Extruded Bars, Flakes"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
              {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label
                htmlFor="mat-grade"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Grade / Quality *
              </label>
              <input
                id="mat-grade"
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. IS 2062 Grade A, 6061-T6, Bright Bare Grade 1"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
              {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
            </div>
          </div>

          {/* Row 3: Quantity, Unit & Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="mat-qty" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Available Quantity *
              </label>
              <input
                id="mat-qty"
                type="number"
                step="any"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 4"
                className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
            </div>

            <div>
              <label htmlFor="mat-unit" className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Unit *
              </label>
              <select
                id="mat-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="TON">TON (Metric Ton)</option>
                <option value="KG">KG (Kilogram)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="mat-price"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Expected Price (₹ / {unit}) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="mat-price"
                type="number"
                step="any"
                min="1"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                placeholder="Leave blank for quote"
                className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.expectedPrice && (
                <p className="mt-1 text-xs text-red-600">{errors.expectedPrice}</p>
              )}
            </div>
          </div>

          {/* Row 4: Location & Supplier Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="mat-location"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Location / City *
              </label>
              <input
                id="mat-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Chakan, Pimpri, Talegaon"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label
                htmlFor="mat-supplier"
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
              >
                Supplier Business Name *
              </label>
              <input
                id="mat-supplier"
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. Western Metal Industries"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {errors.supplierName && (
                <p className="mt-1 text-xs text-red-600">{errors.supplierName}</p>
              )}
            </div>
          </div>

          {/* Material Description */}
          <div>
            <label htmlFor="mat-desc" className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Material Description *
            </label>
            <textarea
              id="mat-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe dimensions, cleanliness, storage condition, segregation status, and suggested secondary industrial applications..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Photo Upload or Industrial Preset Selector */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <p className="text-sm font-medium text-[#0F172A]">
                Material Photo <span className="text-slate-400 font-normal">(Optional)</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a photo from your device or choose an illustrative category reference image.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div className="md:col-span-5 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <MaterialImage
                  src={imageUrl}
                  alt={name || 'Material preview'}
                  category={category}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-[#0F172A] cursor-pointer">
                  <Upload className="w-4 h-4 text-[#0D3B2E]" />
                  Upload Material Photo (JPG / PNG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                {errors.image && <p className="text-xs text-red-600">{errors.image}</p>}

                <div>
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Or select a quick industrial sample photo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => {
                          setImageUrl(opt.url);
                          setCustomUploaded(true);
                        }}
                        className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                          imageUrl === opt.url
                            ? 'border-[#059669] bg-emerald-50 text-[#0D3B2E] font-semibold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Non-Hazardous Scope Declaration */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={nonHazardousConfirmed}
                onChange={(e) => setNonHazardousConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#0D3B2E] rounded"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-[#0F172A] flex items-center gap-1.5 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D3B2E]" />
                  Recoverable, Non-Hazardous Material Declaration
                </strong>
                I confirm this material is a recoverable, non-hazardous industrial byproduct.
                Regulated or hazardous industrial waste streams require applicable statutory
                authorization and are outside this demo exchange scope.
              </span>
            </label>
            {errors.compliance && (
              <p className="mt-2 text-xs text-red-600">{errors.compliance}</p>
            )}
          </div>

          {/* Submit Bar */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('supplier-dashboard')}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors cursor-pointer"
            >
              {existingListing ? 'Save Listing Changes' : 'Publish Material Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
