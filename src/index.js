import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Importe o ThirdWeb
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';

// Inclua que redes você quer dar suporte.
// 5 = Goerli.
const activeChainId = ChainId.Goerli;

// Por último, envolva o App com o thirdweb provider.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
);