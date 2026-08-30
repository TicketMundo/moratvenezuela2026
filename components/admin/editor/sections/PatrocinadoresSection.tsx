"use client";
import { ArtSlotField } from "@/components/admin/editor/ArtSlotField";

interface Props {
  eventoId: string;
}

export function PatrocinadoresSection({ eventoId }: Props) {
  return (
    <section id="patrocinadores" className="flex flex-col gap-4 scroll-mt-32">
      <div>
        <h2 className="text-lg font-semibold">Patrocinadores</h2>
        <p className="text-sm opacity-60 mt-0.5">
          Banda a todo el ancho. Sin imagen se muestra un recuadro punteado de marcador.
        </p>
      </div>

      <ArtSlotField
        name="artePatrocinadores"
        eventoId={eventoId}
        title="Banner de patrocinadores"
      />
    </section>
  );
}
