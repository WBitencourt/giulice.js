'use client'

import 'moment/locale/pt-br'
import * as Icon from '@phosphor-icons/react';
import { Formik } from "formik";
import { HtmlHTMLAttributes, useState } from "react";
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button2.0';
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/shallow';

interface InitialValuesFormik {
  newPassword: string;
  newPasswordConfirm: string;
}

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

export function FormUserChangePasswordGlobal(props: HtmlHTMLAttributes<HTMLFormElement>) { 
  const { updatePasswordUser } = useAuthStore(
    useShallow((state) => ({
      updatePasswordUser: state.updatePasswordUser,
    }))
  );

  const [alert, setAlert] = useState<AlertProps>({
    message: '',
    severity: 'default',
    visible: false,
  });

  const initialValues: InitialValuesFormik = {
    newPassword: '',
    newPasswordConfirm: '',
  }

  const openAlert = (message: string, severity: Severity) => {
    setAlert({ message, severity, visible: true });
  }

  const handleSubmit = async ({ newPassword, newPasswordConfirm }: InitialValuesFormik) => {
    try {
      await updatePasswordUser({ newPassword, newPasswordConfirm,  })
      openAlert('Senha alterada com sucesso.', 'success')
    } catch(error: any) {
      openAlert(error.message, 'error')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={() => {}}
      onSubmit={async (values, { setSubmitting,  }) => {
        await handleSubmit(values).finally(() => setSubmitting(false))
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4" { ...props } >
          <Alert.Root.Default 
            severity={alert.severity} 
            visible={alert.visible}
          >
            <Alert.Message>
              { alert.message }
            </Alert.Message>
            <Alert.Button.Close />
          </Alert.Root.Default>
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-lg">Alterar senha</h2>   

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
              className='bg-cyan-500 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-500'
              disabled={isSubmitting}>
              { 
                isSubmitting ? 
                <Button.Contained.IconLoading />
                :
                <>
                  <Button.Contained.Icon>
                    <Icon.ArrowClockwise weight='fill' />
                  </Button.Contained.Icon>
                  <Button.Contained.Text>
                    Alterar
                  </Button.Contained.Text>
                </>
              }
            </Button.Contained.Root>
          </div>
        </form>
      )}
    </Formik>
  )
}
