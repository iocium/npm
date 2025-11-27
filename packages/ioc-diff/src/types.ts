/**
 * Represents a single Indicator of Compromise (IOC).
 */
export type IOC = {
  value: string;
  type?: string;
  tags?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
};

/**
 * The result of comparing two sets of IOCs.
 */
export type IOCDiffResult = {
  added: IOC[];
  removed: IOC[];
  changed: { before: IOC; after: IOC }[];
};

/**
 * Options to customize IOC diff behavior.
 */
export type DiffOptions = {
  matchBy?: 'value' | 'value+type';
  compareTags?: boolean;
  compareSeverity?: boolean;
  fuzzyMatch?: boolean;
  fuzzyThreshold?: number;
};