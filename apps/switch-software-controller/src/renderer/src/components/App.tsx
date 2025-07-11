import path from 'node:path';
import { app } from '@electron/remote';
import type React from 'react';

const dataDir = path.join(app.getPath('userData'), 'ssc-data');

function App(): React.JSX.Element {
  return (
    <>
      <h1 className="underline">Hello, Electron!</h1>
      <div>{dataDir}</div>
    </>
  );
}

export default App;
