'use client'

import { useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'motion/react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className={className}>
        <m.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {children}
        </m.div>
      </div>
    </LazyMotion>
  )
}

function MotionItem({
  children,
  index,
  className,
}: {
  children: React.ReactNode
  index: number
  className?: string
}) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div variants={fadeUp} custom={index} className={className}>
        {children}
      </m.div>
    </LazyMotion>
  )
}

export { AnimatedSection, MotionItem, fadeUp }
