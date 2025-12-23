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
        md: 1172,
        xl: 1440,
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
