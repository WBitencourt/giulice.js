/**
 * Plugin para manipular alinhamento de texto no editor Lexical
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getSelection, 
  $isRangeSelection, 
  COMMAND_PRIORITY_CRITICAL, 
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

export default function TextAlignmentPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Registra o comando para formatar elementos de parágrafo com prioridade CRÍTICA
    // Isto é importante para garantir que este comando seja executado antes de qualquer outro
    return editor.registerCommand(
      FORMAT_ELEMENT_COMMAND,
      (payload) => {
        // Validar o tipo de alinhamento
        const alignment = payload as 'left' | 'center' | 'right' | 'justify';
        if (
          alignment !== 'left' && 
          alignment !== 'center' && 
          alignment !== 'right' && 
          alignment !== 'justify'
        ) {
          return false;
        }
        
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        // Aplicar o formato a todos os nós selecionados
        // Esta é a forma mais simples e robusta de aplicar o alinhamento
        editor.update(() => {
          selection.getNodes().forEach((node) => {
            const element = node.getParent();
            if (element && element.setFormat) {
              element.setFormat(alignment);
            }
          });
        });

        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  return null;
} 