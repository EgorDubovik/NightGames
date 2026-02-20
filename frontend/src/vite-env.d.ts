/// <reference types="vite/client" />

interface LucideApi {
  createIcons: () => void;
}

interface Window {
  lucide?: LucideApi;
}