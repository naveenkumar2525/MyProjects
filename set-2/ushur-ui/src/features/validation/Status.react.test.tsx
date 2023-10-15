import { screen } from '@testing-library/react';
import Status from './Status.react';
import * as ReactDOM from "react-dom";

describe('Status', function () {
  const renderComponent = (status: string, container: any) => {
    ReactDOM.render(<Status text={status} />, container);
  };

  it('renders the status cell with active background', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    renderComponent('active', container);
    const statusElement = screen.getByText(/active/i);
    
    // Assert: check that text has a specific background color.
    expect(statusElement).toHaveClass('val-status-active');
  });
  
  it('renders the status cell with complete background', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    renderComponent('complete', container);  
    const statusElement = screen.getByText(/complete/i);
    
    // Assert: check that text has a specific background color.
    expect(statusElement).toHaveClass('val-status-complete');
  });
  
  it('renders the status cell with incomplete background', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    renderComponent('incomplete', container);  
    const statusElement = screen.getByText(/incomplete/i);
    
    // Assert: check that text has a specific background color.
    expect(statusElement).toHaveClass('val-status-incomplete');
  });
});