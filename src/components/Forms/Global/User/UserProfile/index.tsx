'use client'

import 'moment/locale/pt-br'
import { Formik } from "formik";

import { HtmlHTMLAttributes, useCallback, useEffect, useState } from "react";
import { TextField } from '@/components/TextField';
import { Skeleton } from '@/components/Skeleton2.0';
import { Alert } from "@/components/Alert2.0";
import { Severity } from "@/components/Alert2.0/Root";
import { useAuthStore } from '@/zustand-store/auth.store';
import { useShallow } from 'zustand/react/shallow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/utils/toast';

interface AlertProps {
  message?: string;
  severity?: Severity;
  visible?: boolean;
}

interface InitialValuesFormik {
  id: string;
  email: string;
  name: string;
}

export function FormUserProfileGlobal(props: HtmlHTMLAttributes<HTMLFormElement>) { 
  const { refreshAuthenticatedUser, user } = useAuthStore(
    useShallow((state) => ({
      refreshAuthenticatedUser: state.refreshAuthenticatedUser,
      user: state.user,
    }))
  );

  const [alert, setAlert] = useState<AlertProps>({
    message: '',
    severity: 'default',
    visible: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [initialValues, setInitialValues] = useState<InitialValuesFormik>({
    id: '',
    email: '',
    name: '',
  });

  const updateInitialValues = (data: InitialValuesFormik) => {
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

  const handleSubmit = async ({ id, name, email }: InitialValuesFormik) => {
    try {
      //await updateDataUser({ name, email, cpf, birthdate });
      //openAlert('Dados do usuário atualizados com sucesso.', 'success')
    } catch(error: any) {
      handleOpenAlert(error.message, 'error')
    }
  }

  const loadDataUser = useCallback(async () => {
    try {
      const {  
        id,
        name, 
        email, 
      } = await refreshAuthenticatedUser();

      updateInitialValues({ 
        id: id ?? '',
        email: email ?? '',
        name: name ?? '',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao carregar dados do usuário',
        description: error?.message,
      });
    }
  }, [refreshAuthenticatedUser]);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      loadDataUser(),
    ]).finally(() => setIsLoading(false));
  }, [loadDataUser])

  const adminCliente = user?.rules?.adminCliente?.map((nomePermissao) => {
    return nomePermissao
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const adminOito = user?.rules?.adminOito?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const consultas = user?.rules?.consultas?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const excecaoCliente = user?.rules?.excecoes?.excecaoCliente?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const excecaoOito = user?.rules?.excecoes?.excecaoOito?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const excecaoSistemica = user?.rules?.excecoes?.excecaoSistemica?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const operadorCliente = user?.rules?.operadorCliente?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const operadorOito = user?.rules?.operadorOito?.map((nomePermissao) => {
    return nomePermissao;
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const portalUploadLote = user?.rules?.portalUploadLote?.map((nomePermissao) => {
    return nomePermissao.replace('/Lote', '');
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  const portalUploadIndividual = user?.rules?.portalUploadIndividual?.map((nomePermissao) => {
    return nomePermissao.replace('/Individual', '');
  }).sort((a, b) => a.localeCompare(b)) ?? [];

  return (
    <>
      {
        isLoading ? 
        <Skeleton.Root className='flex flex-col gap-4 w-full'>
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Button />
        </Skeleton.Root>
        :
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

              <TextField.Root>
              <TextField.Main.Root>
                <TextField.Main.Label>
                ID
                </TextField.Main.Label>
                <TextField.Main.Input.Root>
                <TextField.Main.Input.Field 
                  id="user_id"
                  name="user_id"
                  type="text"
                  disabled
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.id}
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
                Nome Completo
                </TextField.Main.Label>
                <TextField.Main.Input.Root>
                <TextField.Main.Input.Field 
                  id="name"
                  name="name"
                  type="text"
                  disabled
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
                E-mail
                </TextField.Main.Label>
                <TextField.Main.Input.Root>
                <TextField.Main.Input.Field 
                  id="email"
                  name="email"
                  type="text"
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

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Admin cliente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  adminCliente && adminCliente.length > 0 ? (
                  adminCliente.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                  <TableCell 
                    colSpan={2}
                    className='text-center'
                  >
                    Nenhuma direito de acesso cadastrado.
                  </TableCell>
                  </TableRow>
                )
                }
              </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
              <TableHeader>
                <TableRow>
                <TableHead className='w-12'>#</TableHead>
                <TableHead>Admin Oito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                adminOito && adminOito.length > 0 ? (
                  adminOito.map((nomePermissao, index) => {
                  return (
                    <TableRow key={nomePermissao}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {nomePermissao}
                    </TableCell>
                    </TableRow>
                  )
                  })

                ) : (
                  <TableRow>
                  <TableCell 
                    colSpan={2}
                    className='text-center'
                  >
                    Nenhuma direito de acesso cadastrado.
                  </TableCell>
                  </TableRow>
                )
                }
              </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'>#</TableHead>
                    <TableHead>Consultas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  consultas && consultas.length > 0 ? (
                    consultas.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={2}
                        className='text-center'
                      >
                        Nenhuma direito de acesso cadastrado.
                      </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Exceção Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  excecaoCliente && excecaoCliente.length > 0 ? (
                    excecaoCliente.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                    <TableCell 
                      colSpan={2}
                      className='text-center'
                    >
                      Nenhuma direito de acesso cadastrado.
                    </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Exceção Oito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  excecaoOito && excecaoOito.length > 0 ? (
                    excecaoOito.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                    <TableCell 
                      colSpan={2}
                      className='text-center'
                    >
                      Nenhuma direito de acesso cadastrado.
                    </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Exceção Sistemica</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  excecaoSistemica && excecaoSistemica.length > 0 ? (
                    excecaoSistemica.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                    <TableCell 
                      colSpan={2}
                      className='text-center'
                    >
                      Nenhuma direito de acesso cadastrado.
                    </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Operador cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  operadorCliente && operadorCliente.length > 0 ? (
                    operadorCliente.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                    <TableCell 
                      colSpan={2}
                      className='text-center'
                    >
                      Nenhuma direito de acesso cadastrado.
                    </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                <TableHeader>
                  <TableRow>
                  <TableHead className='w-12'>#</TableHead>
                  <TableHead>Operador Oito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  operadorOito && operadorOito.length > 0 ? (
                    operadorOito.map((nomePermissao, index) => {
                    return (
                      <TableRow key={nomePermissao}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {nomePermissao}
                      </TableCell>
                      </TableRow>
                    )
                    })

                  ) : (
                    <TableRow>
                    <TableCell 
                      colSpan={2}
                      className='text-center'
                    >
                      Nenhuma direito de acesso cadastrado.
                    </TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>

              {
                portalUploadIndividual && portalUploadIndividual.length > 0 ? (
                  <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                    <TableHeader>
                      <TableRow>
                      <TableHead className='w-12'>#</TableHead>
                      <TableHead>Portal de upload (Individual)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        portalUploadIndividual.map((nomePermissao, index) => {
                          return (
                            <TableRow key={nomePermissao}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {nomePermissao}
                            </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                ) : null
              }

              {
                portalUploadLote && portalUploadLote.length > 0 ? (
                  <Table className='w-full border text-zinc-500 border-zinc-200 dark:border-zinc-900 '>
                    <TableHeader>
                      <TableRow>
                      <TableHead className='w-12'>#</TableHead>
                      <TableHead>Portal de upload (Lote)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        portalUploadLote.map((nomePermissao, index) => {
                          return (
                            <TableRow key={nomePermissao}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {nomePermissao}
                            </TableCell>
                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                ) : null
              }

            </form>
          )}
        </Formik>
      }
    </>
  )
}
