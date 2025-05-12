/**
 * Plugin de barra de ferramentas para o editor Lexical
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

// Prioridade baixa para os comandos
const LOW_PRIORITY = 1;

// Componente para o divisor na barra de ferramentas
function Divider() {
  return <div className="h-5 w-px mx-1 bg-gray-300 dark:bg-gray-600" />;
}

export default function ToolbarPlugin({ readOnly }: { readOnly: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  // Estados para alinhamento
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  // Atualiza o estado da barra de ferramentas baseado na seleção atual
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // Tenta determinar o alinhamento atual
      // Esta é uma implementação básica que pode precisar ser aprimorada
      try {
        const node = selection.getNodes()[0];
        const element = node.getParent();

        if (element) {
          const format = (element as any).getFormat?.() || 'left';
          setTextAlignment(format);
        }
      } catch (e) {
        // Se houver erro, mantém o alinhamento padrão
        console.log('Erro ao determinar alinhamento:', e);
      }
    }
  }, []);

  // Registra os event listeners
  useEffect(() => {
    // Se estiver em modo somente leitura, não precisamos registrar os event listeners
    if (readOnly) return;

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LOW_PRIORITY,
      ),
    );
  }, [editor, updateToolbar, readOnly]);

  return (
    <div className={`flex items-center p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto ${readOnly ? 'opacity-70' : ''}`}>
      <button
        type="button"
        disabled={readOnly || !canUndo}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly || !canUndo
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        title="Desfazer"
        aria-label="Desfazer"
      >
        <Undo className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly || !canRedo}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly || !canRedo
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        title="Refazer"
        aria-label="Refazer"
      >
        <Redo className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <Divider />
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${isBold ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Negrito"
        aria-label="Formatar como negrito"
      >
        <Bold className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${isItalic ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Itálico"
        aria-label="Formatar como itálico"
      >
        <Italic className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${isUnderline ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Sublinhado"
        aria-label="Formatar como sublinhado"
      >
        <Underline className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${isStrikethrough ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Tachado"
        aria-label="Formatar como tachado"
      >
        <Strikethrough className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <Divider />
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          setTextAlignment('left');

          // Forçar a aplicação do alinhamento após o comando
          setTimeout(() => {
            editor.update(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer.parentElement;
                const closestElement = startNode?.closest('p, h1, h2, h3, h4, h5, li');
                if (closestElement) {
                  closestElement.setAttribute('data-format', 'left');
                  closestElement.setAttribute('dir', 'ltr');
                  closestElement.classList.add('text-left');
                  closestElement.classList.remove('text-center', 'text-right', 'text-justify');
                }
              }
            });
          }, 0);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${textAlignment === 'left' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Alinhar à esquerda"
        aria-label="Alinhar à esquerda"
      >
        <AlignLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          setTextAlignment('center');

          // Forçar a aplicação do alinhamento após o comando
          setTimeout(() => {
            editor.update(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer.parentElement;
                const closestElement = startNode?.closest('p, h1, h2, h3, h4, h5, li');
                if (closestElement) {
                  closestElement.setAttribute('data-format', 'center');
                  closestElement.classList.add('text-center');
                  closestElement.classList.remove('text-left', 'text-right', 'text-justify');
                }
              }
            });
          }, 0);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${textAlignment === 'center' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Centralizar"
        aria-label="Centralizar texto"
      >
        <AlignCenter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          setTextAlignment('right');
          
          // Implementação específica para alinhamento à direita
          // que combina múltiplas estratégias para garantir que funcione
          setTimeout(() => {
            editor.update(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer.parentElement;
                const closestElement = startNode?.closest('p, h1, h2, h3, h4, h5, li');
                
                if (closestElement) {
                  // 1. Definir o atributo dir como "rtl"
                  closestElement.setAttribute('dir', 'rtl');
                  
                  // 2. Definir o atributo data-format
                  closestElement.setAttribute('data-format', 'right');
                  
                  // 3. Adicionar classe CSS
                  closestElement.classList.add('text-right');
                  closestElement.classList.remove('text-left', 'text-center', 'text-justify');
                  
                  // 4. Aplicar estilo inline como último recurso
                  (closestElement as HTMLElement).style.textAlign = 'right';
                }
              }
            });
          }, 0);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${textAlignment === 'right' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Alinhar à direita"
        aria-label="Alinhar à direita"
      >
        <AlignRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        type="button"
        disabled={readOnly}
        onClick={!readOnly ? () => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
          setTextAlignment('justify');
          
          // Forçar a aplicação do alinhamento após o comando
          setTimeout(() => {
            editor.update(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer.parentElement;
                const closestElement = startNode?.closest('p, h1, h2, h3, h4, h5, li');
                if (closestElement) {
                  closestElement.setAttribute('data-format', 'justify');
                  closestElement.classList.add('text-justify');
                  closestElement.classList.remove('text-left', 'text-center', 'text-right');
                }
              }
            });
          }, 0);
        } : undefined}
        className={`p-1 rounded-md mr-1 ${readOnly
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          } ${textAlignment === 'justify' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Justificar"
        aria-label="Justificar texto"
      >
        <AlignJustify className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
} 