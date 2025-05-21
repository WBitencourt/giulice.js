import { create } from "zustand";
import { setCookie, parseCookies, destroyCookie } from 'nookies';

export interface FontSizeState {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  startFontSizeStore: () => void;
}

type Set = {
  (partial: FontSizeState | Partial<FontSizeState> | ((state: FontSizeState) => FontSizeState | Partial<FontSizeState>), replace?: false | undefined): void;
  (state: FontSizeState | ((state: FontSizeState) => FontSizeState), replace: true): void;
};
type Get = () => FontSizeState;

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 20;
const DEFAULT_FONT_SIZE = 16;

const updateDOMFontSize = (fontSize: number) => {
  document.documentElement.style.fontSize = `${fontSize}px`;
}

const increaseFontSize = (get: Get, set: Set) => () => {
  const currentSize = get().fontSize;
  const newSize = Math.min(currentSize + 1, MAX_FONT_SIZE);
  
  if (currentSize === newSize) return; // Não exceder o tamanho máximo
  
  set({ fontSize: newSize });
  updateDOMFontSize(newSize);
  
  destroyCookie(undefined, 'everest.font_size', { domain: `.${window.location.hostname}`, path: '/' });
  setCookie(null, 'everest.font_size', String(newSize), { domain: `.${window.location.hostname}`, path: '/' });
}

const decreaseFontSize = (get: Get, set: Set) => () => {
  const currentSize = get().fontSize;
  const newSize = Math.max(currentSize - 1, MIN_FONT_SIZE);
  
  if (currentSize === newSize) return; // Não diminuir além do tamanho mínimo
  
  set({ fontSize: newSize });
  updateDOMFontSize(newSize);
  
  destroyCookie(undefined, 'everest.font_size', { domain: `.${window.location.hostname}`, path: '/' });
  setCookie(null, 'everest.font_size', String(newSize), { domain: `.${window.location.hostname}`, path: '/' });
}

const startFontSizeStore = (get: Get, set: Set) => () => {
  try {
    const {'everest.font_size': cookieFontSize } = parseCookies();
    
    if (cookieFontSize) {
      const fontSize = parseInt(cookieFontSize, 10);
      if (!isNaN(fontSize) && fontSize >= MIN_FONT_SIZE && fontSize <= MAX_FONT_SIZE) {
        set({ fontSize });
        updateDOMFontSize(fontSize);
        return;
      }
    }
    
    // Valor padrão se não houver cookie ou se o valor for inválido
    set({ fontSize: DEFAULT_FONT_SIZE });
    updateDOMFontSize(DEFAULT_FONT_SIZE);
    
    destroyCookie(undefined, 'everest.font_size', { domain: `.${window.location.hostname}`, path: '/' });
    setCookie(null, 'everest.font_size', String(DEFAULT_FONT_SIZE), { domain: `.${window.location.hostname}`, path: '/' });
  } catch {
    set({ fontSize: DEFAULT_FONT_SIZE });
    updateDOMFontSize(DEFAULT_FONT_SIZE);
    
    destroyCookie(undefined, 'everest.font_size', { domain: `.${window.location.hostname}`, path: '/' });
    setCookie(null, 'everest.font_size', String(DEFAULT_FONT_SIZE), { domain: `.${window.location.hostname}`, path: '/' });
  }
}

export const useFontSizeStore = create<FontSizeState>((set, get) => {
  return {
    fontSize: DEFAULT_FONT_SIZE,
    increaseFontSize: increaseFontSize(get, set),
    decreaseFontSize: decreaseFontSize(get, set),
    startFontSizeStore: startFontSizeStore(get, set),
  }
}) 