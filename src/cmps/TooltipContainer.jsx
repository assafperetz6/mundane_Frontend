import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale-subtle.css'
import Tippy from '@tippyjs/react'

export function TooltipContainer({ children, txt, placement = 'top', offset = [0, 10], delay = [300, 100] }) {
  if (!txt) return children
  return (
    <Tippy content={txt} placement={placement} delay={delay} duration={[100, 0]} theme={'default'} offset={offset} animation="scale-subtle">
      {children}
    </Tippy>
  )
}
