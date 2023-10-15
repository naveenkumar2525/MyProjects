import React from "react";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import Footer from './Footer.react';

localStorage.setItem("user", JSON.stringify({ nickName: "test-admin123" }));

describe("<Footer /> spec", () => {
  it('should contain footer tag', () => {
    const { container } = render(<Footer />);
    const footerTag = container.getElementsByTagName('footer')?.[0];
    expect(footerTag).toBeInTheDocument();
  })

  it('should contain profile icon', () => {
    const { container } = render(<Footer />);
    const profileIcon = container.querySelector('.sidebar-footer .fa-user');
    expect(profileIcon).toBeInTheDocument();
  })

  it('should contain profile name', () => {
    const { container } = render(<Footer />);
    const nickName = container.querySelector('.nickname>span')?.innerHTML;
    expect(nickName?.includes('test-admin')).toBe(true);
  })

  it('should truncate nickname when longer than 10 characters', () => {
    const { container } = render(<Footer />);
    const nickName = container.querySelector('.nickname>span')?.innerHTML;
    expect(nickName?.includes('...')).toBe(true);
  })

  it('should show tooltip when hover on nickname', async () => {
    const { container } = render(<Footer />);
    fireEvent.mouseEnter(screen.getByText('test-admin...'));
    const listNode = await waitFor(() => screen.getByText('test-admin123'));
    expect(listNode).toBeInTheDocument();
  })

  it('should contain logout button', () => {
    const { container } = render(<Footer />);
    const nickName = container.querySelector('.sidebar-footer>a')?.innerHTML;
    expect(nickName).toBe('Logout');
  })

  it('Check if the button has Logout Text', ()=> {
   render(<Footer />);
   expect(screen.getByTestId("logout-button")).toHaveTextContent("Logout");
  })

  it('Check if the Logout does not redirect to any random page ', ()=> {
    render(<Footer />);
    const linkEl = screen.getByRole('link', { name: 'Logout' });
    expect(linkEl).toHaveAttribute('href', '#');
   })

});