// global.d.ts
import 'react'

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
