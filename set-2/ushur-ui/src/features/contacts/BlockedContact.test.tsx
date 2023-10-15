import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlockedContact from "./BlockedContact.react";
import userEvent from '@testing-library/user-event';

const blockListedProps = {
  user: {
    updateTimestamp: ''
  }
};

const blockListedByUserProps = {
  user: {
    updateTimestamp: '',
    isUserInitiated: 'Yes'
  }
};

test('should display blocklist icon when contact is blocklisted', () => {
  render(<BlockedContact {...blockListedProps} />);
  const element = screen.getByRole(/blocklistIcon/i);
  expect(element).toBeInTheDocument();
});

it('should display tooltip when hover on icon', async () => {
  render(<BlockedContact {...blockListedProps} />);
  const element = screen.getByRole(/blocklistIcon/i);
  userEvent.hover(element);
  const tooltip = await waitFor(() => screen.getByRole('tooltip'));
  expect(tooltip).toBeInTheDocument();
});

test('should display initiated by when blocklisted by user', async () => {
  render(<BlockedContact {...blockListedByUserProps} />);
  const element = screen.getByRole(/blocklistIcon/i);
  userEvent.hover(element);
  const ele = await waitFor(() => screen.getByText(/Initiated by: End-user/i));
  expect(ele).toBeInTheDocument();
});