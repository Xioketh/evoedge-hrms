"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { uploadCvAction, getCvDownloadUrlAction } from "@/src/actions/employee.actions";
import { toast } from "sonner";
import { Upload, Download, FileText, Replace, X } from "lucide-react";

interface EmployeeCvCardProps {
  userId: string;
  hasCv: boolean;
  cvOriginalName: string | null;
}

export function EmployeeCvCard({ userId, hasCv, cvOriginalName }: EmployeeCvCardProps) {
  const [state, action, isPending] = useActionState(uploadCvAction, null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      // Sync with the file input for form submission
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
      }
    } else {
      toast.error("Only PDF files are accepted.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const loadingToast = toast.loading("Preparing download...");
    try {
      const response = await getCvDownloadUrlAction(userId);
      if (response.success && response.url) {
        toast.dismiss(loadingToast);
        const a = document.createElement("a");
        a.href = response.url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toast.error(response.message || "Failed to download CV", { id: loadingToast });
      }
    } catch {
      toast.error("An error occurred while downloading", { id: loadingToast });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <Text size="3">CV / Resume</Text>
          </div>
          {hasCv && (
            <Button
              type="button"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="size-4 mr-1.5" />
              {isDownloading ? "Preparing..." : "Download"}
            </Button>
          )}
        </div>

        {/* Current CV info */}
        {hasCv && cvOriginalName && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 mb-4">
            <FileText className="size-5 text-emerald-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <Text size="1" className="font-medium text-emerald-800 truncate">
                {cvOriginalName}
              </Text>
              <Text size="1" color="muted" className="text-emerald-600">
                Currently uploaded
              </Text>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <form ref={formRef} action={action}>
          <input type="hidden" name="userId" value={userId} />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !isPending && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-all duration-200
              ${selectedFile
                ? "border-primary/50 bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/50"
              }
              ${isPending ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="cv"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="sr-only"
              disabled={isPending}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Text size="1" className="font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </Text>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <Text size="1" color="muted">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="size-5 text-muted-foreground" />
                </div>
                <Text size="1" className="font-medium">
                  {hasCv ? "Replace CV" : "Upload CV"}
                </Text>
                <Text size="1" color="muted">
                  Drag & drop or click to select • PDF only, max 5 MB
                </Text>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="muted"
                size="sm"
                onClick={clearSelection}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
              >
                {hasCv ? <Replace className="size-4 mr-1.5" /> : <Upload className="size-4 mr-1.5" />}
                {isPending ? "Uploading..." : hasCv ? "Replace CV" : "Upload CV"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
