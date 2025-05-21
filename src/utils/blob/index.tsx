
export function readBlobAsText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o anexo.'));
    };

    reader.readAsText(file);
  });
}
