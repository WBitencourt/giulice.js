/**
 * Plugin para inicializar o editor com texto simples
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

type InitialTextPluginProps = {
  initialText: string;
};

export default function InitialTextPlugin({ initialText }: InitialTextPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialText || initialText.trim() === '') {
      return;
    }

    // Inicializa o editor com o texto quando o componente é montado
    editor.update(() => {
      const root = $getRoot();
      // Só insere o texto se o editor estiver vazio
      if (root.getFirstChild() === null) {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialText));
        root.append(paragraph);
      }
    });
  }, [editor, initialText]);

  return null;
} 