'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button2.0";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { DatePicker } from '@/components/DatePicker3.0';
import moment from 'moment';
import { LinkButton } from '@/components/LinkButton';

interface InitialValuesFormik {
  name: string;
  email: string;
  phoneNumber: string;
  //cpf: string;
  birthdate: string;
  password: string;
  passwordConfirm: string;
}

const initialValues: InitialValuesFormik = {
  name: '',
  email: '',
  phoneNumber: '',
  //cpf: '',
  birthdate: moment().toISOString(),
  password: '',
  passwordConfirm: '',
}


interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

export function FormSignUpGlobal({ ...props }: HtmlHTMLAttributes<HTMLFormElement>) { 
  const router = useRouter();

  // const { signUp } = useAuthStore(state => {
  //   return {
  //     signUp: state.signUp
  //   }
  // });

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

  const handleSubmit = async ({name, email, phoneNumber, birthdate, password, passwordConfirm}: InitialValuesFormik) => {
    try {
      //await signUp({name, email, phoneNumber, birthdate, password, passwordConfirm});

      router.push('/auth/signup_confirm');
    } catch(error: any) {
      openAlert(error.message, 'error')
    }
  }
  
  useEffect(() => {
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validate={() => {}}
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(values).then(() => {setSubmitting(false)});
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
                    Nome completo
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                    id="name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
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
                    Endereço de e-mail
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="new-email"
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

              <DatePicker.Date
                id="birthdate" 
                label="Data de nascimento"
                onChange={(value) => {setFieldValue("birthdate", moment(value).locale('pt-br').format('MM/DD/YYYY'))}}
                value={new Date(values.birthdate)}
              />

              <TextField.Root>
                <TextField.Main.Root>
                  <TextField.Main.Label>
                    Digite sua senha
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
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
                    Digite novamente sua senha
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field 
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.passwordConfirm}
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
                    <Icon.IdentificationCard weight='fill' />
                  </Button.Contained.Icon>
                  <Button.Contained.Text>
                  Cadastrar
                  </Button.Contained.Text>
                  </>
                }
              </Button.Contained.Root>

              <div className="flex gap-2 justify-center border border-zinc-300 dark:border-zinc-600 rounded items-center p-4 mt-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Ja tem uma conta no Everest?</span>
              <LinkButton.Root href='/auth/login'>
                <LinkButton.Label text='Faça login' className='flex flex-1 justify-end text-sm' />
              </LinkButton.Root>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}
