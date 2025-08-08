import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root{
    --bg: #f8fafc;             /* page background (slate-50) */
    --surface: #ffffff;         /* cards, tables */
    --text: #0f172a;            /* main text (slate-900) */
    --muted: #64748b;           /* secondary text (slate-500) */
    --accent: #6366f1;          /* indigo-500 */
    --accent-contrast: #1e1b4b; /* deep indigo */
    --ring: #e5e7eb;            /* borders (slate-200) */
  }

  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
  }

  html, body, #root { height: 100%; }

  body{
    background: var(--bg);
    color: var(--text);
    font-size: 1.2rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a { color: var(--accent); }
  a:hover { text-decoration: underline; }

  /* Scrollbar (WebKit) */
  body::-webkit-scrollbar{
    width: 8px;
  }
  body::-webkit-scrollbar-thumb{
    background-color: #cbd5e1; /* slate-300 */
    border-radius: 10px;
  }
  body::-webkit-scrollbar-track{
    background-color: #f1f5f9; /* slate-100 */
  }

  table { border-collapse: collapse; }
`;

export default GlobalStyle;
