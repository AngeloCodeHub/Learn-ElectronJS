import { contextBridge, ipcRenderer } from 'electron';

const api = {
	startNetflixLogin: () => ipcRenderer.invoke('netflix:login'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
