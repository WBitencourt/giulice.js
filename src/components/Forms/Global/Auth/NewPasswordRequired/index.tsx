'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HtmlHTMLAttributes, useEffect, useState } from "react";

import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button2.0";
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { Skeleton } from '@/components/Skeleton2.0';
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from '@/utils/toast';

interface InitialValuesFormik {
  email: string;
  newPassword: string,
  newPasswordConfirm: string,
}

interface UpdateInitialValuesFormik {
  email?: string;
  newPassword?: string,
  newPasswordConfirm?: string,
}

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

export function FormNewPasswordRequiredGlobal({ ...props }: HtmlHTMLAttributes<HTMLFormElement>) { 
  const router = useRouter();

  const { user, newPasswordRequired } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      newPasswordRequired: state.newPasswordRequired,
    }))
  );

  const [alert, setAlert] = useState<AlertProps>({
    message: '',
    severity: 'default',
    visible: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [initialValues, setInitialValues] = useState<InitialValuesFormik>({
    email: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const updateInitialValues = (data: UpdateInitialValuesFormik) => {
    setInitialValues((prevState) => {
      return { ...prevState, ...data };
    });
  }

  const openAlert = (message: string, severity: Severity) => {
    setAlert({ message, severity, visible: true });
  }

  const handleOpenAlert = (message: string, severity: Severity) => {
    openAlert(message, severity);
  }

  const handleSubmit = async ({ newPassword, newPasswordConfirm }: InitialValuesFormik) => {
    try {
      await newPasswordRequired({
        newPassword,
        newPasswordConfirm,
      });

      router.push('/home');
    } catch(error: any) {
      openAlert(error.message, 'error');
    }
  }

  useEffect(() => {
    if(!user?.email) {
      toast.error({
        title: 'Falha ao redefinir senha temporária',
        description: 'Usuário não identificado para redefinir senha temporária',
      });

      router.push('/auth/login');
      return
    }

    updateInitialValues({
      email: user?.email,
    })

    setIsLoading(false);
  }, [router, user?.email])

  return (
    <>
      {
        isLoading ?
        <Skeleton.Root className='flex w-full flex-col gap-4'>
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Button />
        </Skeleton.Root>
        :
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

              <div className="flex flex-col gap-4 justify-center items-center p-8 rounded bg-zinc-100 dark:bg-zinc-800 h-fit">
                <Image 
                  src="/everest/portal/everest-logo.svg" 
                  alt="Everest logo" 
                  width="100" 
                  height="100" 
                />

                <h1 className="text-2xl text-black dark:text-white">EVEREST</h1>

                <span className='text-xs text-wrap text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-950 rounded p-2'>
                  Sua conta possui uma senha temporária, você deve redefinir sua senha
                </span>

                <div className="flex flex-1 flex-col w-96 gap-4">
                  <TextField.Root>
                    <TextField.Main.Root>
                      <TextField.Main.Label>
                        Endereço de e-mail
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field 
                          id="email"
                          name="email"
                          type="email"
                          disabled
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

                  <TextField.Root>
                    <TextField.Main.Root>
                      <TextField.Main.Label>
                        Digite sua nova senha
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field 
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          autoComplete="new-password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.newPassword}
                        />
                      </TextField.Main.Input.Root>
                    </TextField.Main.Root>
                    <TextField.Button.Root>
                      <TextField.Button.Clean />
                      <TextField.Button.Password />
                    </TextField.Button.Root>
                  </TextField.Root>  

                  <TextField.Root>
                    <TextField.Main.Root>
                      <TextField.Main.Label>
                        Digite novamente sua nova senha
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field 
                          id="newPasswordConfirm"
                          name="newPasswordConfirm"
                          type="password"
                          autoComplete="new-password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.newPasswordConfirm}
                        />
                      </TextField.Main.Input.Root>
                    </TextField.Main.Root>                    
                    <TextField.Button.Root>
                      <TextField.Button.Clean />
                      <TextField.Button.Password />
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
                          <Icon.ShieldCheck weight='fill' />
                        </Button.Contained.Icon>
                        <Button.Contained.Text>
                          Alterar
                        </Button.Contained.Text>
                      </>
                    }
                  </Button.Contained.Root>
                </div>
              </div>
            </form>
          )}
        </Formik>
      }
    </>
  )
}
