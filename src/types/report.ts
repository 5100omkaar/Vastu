export interface RoomScore {
  room: string;
  score: number;
  direction: string;
  element: string;
  status: "good" | "warning" | "bad" | string;
}

export interface Recommendation {
  priority: "high" | "medium" | "low" | string;
  title: string;
  description: string;
  room?: string;
}

export interface ElementHarmony {
  fire: number;
  water: number;
  earth: number;
  air: number;
  space: number;
  [key: string]: number;
}

export interface VastuReportData {
  overall_score: number;
  summary: string;
  room_scores: RoomScore[];
  recommendations: Recommendation[];
  element_harmony: ElementHarmony;
}

export interface Report {
  id: string;
  image_url: string;
  overall_score: number | null;
  created_at: string;
  report_data: VastuReportData;
}
