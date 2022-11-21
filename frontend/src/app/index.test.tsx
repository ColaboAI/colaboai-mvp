import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { App } from './index';

describe('<App />', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByTestId('App')).toBeTruthy();
  });
});
