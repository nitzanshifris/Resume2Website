"use client";

import React, { useState } from "react";
import { FileUpload } from "./file-upload-base";

export function FileUploadGalleryPreview() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <FileUpload 
          onChange={handleFileUpload}
          className="h-full"
          maxFiles={3}
          accept={{
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
            'application/pdf': ['.pdf']
          }}
        />
      </div>
    </div>
  );
}