/**
 * Plugin para inicializar o editor com conteúdo HTML
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';

type InitialHtmlPluginProps = {
  initialHtml: string;
};

export default function InitialHtmlPlugin({ initialHtml }: InitialHtmlPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if(!editor) {
      return;
    }

    if (!initialHtml || initialHtml.trim() === '') {
      return;
    }

    // Inicializa o editor com o HTML quando o componente é montado
    editor.update(() => {
      // Pré-processamento do HTML para preservar alinhamentos antes de converter
      let processedHtml = initialHtml;
      
      // Criar um elemento temporário para processar o HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = initialHtml;
      
      // Encontrar todos os elementos que podem ter alinhamento
      const elementsWithAlignment = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, li, div');
      
      // Converter estilos inline de text-align para atributos data-format
      elementsWithAlignment.forEach(el => {
        const style = el.getAttribute('style') || '';
        
        // Verificar se há text-align no estilo
        if (style.includes('text-align')) {
          let alignment = '';
          
          if (style.includes('text-align: right')) {
            alignment = 'right';
          } else if (style.includes('text-align: center')) {
            alignment = 'center';
          } else if (style.includes('text-align: justify')) {
            alignment = 'justify';
          } else if (style.includes('text-align: left')) {
            alignment = 'left';
          }
          
          if (alignment) {
            // Adicionar atributo data-format que será reconhecido pelo ElementFormatPlugin
            el.setAttribute('data-format', alignment);
            
            // Se for alinhamento à direita, também definir dir="rtl" para compatibilidade
            if (alignment === 'right') {
              el.setAttribute('dir', 'rtl');
            } else if (alignment === 'left') {
              el.setAttribute('dir', 'ltr');
            }
            
            // Adicionar classe para garantir o estilo visual
            el.classList.add(`text-${alignment}`);
          }
        }
        
        // Verificar também atributo dir existente
        const dir = el.getAttribute('dir');
        if (dir === 'rtl' && !el.hasAttribute('data-format')) {
          el.setAttribute('data-format', 'right');
          el.classList.add('text-right');
        }
      });
      
      // Usar o HTML processado
      processedHtml = tempDiv.innerHTML;
      
      console.log('HTML pré-processado para preservar alinhamento:', processedHtml);
      
      // Continuar com o processo normal
      const parser = new DOMParser();
      const dom = parser.parseFromString(processedHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      
      console.log('initialHtmlAAAAAAAAAAAAAAAAAAAAA', initialHtml);
      console.log('nodesAAAAAAAAAAAAAAAAAAAAAAA', nodes);

      // Limpa o conteúdo atual e insere os novos nós
      const root = $getRoot();
      root.clear();

      $getRoot().select();
      $insertNodes(nodes);
      
      // Gerar HTML depois de inserir os nós
      const htmlOutput = $generateHtmlFromNodes(editor);
      console.log('htmlOutputAAAAAAAAAAAAAAAAAAAAAAAAAAA', htmlOutput);
      
      // Aplicar novamente os formatos de forma explícita após inserir os nós
      setTimeout(() => {
        editor.update(() => {
          const paragraphs = editor.getRootElement()?.querySelectorAll('p, h1, h2, h3, h4, h5, li');
          if (paragraphs) {
            paragraphs.forEach(p => {
              const format = p.getAttribute('data-format');
              if (format) {
                p.classList.add(`text-${format}`);
                
                // Se for alinhamento à direita, também garantir que dir="rtl" está presente
                if (format === 'right' && !p.hasAttribute('dir')) {
                  p.setAttribute('dir', 'rtl');
                }
              }
            });
          }
        });
      }, 100);
    });

  }, [editor, initialHtml]);

  return null;
} 