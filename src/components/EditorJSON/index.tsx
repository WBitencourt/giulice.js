import { JSONTree } from 'react-json-tree';
import { useThemeStore } from '@/zustand-store/theme.store';

interface EditorJSONProps {
  title?: string;
  json: unknown;
}

const editorTheme = {
  scheme: 'Everest',
  author: 'Wendell Bitencourt',
  base00: '#181622', //background
  //base01: '#383830',
  //base02: '#49483e',
  base03: '#75715e', //info subgroup when opened
  //base04: '#a59f85',
  //base05: '#f8f8f2',
  //base06: '#f5f4f1',
  //base07: '#f9f8f5',
  base08: '#f92672', //value null or undefined
  base09: '#B5CEA8', //value no string
  //base0A: '#f4bf75',
  base0B: '#CE9178', //value string or info subgroup is closed
  //base0C: '#a1efe4',
  base0D: '#9CDCFE', //key value
  //base0E: '#ae81ff',
  //base0F: '#cc6633', 
};

const jsonTest = {
  "boolean": true,
  "null": null,
  "number": 123,
  "object": {"a": "b", "c": "d"},
  "string": "Hello World",
  "integer": 42,
  "decimal": 3.14159,
  "boolean_true": true,
  "boolean_false": false,
  "null_value": null,
  "array": [1, "two", 3.0, false],
  "nested_object": {
    "nested_integer": 7,
    "nested_decimal": 2.71828,
    "nested_boolean": true,
    "nested_array": [true, "false", 0, 0.0, null],
    "nested_null": null
  }
}

export const EditorJSON = ({ title, json }: EditorJSONProps) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="bg-white dark:bg-[#181622FF] px-4 rounded">
      {
        title ?
        <div className='mt-4'>
          <span>{ title }</span>
          <hr className='border-zinc-300 dark:border-zinc-800 my-2 cursor-default' />
        </div>
        : null
      }

      <JSONTree 
        invertTheme={theme === 'light' ? true : false}       
        theme={editorTheme}
        hideRoot
        data={json} 
      />
    </div>

  );
}