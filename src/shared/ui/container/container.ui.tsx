import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from '@mantine/core';

interface ContainerProps extends MantineContainerProps {
  children: React.ReactNode;
}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <MantineContainer
      maw={{
        xs: '100%',
        md: 980,
        xl: 1172,
      }}
      px={{
        xs: 12,
        md: 0,
      }}
      {...props}
    >
      {children}
    </MantineContainer>
  );
};

export default Container;
