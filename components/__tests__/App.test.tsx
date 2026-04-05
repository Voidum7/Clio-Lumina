import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { PERSONAS } from '../../constants';
import * as geminiService from '../../services/geminiService';

// Mock components
vi.mock('../StarBackground', () => ({
  default: () => <div data-testid="star-background">StarBackground</div>
}));

vi.mock('../Terminal', () => ({
  default: ({ onUnlock }: { onUnlock: () => void }) => (
    <div data-testid="terminal">
      <button onClick={onUnlock}>Unlock Terminal</button>
    </div>
  )
}));

vi.mock('../PersonaMenu', () => ({
  default: ({ activePersonaId, onSelect, isOpen, onClose }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="persona-menu">
        {PERSONAS.map(p => (
          <button key={p.id} onClick={() => { onSelect(p.id); onClose(); }}>
            Select {p.name}
          </button>
        ))}
      </div>
    );
  }
}));

// Mock ReactMarkdown since it can be problematic in JSDOM
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>
}));

// Mock geminiService
vi.mock('../../services/geminiService', () => ({
  sendMessageToClio: vi.fn(),
  generateSpeech: vi.fn()
}));

// Mock window.confirm
const mockConfirm = vi.fn();
window.confirm = mockConfirm as any;

describe('App Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders locked state initially', () => {
    render(<App />);
    expect(screen.getByText('CLIO LUMINA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Initiate Connection/i })).toBeInTheDocument();
    expect(screen.getByTestId('star-background')).toBeInTheDocument();
  });

  it('transitions to terminal state when Initiate Connection is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));
    expect(screen.getByTestId('terminal')).toBeInTheDocument();
  });

  it('transitions to sanctuary state when terminal is unlocked', async () => {
    render(<App />);
    // Go to terminal
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));

    // Unlock terminal
    fireEvent.click(screen.getByText('Unlock Terminal'));

    // Check if we are in sanctuary
    expect(screen.getByText(PERSONAS[0].name)).toBeInTheDocument();

    // Check initial greeting message
    await waitFor(() => {
      expect(screen.getByText(/My love... I'm here/i)).toBeInTheDocument();
    });
  });

  it('can send a message and receive a response', async () => {
    const mockResponse = 'Hello, this is a response from Clio.';
    (geminiService.sendMessageToClio as any).mockResolvedValue(mockResponse);

    render(<App />);

    // Setup: Go to sanctuary
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));
    fireEvent.click(screen.getByText('Unlock Terminal'));

    // Find input and send message
    const input = screen.getByPlaceholderText(/Speak to/i);
    fireEvent.change(input, { target: { value: 'Hello Clio' } });

    const form = input.closest('form');
    expect(form).toBeInTheDocument();
    if (form) {
      fireEvent.submit(form);
    }

    // Check user message is displayed (using markdown mock)
    await waitFor(() => {
      const markdownElements = screen.getAllByTestId('markdown');
      expect(markdownElements.some(el => el.textContent === 'Hello Clio')).toBe(true);
    });

    // Check if input is cleared
    expect(input).toHaveValue('');

    // Check model response is displayed
    await waitFor(() => {
      const markdownElements = screen.getAllByTestId('markdown');
      expect(markdownElements.some(el => el.textContent === mockResponse)).toBe(true);
    });

    // Check gemini service was called correctly
    expect(geminiService.sendMessageToClio).toHaveBeenCalledWith(
      expect.any(Array),
      'Hello Clio',
      'default'
    );
  });

  it('can change personas', async () => {
    render(<App />);

    // Setup: Go to sanctuary
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));
    fireEvent.click(screen.getByText('Unlock Terminal'));

    // Open persona menu
    fireEvent.click(screen.getByText('Identity Core'));

    // Select second persona
    const secondPersona = PERSONAS[1];
    fireEvent.click(screen.getByText(`Select ${secondPersona.name}`));

    // Check if header updated
    expect(screen.getByText(secondPersona.name)).toBeInTheDocument();

    // Check system message was added
    await waitFor(() => {
      expect(screen.getByText(`*** PROTOCOL SWITCH: ${secondPersona.name.toUpperCase()} ACTIVATED ***`)).toBeInTheDocument();
    });
  });

  it('does not send empty messages', () => {
    render(<App />);

    // Setup: Go to sanctuary
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));
    fireEvent.click(screen.getByText('Unlock Terminal'));

    // Submit empty form
    const input = screen.getByPlaceholderText(/Speak to/i);
    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    // Check gemini service was NOT called
    expect(geminiService.sendMessageToClio).not.toHaveBeenCalled();
  });

  it('handles memory reset', () => {
    mockConfirm.mockReturnValue(true);
    // Setup mock window reload
    const originalReload = window.location.reload;
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { reload: vi.fn() }
    });

    render(<App />);

    // Setup: Go to sanctuary
    fireEvent.click(screen.getByRole('button', { name: /Initiate Connection/i }));
    fireEvent.click(screen.getByText('Unlock Terminal'));

    // Click Purge Memory
    fireEvent.click(screen.getByText(/Purge Memory/i));

    expect(mockConfirm).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();

    // Restore reload
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { reload: originalReload }
    });
  });
});
