import { useEffect, useState } from 'react';

export type SectionMeta = {
  name: string;
  enabled: boolean;
  order_index: number;
};

let cache: SectionMeta[] | null = null;
let inflight: Promise<SectionMeta[]> | null = null;

async function fetchSections(): Promise<SectionMeta[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch('/api/content/sections-meta')
    .then((r) => (r.ok ? r.json() : { sections: [] }))
    .then((d) => {
      cache = (d?.sections as SectionMeta[]) ?? [];
      return cache;
    })
    .catch(() => {
      cache = [];
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * useSections — single fetch of section visibility/order map. Components use
 * `isVisible(name)` to decide whether to render. Defaults to TRUE while loading
 * (avoid flashing missing sections on first paint).
 */
export function useSections() {
  const [meta, setMeta] = useState<SectionMeta[] | null>(cache);
  useEffect(() => {
    let alive = true;
    fetchSections().then((m) => {
      if (alive) setMeta(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  const lookup = new Map((meta ?? []).map((s) => [s.name, s]));

  const isVisible = (name: string): boolean => {
    if (!meta) return true;
    const found = lookup.get(name);
    return found ? found.enabled : true;
  };

  return { meta, isVisible, loaded: !!meta };
}
