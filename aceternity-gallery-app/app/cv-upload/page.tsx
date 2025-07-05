"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function CVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload CV
      const uploadResponse = await fetch("http://localhost:8000/cv/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();
      const jobId = uploadData.job_id;
      setJobId(jobId);
      setStatus("processing");

      // Poll for status
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max
      
      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`http://localhost:8000/cv/status/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === "completed") {
          // Get result
          const resultResponse = await fetch(`http://localhost:8000/cv/result/${jobId}`);
          const resultData = await resultResponse.json();
          
          setResult(resultData);
          setStatus("success");
          break;
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Processing failed");
        }

        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error("Processing timeout");
      }

    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  const generateWebsite = async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`http://localhost:8000/cv/generate-website/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "react",
          include_preview: true
        }),
      });

      if (!response.ok) {
        throw new Error("Website generation failed");
      }

      const data = await response.json();
      
      // Open preview in new tab
      if (data.preview_url) {
        window.open(data.preview_url, "_blank");
      }
      
      console.log("Website generated:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your CV</h1>
          <p className="text-gray-400 mb-8">Test the CV processing pipeline with our new components</p>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                ${file ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <div className="flex flex-col items-center gap-4">
                  {file ? (
                    <>
                      <FileText className="h-12 w-12 text-green-500" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-zinc-500" />
                      <div>
                        <p className="text-white font-medium">Drop your CV here or click to browse</p>
                        <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX (max 10MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Status Display */}
          {status !== "idle" && (
            <div className="mb-6 p-4 rounded-lg bg-zinc-800/50">
              <div className="flex items-center gap-3">
                {status === "uploading" && (
                  <>
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <span className="text-blue-500">Uploading CV...</span>
                  </>
                )}
                {status === "processing" && (
                  <>
                    <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                    <span className="text-purple-500">Processing CV...</span>
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">CV processed successfully!</span>
                  </>
                )}
                {status === "error" && (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-500">{error || "An error occurred"}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 px-6 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {uploading ? "Processing..." : "Upload & Process"}
            </button>

            {status === "success" && jobId && (
              <button
                onClick={generateWebsite}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-3 px-6 rounded-lg
                  hover:opacity-90 transition-opacity"
              >
                Generate Website
              </button>
            )}
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-8 p-4 rounded-lg bg-zinc-800/50">
              <h3 className="text-lg font-semibold text-white mb-2">Processing Results</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  Job ID: <span className="text-white font-mono">{jobId}</span>
                </p>
                <p className="text-gray-400">
                  Archetype: <span className="text-white">{result.archetype || "Not determined"}</span>
                </p>
                <p className="text-gray-400">
                  Sections Found: <span className="text-white">{Object.keys(result.sections || {}).length}</span>
                </p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-gray-400 hover:text-white">View Full Result</summary>
                  <pre className="mt-2 text-xs text-gray-300 overflow-auto max-h-60">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* Component Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This will process your CV and generate a website using:</p>
          <p className="mt-1">Aurora Background • 3D Cards • Animated Tooltips • Apple Carousel • Testimonials • Background Beams</p>
        </div>
      </motion.div>
    </div>
  );
}