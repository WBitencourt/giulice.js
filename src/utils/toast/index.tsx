'use client'

import { toast as toastPrimitive } from "sonner";
import { ReactNode } from "react";

export interface ToastErrorParams {
  title?: string;
  description?: string;
}

export interface ToastWarningParams {
  title?: string;
  description?: string;
}

export interface ToastInfoParams {
  title?: string;
  description?: string;
}

export interface ToastSuccessParams {
  title?: string;
  description?: string;
}

export interface ToastPromiseParams<T> {
  promise: Promise<T>;
  success: {
    message: string;
  };
  failure: {
    message: string;
  };
  loading: {
    message: string;
  }
}

/**
 * Converte texto com quebras de linha (\n) em elementos JSX
 */
function textToJsx(text?: string): ReactNode {
  if (!text) return undefined;
  
  // Divide o texto por quebras de linha e cria elementos para cada linha
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, index) => (
        // Para cada linha, adiciona um elemento React
        <div key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </div>
      ))}
    </>
  );
}

function error({ title, description }: ToastErrorParams) {
  toastPrimitive.error(title, {
    description: textToJsx(description),
    duration: 1000 * 15, // 15 seconds
    closeButton: true,
  })
}

function warning({ title, description }: ToastWarningParams) {
  toastPrimitive.warning(title, {
    description: textToJsx(description),
    duration: 1000 * 10, // 10 seconds
    closeButton: true,
  })
}

function info({ title, description }: ToastInfoParams) {
  toastPrimitive.info(title, {
    description: textToJsx(description),
    duration: 1000 * 10, // 10 seconds
    closeButton: true,
  })
}

function success({ title, description }: ToastSuccessParams) {
  toastPrimitive.success(title, {
    description: textToJsx(description),
    duration: 1000 * 5, // 5 seconds
    closeButton: true,
  })
}

function promise<T,>({ promise, success, failure, loading }: ToastPromiseParams<T>) {
  toastPrimitive.promise(promise, {
    loading: loading.message ? loading.message : 'Carregando...',
    success: () => {
      return success.message;
    },
    error: failure.message,
  });
}

export const toast = {
  error,
  warning,
  info,
  success,
  promise,
  custom: toastPrimitive,
}
