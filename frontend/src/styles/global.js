import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }
  
  body {
    margin-top: 5%;
    background-color: #f2f2f2;
  }
`;

export default Global;
