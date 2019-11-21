import { RenderResult } from '@testing-library/react';

export interface ICustomTestDriver<R> {
  renderSpecificDriver(): { renderResult: RenderResult } & R;
}