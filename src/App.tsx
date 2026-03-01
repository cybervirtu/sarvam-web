import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import AppRouter from './app/router';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
