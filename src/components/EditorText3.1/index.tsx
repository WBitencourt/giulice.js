import React, { useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ParagraphNode, TextNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import InitialHtmlPlugin from './plugins/InitialHtmlPlugin';
import InitialTextPlugin from './plugins/InitialTextPlugin';
import UpdatePlugin from './plugins/UpdatePlugin';
import TextAlignmentPlugin from './plugins/TextAlignmentPlugin';
import ElementFormatPlugin from './plugins/ElementFormatPlugin';

// Definindo classes do editor usando Tailwind
// Estas classes são referenciadas pelo Lexical para aplicar estilos
const editorClassNames = {
  root: 'relative',
  paragraph: 'mb-2',
  placeholder: 'text-gray-400 dark:text-gray-500 pointer-events-none select-none',
  ltr: 'text-left',
  rtl: 'text-right',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

type EditorProps = {
  placeholder?: string;
  initialContent?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  className?: string;
  label?: string;
};

export default function EditorText({ 
  placeholder = 'Digite seu texto aqui...',
  initialContent = '',
  onChange,
  readOnly = false,
  className = '',
  label = ''
}: EditorProps) {
  // Importante: precisamos ter certeza que initialContent não muda durante a vida do editor
  // para evitar problemas com o cursor
  const initialContentRef = useRef(initialContent);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const editorConfig = {
    namespace: 'EditorText3.1',
    theme: editorClassNames,
    onError(error: Error) {
      console.error('Erro no editor Lexical:', error);
    },
    // Registrando todos os nós necessários para o funcionamento completo do editor
    nodes: [
      ParagraphNode, // Importante para alinhamento, pois os parágrafos recebem o formato
      TextNode,      // Texto básico
      HeadingNode,   // Cabeçalhos 
      QuoteNode,     // Citações
      ListNode,      // Listas
      ListItemNode   // Itens de lista
    ],
    editable: !readOnly,
  };

  // Verifica se initialContent é um HTML ou texto simples
  const isHtml = initialContentRef.current?.trim().startsWith('<') && 
                 initialContentRef.current?.trim().endsWith('>');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      <div 
        className={`${className} rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-blue-950 overflow-hidden`}
      >
        <LexicalComposer initialConfig={editorConfig}>
          <ToolbarPlugin readOnly={readOnly} />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="outline-none border-none min-h-[200px] h-full resize-y px-4 py-3" 
                  //className="min-h-[150px] max-h-[400px] py-3 px-4 outline-none resize-none text-gray-900 dark:text-gray-100 overflow-y-auto"
                />
              }
              placeholder={
                <div className="absolute top-3 left-4 text-gray-400 dark:text-gray-500 select-none pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {!readOnly && <AutoFocusPlugin />}
            <TextAlignmentPlugin />
            <ElementFormatPlugin />
            <ListPlugin />

            {onChange && <UpdatePlugin onChange={onChange} />}
            
            {/* Inicialização do conteúdo - executado apenas uma vez */}
            {initialContentRef.current && isHtml && (
              <InitialHtmlPlugin initialHtml={initialContentRef.current} />
            )}
            {initialContentRef.current && !isHtml && (
              <InitialTextPlugin initialText={initialContentRef.current} />
            )}
          </div>
        </LexicalComposer>
      </div>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: initialContentRef.current
        }}
      /> */}
    </div>
  );
}
