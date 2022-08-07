import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { HotkeysProvider } from "@blueprintjs/core";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>
);
