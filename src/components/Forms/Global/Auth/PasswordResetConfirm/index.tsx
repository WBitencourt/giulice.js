'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button2.0";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { LinkButton } from '@/components/LinkButton';
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/react/shallow';

interface InitialValuesFormik {
  email: string;
  code: string;
  newPassword: string,
  newPasswordConfirm: string,
}

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

export function FormPasswordResetConfirmGlobal({ ...props }: HtmlHTMLAttributes<HTMLFormElement>) { 
  const router = useRouter();

  const { user, forgotPassword, forgotPasswordConfirm } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      forgotPassword: state.forgotPassword,
      forgotPasswordConfirm: state.forgotPasswordConfirm,
    }))
  );

  const [alert, setAlert] = useState<AlertProps>({
    message: '',
    severity: 'default',
    visible: false,
  });

  const inputCodeRef = useRef<HTMLInputElement>(null);

  const [showFinishMessage, setShowFinishMessage] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [counter, setCounter] = useState(30);

  const initial_values: InitialValuesFormik = {
    email: user?.email ?? '',
    code: '',
    newPassword: '',
    newPasswordConfirm: '',
  }

  const openAlert = (message: string, severity: Severity) => {
    setAlert({ message, severity, visible: true });
  }

  const handleSubmit = async ({ email, code, newPassword, newPasswordConfirm }: InitialValuesFormik) => {
    try {
      await forgotPasswordConfirm({ email, code, newPassword, newPasswordConfirm})
      setShowFinishMessage(true);
    } catch(error: any) {
      openAlert(error.message, 'error');
    }
  }

  const handleResendCodeVerification = async (email: string) => {
    try {
      setIsSendingCode(true);

      await forgotPassword({email});
      router.push('/auth/password_reset_confirm')

      setCounter(30);
    } catch(error: any) {
      openAlert(error.message, 'error')
    } finally {
      setIsSendingCode(false);
    }
  }

  useEffect(() => {
    const decrementCounter = () => {
      setCounter(counter - 1);
    }

    if (counter > 0) {
      const timeoutId = setTimeout(decrementCounter, 1000);
      return () => clearTimeout(timeoutId); // Limpa o timeout ao desmontar ou atualizar
    } else {
      setCounter(0);
    }
  }, [counter]);

  useEffect(() => {
    inputCodeRef.current?.focus();
  }, []);

  return (
    <Formik
      initialValues={initial_values}
      validate={() => {}}
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(values).then(() => {setSubmitting(false)});
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <div className='flex flex-1 justify-center'>
          {
            showFinishMessage ? 
            <div className="flex flex-col justify-center items-center w-96 h-fit gap-2 p-8 rounded bg-zinc-100 dark:bg-zinc-800">
              <Icon.CheckCircle className="text-4xl text-green-500" />
              <p className="flex flex-1 pt-2 text-center">Verificação concluída com sucesso!</p>
              <LinkButton.Root href='/auth/login'>
                <LinkButton.Label text='Voltar para o login' className='flex flex-1 justify-end text-sm' />
              </LinkButton.Root>
            </div>
            :
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
                        Endereço de e-mail
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field 
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          title='Endereço de e-mail que recebeu o código de verificação'
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
                        Insira o código de verificação
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field 
                          id="code"
                          name="code"
                          ref={inputCodeRef}
                          type="text"
                          autoFocus
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.code}
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
                          autoComplete="off"
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
                            autoComplete="off"
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

                  <Button.Contained.Root 
                    type="button"
                    disabled={isSubmitting || (counter > 0)} 
                    onClick={() => handleResendCodeVerification(values.email)}
                  >
                    {
                      isSendingCode ?
                      <Button.Contained.IconLoading />
                      :
                      <>
                        <Button.Contained.Icon>
                          <Icon.PaperPlaneTilt weight='thin' />
                        </Button.Contained.Icon>
                        <Button.Contained.Text>
                          {counter > 0 ? 'Reenviar (' + counter + ' seg)' : 'Reenviar' }
                        </Button.Contained.Text>
                      </>
                    }
                  </Button.Contained.Root>
      
                  {/* <Button.ContainedRoot type="submit" disabled={isSubmitting}>
                    <Button.Icon>
                      {isSubmitting && <Button.LoadingIcon />}
                      {!isSubmitting && <Icon.ShieldCheck weight='fill' />}
                    </Button.Icon>
                    {!isSubmitting && <Button.Text>Alterar</Button.Text>}
                  </Button.ContainedRoot>

                  <Button.OutlinedRoot disabled={isSubmitting || (counter > 0)} onClick={() => handleresendCodeVerification(values.email)}>
                    <Button.Icon>
                      {isSendingCode && <Button.LoadingIcon />}
                      {!isSendingCode && <Icon.PaperPlaneTilt weight='thin' />}
                    </Button.Icon>
                    {!isSendingCode && <Button.Text className="text-zinc-500 dark:text-zinc-400">
                     {counter > 0 ? 'Reenviar (' + counter + ' seg)' : 'Reenviar' }
                    </Button.Text>}
                  </Button.OutlinedRoot> */}
      
                  <div className="flex gap-2 justify-center border border-zinc-300 dark:border-zinc-600 rounded items-center p-4 mt-4">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Ja tem uma conta no Everest?</span>
                    <LinkButton.Root href='/auth/login'>
                      <LinkButton.Label text='Faça login' className='flex flex-1 justify-end text-sm' />
                    </LinkButton.Root>
                  </div>
                </div>
              </div>
            </form>
          }
        </div>

      )}
    </Formik>
  )
}
