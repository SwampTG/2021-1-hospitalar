import { createTheme } from '@material-ui/core/styles'
import { purple, deepPurple } from '@material-ui/core/colors'

/**
 * Tema usado no aplicativo.
 * Foi ativado na página index.tsx
 *
 * @see https://material-ui.com/customization/theming/#api
 */
export const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: purple,
  },
})
