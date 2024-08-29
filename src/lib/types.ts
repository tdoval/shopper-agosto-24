export enum MeasureType {
  GAS = "GAS",
  WATER = "WATER",
}

export interface fetchGoogleGeminiProps {
  imageBase64: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasureType;
}
