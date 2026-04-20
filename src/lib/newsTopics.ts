/**
 * News topic labels (shown on cards and filter chips). Order = filter chip order after "All".
 */
export const NEWS_TOPIC_OPTIONS = [
  "Species & nomenclature",
  "Consulting & EIA",
  "Climate",
  "Policy & law",
  "Conservation",
  "Land & water",
  "Marine",
  "Energy",
  "Science & research",
  "Indigenous & country",
  "Careers & education",
  "Waste & circular",
] as const;

export type NewsTopic = (typeof NEWS_TOPIC_OPTIONS)[number];

const ALL_TOPICS = new Set<string>(NEWS_TOPIC_OPTIONS);

/** Infer topic from headline + excerpt. First matching rule wins (most specific first). */
export function inferNewsTopic(title: string, summary: string): NewsTopic {
  const t = `${title} ${summary}`.toLowerCase();

  // Taxonomy, flora/fauna naming, formal nomenclature changes
  if (
    /\b(nomenclature|taxonomic|taxonom|synonym|synonymy|renamed|reclassified|reclassification|new species|species name|botanical name|scientific name|valid name|basionym|combinatio nova|nomen novum|epithet|genus\b|subspecies|infraspecific|taxon\b|phylogen|phylogeny|described species|newly described|formally named|species described|flora of|fauna of|checklist|plant census|apc\b|iczn|icnafp|herbarium|type specimen|voucher)\b/.test(t) ||
    /\b(australian plant census|international code of nomenclature)\b/.test(t)
  ) {
    return "Species & nomenclature";
  }

  // Environmental consulting, assessment, remediation, industry practice
  if (
    /\b(environmental consulting|environment consultant|eia\b|eis\b|environmental impact (?:statement|assessment)|impact assessment|strategic environmental|remediation|contaminated (?:land|site)|site investigation|due diligence|phase\s*[12]|esg\b.*(?:report|disclos|audit)|life[- ]cycle assessment|lca\b|as\s*4708|as\s*1940|environmental audit)\b/.test(t) ||
    /\b(consulting (?:firm|sector)|environmental services|impact assessor)\b/.test(t)
  ) {
    return "Consulting & EIA";
  }

  if (
    /\b(climate\b|emissions?|carbon\b|net[- ]zero|methane|paris agreement|cop\d{2}|warming|decarbon|greenhouse)\b/.test(t)
  ) {
    return "Climate";
  }

  if (
    /\b(parliament|legislation|regulation|minister|policy\b|government|court\b|litigation|lawsuit|judicial review|environmental law|planning law|compliance|enforcement)\b/.test(t)
  ) {
    return "Policy & law";
  }

  if (
    /\b(aboriginal|first nations|indigenous|traditional owners?|native title|country\b.*(?:heal|burn|care))\b/.test(t)
  ) {
    return "Indigenous & country";
  }

  if (
    /\b(conservation|biodiversity|wildlife|threatened species|habitat|national park|protected area|endangered|extinction|ranger\b|landcare|restoration|revegetation|bush regeneration)\b/.test(t)
  ) {
    return "Conservation";
  }

  if (
    /\b(hydrolog|catchment|river\b|wetland|groundwater|stormwater|flood|drought|soil\b|erosion|land use|revegetation|revegetate|salinity|acid sulfate)\b/.test(t)
  ) {
    return "Land & water";
  }

  if (/\b(reef|marine\b|ocean|coral|estuary|coastal|saltmarsh|fisheries|aquatic)\b/.test(t)) {
    return "Marine";
  }

  if (/\b(renewable|solar|wind farm|battery|grid|transmission|energy transition|offshore wind)\b/.test(t)) {
    return "Energy";
  }

  if (
    /\b(research\b|study finds|journal\b|peer[- ]review|field trial|monitoring program|survey data|modelling|university|CSIRO|peer reviewed)\b/.test(t)
  ) {
    return "Science & research";
  }

  if (
    /\b(career|graduate|internship|asrs|disclosure|professional development|skills|workforce|hiring)\b/.test(t)
  ) {
    return "Careers & education";
  }

  if (/\b(waste\b|circular economy|recycling|landfill|plastic pollution|compost)\b/.test(t)) {
    return "Waste & circular";
  }

  return "Science & research";
}

/** Normalize unknown topic strings (e.g. legacy data) to a valid chip label. */
export function coerceNewsTopic(raw: string | undefined | null): NewsTopic {
  const s = (raw || "").trim();
  if (ALL_TOPICS.has(s)) return s as NewsTopic;
  // Map old 5-topic set
  const legacy: Record<string, NewsTopic> = {
    Policy: "Policy & law",
    Marine: "Marine",
    Energy: "Energy",
    Conservation: "Conservation",
    Careers: "Careers & education",
  };
  if (legacy[s]) return legacy[s];
  return "Science & research";
}
