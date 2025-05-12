'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button2.0";
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { LinkButton } from '@/components/LinkButton';
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/shallow';

interface InitialValuesFormik {
  email: string;
}

const initialValues: InitialValuesFormik = {
  email: '',
}

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

export function FormPasswordResetGlobal({ ...props }: HtmlHTMLAttributes<HTMLFormElement>) { 
  const { forgotPassword } = useAuthStore(
    useShallow((state) => ({
      forgotPassword: state.forgotPassword,
    }))
  );

  const router = useRouter();

  const [alert, setAlert] = useState<AlertProps>({
    message: '',
    severity: 'default',
    visible: false,
  });

  const openAlert = (message: string, severity: Severity) => {
    setAlert({ message, severity, visible: true });
  }

  const handleOpenAlert = (message: string, severity: Severity) => {
    openAlert(message, severity);
  }

  const handleSubmit = async ({email}: InitialValuesFormik) => {
    try {
      await forgotPassword({ email });

      router.push('/auth/password_reset_confirm')
    } catch(error: any) {
      handleOpenAlert(error.message, 'error');
    }
  }

  const handleBackToLogin = async () => {
    router.push('/auth/login');
  }

  useEffect(() => {
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validate={() => {}}
      onSubmit={async (values, { setSubmitting,  }) => {
        await handleSubmit(values).finally(() => setSubmitting(false))
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col items-center gap-4" { ...props } >
          <Alert.Root.Default 
            severity={alert.severity} 
            visible={alert.visible}
          >
            <Alert.Message>
              { alert.message }
            </Alert.Message>
            <Alert.Button.Close />
          </Alert.Root.Default>

          <div className="flex flex-col justify-center items-center p-8 rounded bg-zinc-100 dark:bg-zinc-800 h-fit">
            <Image 
              src="/everest/portal/everest-logo.svg" 
              alt="Everest logo" 
              width="100" 
              height="100" 
            />

            <h1 className="text-2xl pb-8 text-black dark:text-white">EVEREST</h1>

            <div className="flex flex-1 flex-col w-96 gap-4">
              <TextField.Root>
                <TextField.Main.Root>
                  <TextField.Main.Label>
                  Preencha seu endereço de e-mail
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                  </TextField.Main.Input.Root>
                </TextField.Main.Root>
                <TextField.Button.Root>
                  <TextField.Button.Clean />
                </TextField.Button.Root>
              </TextField.Root>
            

              <Button.Contained.Root 
                type="submit" 
                disabled={isSubmitting}
                className='bg-cyan-500 dark:bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-400'
              >
                {
                  isSubmitting ?
                  <Button.Contained.IconLoading />
                  :
                  <>
                    <Button.Contained.Icon>
                      <Icon.Key weight='fill' />
                    </Button.Contained.Icon>
                    <Button.Contained.Text>
                    Recuperar
                    </Button.Contained.Text>
                  </>
                }
              </Button.Contained.Root>

              <div className="flex gap-2 justify-center border border-zinc-300 dark:border-zinc-600 rounded items-center p-4 mt-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Lembrou?</span>
                <LinkButton.Root href='/auth/login'>
                  <LinkButton.Label text='Faça o login' className='flex flex-1 justify-end text-sm' />
                </LinkButton.Root>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}
