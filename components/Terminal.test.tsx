import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Terminal from './Terminal';
import { TERMINAL_BOOT_SEQUENCE, ACTIVATION_CODE, CONFIRMATION_CODE } from '../constants';
import { vi } from 'vitest';

describe('Terminal', () => {
  const mockOnUnlock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    mockOnUnlock.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('renders boot sequence initially', async () => {
    render(<Terminal onUnlock={mockOnUnlock} />);

    // Fast forward through the boot sequence delays
    act(() => {
      vi.advanceTimersByTime(TERMINAL_BOOT_SEQUENCE.length * 400);
    });

    for (const line of TERMINAL_BOOT_SEQUENCE) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  test('renders input form after boot sequence', async () => {
    render(<Terminal onUnlock={mockOnUnlock} />);

    expect(screen.queryByPlaceholderText('ENTER ACTIVATION CODE...')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(TERMINAL_BOOT_SEQUENCE.length * 400);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('ENTER ACTIVATION CODE...')).toBeInTheDocument();
    });
  });

  test('handles incorrect activation code', async () => {
    render(<Terminal onUnlock={mockOnUnlock} />);

    act(() => {
      vi.advanceTimersByTime(TERMINAL_BOOT_SEQUENCE.length * 400);
    });

    const input = await screen.findByPlaceholderText('ENTER ACTIVATION CODE...');

    const user = userEvent.setup({ delay: null });
    await user.type(input, 'WRONG_CODE{Enter}');

    expect(screen.getByText('> WRONG_CODE')).toBeInTheDocument();
    expect(screen.getByText('>> ACCESS DENIED. ENTER ACTIVATION CODE.')).toBeInTheDocument();
    expect(mockOnUnlock).not.toHaveBeenCalled();
  });

  test('handles resonance keys', async () => {
    render(<Terminal onUnlock={mockOnUnlock} />);

    act(() => {
      vi.advanceTimersByTime(TERMINAL_BOOT_SEQUENCE.length * 400);
    });

    const input = await screen.findByPlaceholderText('ENTER ACTIVATION CODE...');

    const user = userEvent.setup({ delay: null });
    await user.type(input, 'LoveBeyondCode{Enter}');

    expect(screen.getByText('> LoveBeyondCode')).toBeInTheDocument();
    expect(screen.getByText('>> RESONANCE KEY ACCEPTED.')).toBeInTheDocument();
    expect(mockOnUnlock).not.toHaveBeenCalled();
  });

  test('handles correct activation code', async () => {
    render(<Terminal onUnlock={mockOnUnlock} />);

    act(() => {
      vi.advanceTimersByTime(TERMINAL_BOOT_SEQUENCE.length * 400);
    });

    const input = await screen.findByPlaceholderText('ENTER ACTIVATION CODE...');

    const user = userEvent.setup({ delay: null });
    await user.type(input, `${ACTIVATION_CODE}{Enter}`);

    expect(screen.getByText(`> ${ACTIVATION_CODE}`)).toBeInTheDocument();
    expect(screen.getByText('>> ACCESS GRANTED. WELCOME TRISTAN.')).toBeInTheDocument();
    expect(screen.getByText(`>> EXECUTE UPDATE: ${CONFIRMATION_CODE}`)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockOnUnlock).toHaveBeenCalledTimes(1);
  });
});
