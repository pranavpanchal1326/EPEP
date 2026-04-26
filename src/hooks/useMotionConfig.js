import { useReducedMotion } from 'framer-motion'

export const useMotionConfig = () => {
  const shouldReduceMotion = useReducedMotion()
  return {
    transition: shouldReduceMotion ? { duration: 0 } : undefined,
    disableTranslation: shouldReduceMotion,
    custom: { reduced: shouldReduceMotion }
  }
}