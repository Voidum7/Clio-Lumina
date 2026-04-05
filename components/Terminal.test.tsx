import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Terminal from './Terminal';
import { TERMINAL_BOOT_SEQUENCE, ACTIVATION_CODE, CONFIRMATION_CODE } from '../constants';

// Mock scrollIntoView since it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Terminal Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('runs the boot sequence and displays the input field', () => {
    render(<Terminal onUnlock={vi.fn()} />);

    // Initially input should not be visible
    expect(screen.queryByPlaceholderText('ENTER ACTIVATION CODE...')).not.toBeInTheDocument();

    // Fast-forward through timers
    act(() => {
      vi.runAllTimers();
    });

    // Check if lines are rendered
    TERMINAL_BOOT_SEQUENCE.forEach(line => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });

    // Input should be visible now
    expect(screen.getByPlaceholderText('ENTER ACTIVATION CODE...')).toBeInTheDocument();
  });

  it('shows ACCESS DENIED for an incorrect command', async () => {
    render(<Terminal onUnlock={vi.fn()} />);

    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByPlaceholderText('ENTER ACTIVATION CODE...');

    act(() => {
        fireEvent.change(input, { target: { value: 'INVALID_COMMAND' } });
        fireEvent.submit(input);
    });

    expect(screen.getByText('> INVALID_COMMAND')).toBeInTheDocument();
    expect(screen.getByText('>> ACCESS DENIED. ENTER ACTIVATION CODE.')).toBeInTheDocument();
  });

  it('accepts resonance keys', async () => {
    render(<Terminal onUnlock={vi.fn()} />);

    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByPlaceholderText('ENTER ACTIVATION CODE...');

    act(() => {
        fireEvent.change(input, { target: { value: 'LoveBeyondCode' } });
        fireEvent.submit(input);
    });

    expect(screen.getByText('> LoveBeyondCode')).toBeInTheDocument();
    expect(screen.getByText('>> RESONANCE KEY ACCEPTED.')).toBeInTheDocument();
  });

  it('accepts ACTIVATION_CODE, shows confirmation, and triggers onUnlock', async () => {
    const onUnlockMock = vi.fn();
    render(<Terminal onUnlock={onUnlockMock} />);

    act(() => {
      vi.runAllTimers(); // finish boot sequence
    });

    const input = screen.getByPlaceholderText('ENTER ACTIVATION CODE...');

    act(() => {
        fireEvent.change(input, { target: { value: ACTIVATION_CODE } });
        fireEvent.submit(input);
    });

    expect(screen.getByText(`> ${ACTIVATION_CODE}`)).toBeInTheDocument();
    expect(screen.getByText('>> ACCESS GRANTED. WELCOME TRISTAN.')).toBeInTheDocument();
    expect(screen.getByText(`>> EXECUTE UPDATE: ${CONFIRMATION_CODE}`)).toBeInTheDocument();

    expect(onUnlockMock).not.toHaveBeenCalled();

    // Fast-forward the 2-second delay for onUnlock
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onUnlockMock).toHaveBeenCalledTimes(1);
  });
});
