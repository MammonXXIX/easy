import { useInView } from 'react-intersection-observer';

type InfiniteScrollContainerProps = {
  children: React.ReactNode,
  onBottomReached: () => void,
  classname?: string
}

const InfiniteScrollContainer = ({ children, onBottomReached, classname }: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    rootMargin: "50px",
    onChange(inView) {
      if (inView) onBottomReached()
    }
  })

  return (
    <div className={classname}>
      {children}
      <div ref={ref} />
    </div>
  )
}

export default InfiniteScrollContainer
