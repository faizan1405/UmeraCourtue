'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

export default function ImageUploader({ images = [], onImagesChange, multiple = true, label = 'Upload Images' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'umera-couture');

        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        uploaded.push(data.url);
      }

      if (multiple) {
        onImagesChange([...images, ...uploaded]);
      } else {
        onImagesChange(uploaded);
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="image-uploader">
      <label className="field-label">{label}</label>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-loading">
            <Loader2 size={24} className="spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="upload-prompt">
            <Upload size={24} />
            <span>Drop images here or click to browse</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((url, index) => (
            <div key={index} className="image-preview-item">
              <img src={url} alt={`Upload ${index + 1}`} />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
