"use client";

import { useEffect, useRef, useState } from "react";
import { Crop, ZoomIn, RotateCcw, ImagePlus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ASPECT_OPTIONS = [
  { label: "Persegi (1:1)", value: 1 },
  { label: "Katalog (4:3)", value: 4 / 3 },
];

export default function ImageCropInput({
  name = "image",
  label = "Gambar produk",
  required = false,
  currentImageUrl = null,
}) {
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [rawSrc, setRawSrc] = useState(null);
  const [rawFileName, setRawFileName] = useState("produk.webp");

  const [aspect, setAspect] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return () => {
      if (rawSrc && rawSrc.startsWith("blob:")) URL.revokeObjectURL(rawSrc);
      if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [rawSrc, previewUrl]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Format gambar harus JPG, PNG, atau WebP.");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawSrc(objectUrl);
    setRawFileName(file.name.replace(/\.[^.]+$/, "") + ".webp");
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setCropOpen(true);
  }

  function handlePointerDown(e) {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }

  function handlePointerMove(e) {
    if (!dragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }

  function handlePointerUp() {
    setDragging(false);
  }

  function handleCancelCrop() {
    setCropOpen(false);
    // Jika belum pernah ada hasil crop baru, kosongkan input file
    if (!previewUrl || previewUrl === currentImageUrl) {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleApplyCrop() {
    const img = imgRef.current;
    if (!img) return;

    // Ukuran frame pratinjau di layar (lebar 320px)
    const frameW = 320;
    const frameH = Math.round(frameW / aspect);

    // Output resolusi tinggi & tajam untuk katalog (800px)
    const outW = 800;
    const outH = Math.round(outW / aspect);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");

    // Latar belakang putih bersih jika gambar digeser keluar tepi
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    // Hitung skala dasar gambar agar menutupi frame (cover)
    const baseScale = Math.max(frameW / img.naturalWidth, frameH / img.naturalHeight);
    const totalScale = baseScale * zoom;

    const drawW = img.naturalWidth * totalScale;
    const drawH = img.naturalHeight * totalScale;

    const drawX = (frameW - drawW) / 2 + offset.x;
    const drawY = (frameH - drawH) / 2 + offset.y;

    const ratio = outW / frameW;
    ctx.drawImage(img, drawX * ratio, drawY * ratio, drawW * ratio, drawH * ratio);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (blob.size > 2 * 1024 * 1024) {
          setErrorMsg("Ukuran hasil gambar melebihi 2 MB. Coba perkecil zoom atau pilih foto lain.");
          return;
        }

        const croppedFile = new File([blob], rawFileName, { type: "image/webp" });
        const dt = new DataTransfer();
        dt.items.add(croppedFile);

        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }

        const nextPreview = URL.createObjectURL(blob);
        setPreviewUrl(nextPreview);
        setCropOpen(false);
      },
      "image/webp",
      0.9
    );
  }

  const frameHeight = Math.round(320 / aspect);

  return (
    <div className="space-y-2">
      <label htmlFor={`file-${name}`} className="block text-sm font-medium text-charcoal">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex-row sm:items-center">
        {previewUrl ? (
          <div className="relative size-24 shrink-0 overflow-hidden rounded-btn border border-line bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Pratinjau gambar produk" className="size-full object-cover" />
          </div>
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center rounded-btn border border-dashed border-line bg-cream/60 text-muted-strong">
            <ImagePlus className="size-6" aria-hidden="true" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            id={`file-${name}`}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={required && !currentImageUrl}
            onChange={handleFileChange}
            className="block w-full text-sm text-charcoal file:mr-3 file:cursor-pointer file:rounded-btn file:border file:border-line file:bg-cream file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-charcoal hover:file:bg-cream/80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-muted-strong">
              JPG, PNG, atau WebP, maksimal 2 MB. Gambar akan dipotong agar rapi di katalog.
            </p>
            {rawSrc && (
              <button
                type="button"
                onClick={() => setCropOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Crop className="size-3.5" aria-hidden="true" />
                Potong ulang
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMsg && <p className="text-xs font-medium text-danger">{errorMsg}</p>}

      {/* Modal Crop Gambar */}
      <Modal
        open={cropOpen}
        onClose={handleCancelCrop}
        title="Potong Gambar Produk"
        description="Geser foto dan atur perbesaran (zoom) agar produk terlihat pas di tengah bingkai."
        footer={
          <>
            <Button type="button" variant="outline" onClick={handleCancelCrop}>
              Batal
            </Button>
            <Button type="button" onClick={handleApplyCrop}>
              <Crop className="size-4" aria-hidden="true" />
              Terapkan Potongan
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4">
          {/* Pilihan Rasio */}
          <div className="flex items-center gap-2">
            {ASPECT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setAspect(opt.value);
                  setOffset({ x: 0, y: 0 });
                }}
                className={`rounded-btn border px-3 py-1.5 text-xs font-medium transition-colors ${
                  aspect === opt.value
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-cream text-charcoal hover:bg-cream/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Area Frame Crop (bisa di-drag) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ width: 320, height: frameHeight }}
            className="relative cursor-grab overflow-hidden rounded-card border-2 border-primary bg-stone-100 select-none active:cursor-grabbing"
          >
            {rawSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                ref={imgRef}
                src={rawSrc}
                alt="Area potong gambar"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
                className="pointer-events-none size-full object-cover transition-transform duration-75"
              />
            )}

            {/* Garis bantu grid rule-of-thirds */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-white/40" />
              <div className="border-r border-white/40" />
              <div />
            </div>
          </div>

          {/* Kontrol Zoom & Reset */}
          <div className="flex w-full max-w-xs items-center gap-3">
            <ZoomIn className="size-4 shrink-0 text-muted-strong" aria-hidden="true" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Perbesar gambar"
              className="w-full accent-primary"
            />
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              title="Atur ulang posisi"
              className="rounded-btn p-1.5 text-muted-strong hover:bg-cream hover:text-charcoal"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}