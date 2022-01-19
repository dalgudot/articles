import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html,
    body {
      padding: 0;
      margin: 0;
      background-color: var(--bg);
      color: var(--fg);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    * {
      padding: 0;
      margin: 0;
      outline-style: none;
      box-sizing: border-box;
      font-family: 'Articles Text Styles', Apple SD Gothic Neo, Noto Sans KR, Inter,
        system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
        Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif;
    }

    code {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
        Bitstream Vera Sans Mono, Courier New, monospace;
      padding: 4px;
      background-color: #bdbdbd;
      border-radius: 4px;
    }
`;

export default GlobalStyle;
