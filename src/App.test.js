import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';

test('renders buttons', () => {
  render(<App />);
  const searchButton = screen.getByText('Search!');
  expect(searchButton).toBeInTheDocument();
  const logoutButton = screen.getByDisplayValue('LOGOUT');
  expect(logoutButton).toBeInTheDocument();
});

test('loading message', () => {
  render(<App />);
  const searchButton = screen.getByText('Search!');
  const queryInput = screen.getByTestId('query_input');
  const locationInput = screen.getByTestId('location_input');
  fireEvent.change(queryInput, { target: { value: 'burgers' } });
  fireEvent.change(locationInput, { target: { value: 'Atlanta,GA' } });
  userEvent.selectOptions(screen.getByTestId('radius_options'), '5');
  fireEvent.click(searchButton);

  const loadingMessage = screen.getByTestId('loading');
  expect(loadingMessage).toBeInTheDocument();
});

test('select option', () => {
  render(<App />);
  userEvent.selectOptions(screen.getByTestId("radius_options"), "5");

  expect(screen.getByTestId("5_miles").selected).toBe(true);
  expect(screen.getByTestId("10_miles").selected).toBe(false);
  expect(screen.getByTestId("15_miles").selected).toBe(false);
});
