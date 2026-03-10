import { contextBridge, ipcRenderer } from 'electron';

const api = {
	startNetflixLogin: () => ipcRenderer.invoke('netflix:login'),
	launchDisney: () => ipcRenderer.invoke('disney:launch'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
