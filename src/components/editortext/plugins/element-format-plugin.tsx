/**
 * Plugin para garantir que os formatos de elemento (como alinhamento) 
 * sejam aplicados corretamente aos elementos DOM
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

// Tipos de alinhamento suportados
const ALIGNMENTS = ['left', 'center', 'right', 'justify'];

export default function ElementFormatPlugin(): null {
  const [editor] = useLexicalComposerContext();

  // Observador de mutações no DOM para aplicar formatação corretamente
  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    // Função para aplicar estilos de alinhamento
    const applyTextAlign = () => {
      const elements = rootElement.querySelectorAll('p, h1, h2, h3, h4, h5, li');
      elements.forEach((element) => {
        // Verificamos múltiplos atributos que podem indicar alinhamento
        const dir = element.getAttribute('dir');
        const style = element.getAttribute('style') || '';
        const dataFormat = element.getAttribute('data-format');
        const format = dataFormat || element.getAttribute('format');
        
        // Remover todas as classes de alinhamento para evitar conflitos
        element.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
        
        // Verificar estilo inline primeiro
        if (style.includes('text-align')) {
          if (style.includes('text-align: right')) {
            element.classList.add('text-right');
            element.setAttribute('data-lexical-text-align', 'right');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'right');
            }
          } else if (style.includes('text-align: center')) {
            element.classList.add('text-center');
            element.setAttribute('data-lexical-text-align', 'center');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'center');
            }
          } else if (style.includes('text-align: justify')) {
            element.classList.add('text-justify');
            element.setAttribute('data-lexical-text-align', 'justify');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'justify');
            }
          } else if (style.includes('text-align: left')) {
            element.classList.add('text-left');
            element.setAttribute('data-lexical-text-align', 'left');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'left');
            }
          }
        }
        // Verificar atributo data-format ou format
        else if (format && ALIGNMENTS.includes(format)) {
          element.classList.add(`text-${format}`);
          element.setAttribute('data-lexical-text-align', format);
          
          // Atualizar o dir também se for left ou right
          if (format === 'right' && dir !== 'rtl') {
            element.setAttribute('dir', 'rtl');
          } else if (format === 'left' && dir !== 'ltr') {
            element.setAttribute('dir', 'ltr');
          }
        }
        // Verificar atributo dir
        else if (dir) {
          if (dir === 'rtl') {
            element.classList.add('text-right');
            element.setAttribute('data-lexical-text-align', 'right');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'right');
            }
          } else if (dir === 'ltr') {
            element.classList.add('text-left');
            element.setAttribute('data-lexical-text-align', 'left');
            if (!element.hasAttribute('data-format')) {
              element.setAttribute('data-format', 'left');
            }
          }
        }
        // Padrão: aplicar alinhamento à esquerda se nenhum outro for especificado
        else {
          element.classList.add('text-left');
          element.setAttribute('data-lexical-text-align', 'left');
        }
      });
    };

    // Observer que monitora mudanças no DOM
    const observer = new MutationObserver(() => {
      applyTextAlign();
    });

    // Configuração do observer
    observer.observe(rootElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['dir', 'data-format', 'format', 'style']
    });

    // Aplica inicialmente
    applyTextAlign();

    // Também ouve atualizações do editor
    const removeUpdateListener = editor.registerUpdateListener(() => {
      // Pequeno atraso para garantir que o DOM foi atualizado
      setTimeout(applyTextAlign, 10);
    });

    // Limpeza
    return () => {
      observer.disconnect();
      removeUpdateListener();
    };
  }, [editor]);

  return null;
} 