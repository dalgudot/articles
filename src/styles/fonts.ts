import { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`
    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 100;
      src: url('/fonts/NotoSansKR-Thin.woff.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Thin.woff.woff') format('woff');
    }

    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 300;
      src: url('/fonts/NotoSansKR-Light.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Light.woff') format('woff');
    }

    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 400;
      src: url('/fonts/NotoSansKR-Regular.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Regular.woff') format('woff');
    }

    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 500;
      src: url('/fonts/NotoSansKR-Medium.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Medium.woff') format('woff');
    }

    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 700;
      src: url('/fonts/NotoSansKR-Bold.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Bold.woff') format('woff');
    }

    @font-face {
      font-family: 'Articles Text Styles';
      font-style: normal;
      font-weight: 900;
      src: url('/fonts/NotoSansKR-Black.woff2') format('woff2'),
        url('/fonts/NotoSansKR-Black.woff') format('woff');
    }
`;

export default Fonts;
