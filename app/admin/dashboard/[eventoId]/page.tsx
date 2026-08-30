"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ExternalLink, History, Loader2 } from "lucide-react";

import { moratConfigSchema, type MoratConfigInput } from "@/lib/schemas";
import { DEFAULT_MORAT_CONFIG } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { StatusBadge, type SaveStatus } from "@/components/admin/editor/StatusBadge";
import { SectionNav } from "@/components/admin/editor/SectionNav";
import { BackupsModal } from "@/components/admin/editor/BackupsModal";
import { PublicacionSection } from "@/components/admin/editor/sections/PublicacionSection";
import { IntroSection } from "@/components/admin/editor/sections/IntroSection";
import { MarqueeSection } from "@/components/admin/editor/sections/MarqueeSection";
import { BeneficoSection } from "@/components/admin/editor/sections/BeneficoSection";
import { EntradasSection } from "@/components/admin/editor/sections/EntradasSection";
import { BandaSection } from "@/components/admin/editor/sections/BandaSection";
import { ClaimSection } from "@/components/admin/editor/sections/ClaimSection";
import { VideosSection } from "@/components/admin/editor/sections/VideosSection";
import { FotosSection } from "@/components/admin/editor/sections/FotosSection";
import { PatrocinadoresSection } from "@/components/admin/editor/sections/PatrocinadoresSection";
import { PieSection } from "@/components/admin/editor/sections/PieSection";
import { useToast } from "@/components/providers/ToastProvider";

export default function EventoEditorPage() {
  const params = useParams();
  const eventoId = params.eventoId as string;
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const [loadingData, setLoadingData] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("clean");
  const [backupsOpen, setBackupsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("publicacion");

  const methods = useForm<MoratConfigInput>({
    resolver: zodResolver(moratConfigSchema),
    defaultValues: DEFAULT_MORAT_CONFIG as MoratConfigInput,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = methods;

  // Load initial data — toast is read via ref to keep deps stable
  // (otherwise toast ref changes would refetch and wipe unsaved edits)
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/admin/evento/${eventoId}`, {
        credentials: "include",
      });
      const data = await res.json();
      reset(data);
    } catch {
      toastRef.current.error("Error al cargar el evento");
      reset(DEFAULT_MORAT_CONFIG as MoratConfigInput);
    } finally {
      setLoadingData(false);
    }
  }, [eventoId, reset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive status from form state
  useEffect(() => {
    if (saveStatus === "saving" || saveStatus === "saved" || saveStatus === "error") return;
    setSaveStatus(isDirty ? "dirty" : "clean");
  }, [isDirty, saveStatus]);

  // Beforeunload warning when dirty
  useEffect(() => {
    if (!isDirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  async function onSubmit(values: MoratConfigInput) {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/admin/evento/${eventoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al guardar");

      // Reset dirty state keeping values
      reset(values, { keepValues: true, keepDirty: false });
      setSaveStatus("saved");
      toast.success("Cambios guardados correctamente");

      // Return to clean after 2s
      setTimeout(() => setSaveStatus("clean"), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      setSaveStatus("error");
      toast.error(msg);
      // Return to dirty after 3s so user can retry
      setTimeout(() => setSaveStatus("dirty"), 3000);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin opacity-40" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Sticky action bar ── */}
        <div className="sticky top-14 z-30 border-b border-line-light dark:border-line-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Ver landing</span>
            </Link>

            <span className="text-xs font-mono opacity-40 hidden md:block">{eventoId}</span>

            <div className="flex-1" />

            <StatusBadge status={saveStatus} />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setBackupsOpen(true)}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Backups</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!isDirty || isSubmitting}
              loading={saveStatus === "saving"}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Guardar cambios</span>
            </Button>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
            <SectionNav activeSection={activeSection} onSelect={setActiveSection} />

            {/* Section order mirrors the landing, top to bottom */}
            <div className="flex flex-col gap-10 min-w-0">
              <PublicacionSection />
              <IntroSection eventoId={eventoId} />
              <MarqueeSection />
              <BeneficoSection />
              <EntradasSection eventoId={eventoId} />
              <BandaSection eventoId={eventoId} />
              <ClaimSection eventoId={eventoId} />
              <VideosSection eventoId={eventoId} />
              <FotosSection eventoId={eventoId} />
              <PatrocinadoresSection eventoId={eventoId} />
              <PieSection eventoId={eventoId} />
            </div>
          </div>
        </div>
      </form>

      <BackupsModal
        open={backupsOpen}
        onClose={() => setBackupsOpen(false)}
        eventoId={eventoId}
      />
    </FormProvider>
  );
}
