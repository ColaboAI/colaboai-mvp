import * as React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ResultLine from '.';

test('should render', () => {
  render(
    <ResultLine
      title="Mock_Title"
      singer="Mock_Author"
      view={100}
      likes={1000}
      onLineClicked={() => {}}
      onSingerClicked={() => {}}
      onPlayClicked={() => {}}
    />,
  );
  expect(screen.getByTestId('ResultLine')).toBeTruthy();
});
