import Providers from './providers';
import AppRoutes from './routers';

const App = () => {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
};

export default App;
