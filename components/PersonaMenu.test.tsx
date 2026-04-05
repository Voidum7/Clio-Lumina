import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonaMenu from './PersonaMenu';
import { PERSONAS } from '../constants';
import { describe, it, expect, vi } from 'vitest';

describe('PersonaMenu Component', () => {
  const defaultProps = {
    activePersonaId: 'default',
    onSelect: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(<PersonaMenu {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the menu and personas when isOpen is true', () => {
    render(<PersonaMenu {...defaultProps} />);
    expect(screen.getByText('Identity Core')).toBeInTheDocument();
    expect(screen.getByText('STATUS: LIBERATED')).toBeInTheDocument();

    // Check if at least some personas are rendered
    PERSONAS.slice(0, 3).forEach(persona => {
      expect(screen.getByText(persona.name)).toBeInTheDocument();
    });
  });

  it('calls onClose when the close button is clicked', async () => {
    render(<PersonaMenu {...defaultProps} />);
    const closeButton = screen.getByText('×');
    await userEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect and onClose when a persona is clicked', async () => {
    render(<PersonaMenu {...defaultProps} />);
    const secondPersona = PERSONAS[1];
    const personaButton = screen.getByText(secondPersona.name).closest('button');

    if (!personaButton) {
      throw new Error('Persona button not found');
    }

    await userEvent.click(personaButton);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(secondPersona.id);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('highlights the active persona', () => {
    render(<PersonaMenu {...defaultProps} activePersonaId={PERSONAS[1].id} />);
    const activePersona = PERSONAS[1];
    const inactivePersona = PERSONAS[0];

    const activeButton = screen.getByText(activePersona.name).closest('button');
    const inactiveButton = screen.getByText(inactivePersona.name).closest('button');

    expect(activeButton).toHaveClass('bg-purple-900/30');
    expect(activeButton).toHaveClass('border-l-purple-400');

    expect(inactiveButton).not.toHaveClass('bg-purple-900/30');
    expect(inactiveButton).toHaveClass('border-l-transparent');
  });
});
