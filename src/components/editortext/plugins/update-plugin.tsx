/**
 * Plugin para atualizar o conteúdo HTML quando o editor mudar
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';

type updatePluginProps = {
  onChange?: (html: string) => void;
};

export default function UpdatePlugin({ onChange }: updatePluginProps) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      
      if(onChange) {
        onChange(htmlString);
      }
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
} 