import { Locator, Page, expect } from '@playwright/test';
import testData from '../test-data/testData.json';

export interface errorDescription {
  element: Locator;
  errorKey: keyof typeof testData.errorDescriptions
};

export interface products {
  name: string;
  count: number
};
