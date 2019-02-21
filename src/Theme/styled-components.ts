import { ColorsInterface } from './colors';
import { VariablesInterface } from './variables';

import * as styledComponents from 'styled-components';

interface ThemeInterface {
  colors: ColorsInterface;
  variables: VariablesInterface;
}

const { default: styled, css, createGlobalStyle, keyframes, ThemeProvider } = styledComponents as styledComponents.ThemedStyledComponentsModule<ThemeInterface>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
