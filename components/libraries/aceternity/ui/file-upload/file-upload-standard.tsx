"use client";

import React, { useState } from "react";
import { FileUpload } from "./file-upload-base";

export function FileUploadStandard() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log("Files uploaded:", files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload 
        onChange={handleFileUpload}
        className="h-full"
      />
      {files.length > 0 && (
        <div className="mt-4 p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {files.length} file(s) selected
          </p>
        </div>
      )}
    </div>
  );
}