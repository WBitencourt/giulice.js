'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TextField } from "@/components/TextField";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { LinkButton } from '@/components/LinkButton';
import { Button } from '@/components/Button2.0';
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/shallow';

interface InitialValuesFormik {
  email: string;
  password: string;
}

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

const initialValues: InitialValuesFormik = {
  email: '',
  password: '',
}

export function FormLoginGlobal({ ...props }: HtmlHTMLAttributes<HTMLFormElement>) { 
  const router = useRouter();

  const { signIn, destroySession } = useAuthStore(
    useShallow((state) => ({
      signIn: state.signIn,
      destroySession: state.destroySession,
    }))
  );

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

  const handleSubmit = async ({email, password}: InitialValuesFormik) => {
    try {
      const endpoint = await signIn({ 
        email, 
        password, 
      });

      console.log('Login bem-sucedido! Redirecionando para:', endpoint);
      
      // Use router.push para navegação programática dentro da aplicação
      // O Next.js aplicará o basePath automaticamente
      setTimeout(() => {
        router.push(endpoint);
      }, 100);
      
    } catch (error: any) {
      handleOpenAlert(error.message, 'error')
    }
  }

  useEffect(() => {
    destroySession();
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validate={() => {}}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values).finally(() => setSubmitting(false));
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
        <form 
          id="loginForm" 
          onSubmit={handleSubmit} className="flex flex-1 flex-col items-center gap-4" 
          { ...props } 
        >
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
                  <TextField.Main.Root>
                    <TextField.Main.Label>
                      E-mail
                    </TextField.Main.Label>
                    <TextField.Main.Input.Root>
                      <TextField.Main.Input.Field 
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </TextField.Main.Input.Root>
                  </TextField.Main.Root>
                </TextField.Main.Root>
                <TextField.Button.Root>
                  <TextField.Button.Clean onClick={() => setFieldValue('email', '')} />
                </TextField.Button.Root>
              </TextField.Root>

              <TextField.Root>
                <TextField.Main.Root>
                  <TextField.Main.Label htmlFor='password'>
                    Digite sua senha
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </TextField.Main.Input.Root>
                </TextField.Main.Root>
                <TextField.Button.Root>
                  <TextField.Button.Clean onClick={() => setFieldValue('password', '')} />
                  <TextField.Button.Password />
                </TextField.Button.Root>
              </TextField.Root>
{/* 
              <Input
                id="email"
                name="email"
                //label="Endereço de e-mail"
                //variant="outlined"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />

              <Input
                id="password"
                name="password"
                //label="Digite sua senha"
                //variant="outlined"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />     */}
              
              <div className='flex flex-1 justify-end'>
                <LinkButton.Root href='/auth/password_reset'>
                  <LinkButton.Label text='Esqueceu sua senha?' className='text-sm' />
                </LinkButton.Root>
              </div>

              <br />

              <Button.Contained.Root 
                type="submit" 
                disabled={isSubmitting}
                className='bg-cyan-500 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-500'
              >
                {
                  isSubmitting ?
                  <Button.Contained.IconLoading />
                  :
                  <>
                    <Button.Contained.Icon>
                      <Icon.IdentificationCard weight='fill' />
                    </Button.Contained.Icon>
                    <Button.Contained.Text>
                      Entrar
                    </Button.Contained.Text>
                  </>
                }
              </Button.Contained.Root>
            </div> 
          </div>
        </form>
      )}
    </Formik>
  )
}
