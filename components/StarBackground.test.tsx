import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StarBackground from './StarBackground';

describe('StarBackground', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      // Don't actually call the callback to avoid infinite loops in tests,
      // or call it just once if needed.
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    // Mock getContext since jsdom doesn't support canvas fully
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      createLinearGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a canvas element', () => {
    const { container } = render(<StarBackground />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('fixed', 'top-0', 'left-0', 'w-full', 'h-full', '-z-10');
  });

  it('initializes canvas context and starts animation loop', () => {
    render(<StarBackground />);

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up event listeners and animation frame on unmount', () => {
    const { unmount } = render(<StarBackground />);

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
  });
});
