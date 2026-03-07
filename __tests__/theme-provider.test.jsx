import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/themeProvider";

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <p>Theme content</p>
      </ThemeProvider>,
    );

    expect(screen.getByText("Theme content")).toBeInTheDocument();
  });
});
