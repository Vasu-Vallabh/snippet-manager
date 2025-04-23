import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CodeEditor } from '../CodeEditor';

// Mock monaco editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ defaultValue, onChange, options }: any) => (
    <div data-testid="mock-monaco-editor">
      <textarea
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={options?.readOnly}
        data-testid="mock-editor-textarea"
      />
    </div>
  ),
}));

describe('CodeEditor', () => {
  it('renders with default props', () => {
    render(<CodeEditor code="const test = 'hello';" language="typescript" />);
    expect(screen.getByTestId('mock-monaco-editor')).toBeInTheDocument();
  });

  it('handles code changes when editable', () => {
    const mockOnChange = vi.fn();
    render(
      <CodeEditor
        code="let x = 1;"
        language="typescript"
        onChange={mockOnChange}
        editable={true}
      />
    );

    const textarea = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(textarea, { target: { value: 'let x = 2;' } });
    expect(mockOnChange).toHaveBeenCalledWith('let x = 2;');
  });

  it('respects readonly mode when not editable', () => {
    render(
      <CodeEditor
        code="const readonly = true;"
        language="typescript"
        editable={false}
      />
    );

    const textarea = screen.getByTestId('mock-editor-textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('applies custom height settings', () => {
    const { container } = render(
      <CodeEditor
        code="// test"
        language="typescript"
        maxHeight="300px"
        minHeight="100px"
      />
    );

    const editorContainer = container.firstChild as HTMLElement;
    expect(editorContainer).toHaveStyle({
      maxHeight: '300px',
      minHeight: '100px'
    });
  });
});