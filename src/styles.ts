import { createGlobalStyle } from 'styled-components';

export const colors = {
    container: '#000000',
    card: '#1e181c',
    fontPrimary: '#eaeaea',
    fontSecondary: '#ffffffb3',
    fontActive: '#3b40d5',
    star: '#f5c518',
    starHover: '#8b7113',
};

export const fonts = {
    mono: `ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
        'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
        'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace`,
};

export const GlobalStyle = createGlobalStyle`
  html, body {
    min-height: 100vh;
    min-width: 100vw;
    margin: 0;
    padding: 0;
    font-family: ${fonts.mono};
    background: ${colors.container};
    color: ${colors.fontPrimary};
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  h1, h2, h3, h4, h5, h6, p, button, input, textarea {
    font-family: ${fonts.mono};
  }
`;

export const PageContainer = `
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background: ${colors.container};
`;
