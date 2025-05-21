import { toast } from "@/utils/toast";

export const copyToClipBoard = async (value: string | undefined) => {
  try {
    await navigator.clipboard.writeText(value ?? '');
  } catch {
    toast.error({
      title: 'Falha ao copiar os dados para a área de transferência',
      description: 'Verifique se o navegador está permitindo acesso à área de transferência',
    });
  }
};