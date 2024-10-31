
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import ChatInterface from '../../components/chat/chatInterface';
import { mockHandlers } from '../setup/test-utils';

describe('ChatInterface', () => {
  it('renders input field', () => {
    render(<ChatInterface />);
    expect(screen.getByPlaceholderText(/ask about your energy/i)).toBeInTheDocument();
  });

  it('handles message submission', async () => {
    const { onQuerySubmit } = mockHandlers;
    render(<ChatInterface onQuerySubmit={onQuerySubmit} />);
    
    const input = screen.getByPlaceholderText(/ask about your energy/i);
    fireEvent.change(input, { target: { value: 'How much energy did I use yesterday?' } });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() => {
      expect(onQuerySubmit).toHaveBeenCalledWith('How much energy did I use yesterday?');
    });
  });

  it('shows error message on invalid input', async () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/ask about your energy/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText(/send/i));

    expect(screen.getByText(/please enter a query/i)).toBeInTheDocument();
  });
});
