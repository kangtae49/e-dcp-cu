
import {Api} from "./preload";

/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
declare global {
  interface Window {
    api: Api
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App'
import { toJS } from 'mobx';
import {container} from "@/inversify.config.ts";
import {Provider} from "inversify-react";
// import {DndProvider} from "react-dnd";
// import {HTML5Backend} from "react-dnd-html5-backend";
// (window as any).toJS = toJS;

// import {container} from "@/inversify.config.ts";
// if (process.env.NODE_ENV === 'development') {
//   (window as any).container = container;
//   (window as any).toJS = toJS;
// }

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider container={container}>
      {/*<DndProvider backend={ HTML5Backend }>*/}
        <App />
      {/*</DndProvider>*/}
    </Provider>
  </StrictMode>,
)