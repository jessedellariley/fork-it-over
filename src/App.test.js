import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';

test('Tests the buttons and images', () => {
  render(<App />);
  const searchButton = screen.getByAltText('search-button');
  expect(searchButton).toBeInTheDocument();
  const logoutButton = screen.getByAltText('log-out');
  expect(logoutButton).toBeInTheDocument();
  const logo = screen.getByAltText('logo');
  expect(logo).toBeInTheDocument();
  
});

test('Testing invalid radius entry', () => {
  render(<App />);
  const searchButton = screen.getByAltText('search-button');
  const queryInput = screen.getByTestId('query_input');
  const locationInput = screen.getByTestId('location_input');
  const radius = screen.getByPlaceholderText('radius in miles');
  fireEvent.change(queryInput, { target: { value: 'Boba' } });
  fireEvent.change(locationInput, { target: { value: 'Doraville' } });
  fireEvent.change(radius, { target: { value: '55' } });
  fireEvent.click(searchButton);
  const loadingMessage = screen.getByTestId('loading');
  expect(loadingMessage).toBeInTheDocument();
});

test('Making sure placeholder texts is in all text fields', () => {
  render(<App />);
  const radius = screen.getByPlaceholderText('radius in miles');
  const food = screen.getByPlaceholderText('ramen, cheap dinner, Thai');
  const location = screen.getByPlaceholderText('address, neighborhood, city, state or zip');
  expect(radius).toBeInTheDocument();
  expect(food).toBeInTheDocument();
  expect(location).toBeInTheDocument();
});