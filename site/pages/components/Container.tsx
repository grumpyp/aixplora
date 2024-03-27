import { HTMLAttributes } from "react";

type ContainerProps = {} & HTMLAttributes<HTMLElement>;

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <section className={`max-w-7xl px-[6%] mx-auto ${className}`} {...props}>
      {children}
    </section>
  );
}
