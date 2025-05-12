import { FormLoginGlobal } from '@/components/Forms/Global/Auth/Login';
import { FormNewPasswordRequiredGlobal } from '@/components/Forms/Global/Auth/NewPasswordRequired';
import { FormPasswordResetGlobal } from '@/components/Forms/Global/Auth/PasswordReset';
import { FormPasswordResetConfirmGlobal } from '@/components/Forms/Global/Auth/PasswordResetConfirm';
import { FormSignUpGlobal } from '@/components/Forms/Global/Auth/Signup';

import { FormUserChangePasswordGlobal } from '@/components/Forms/Global/User/UserChangePassword';
import { FormUserProfileGlobal } from '@/components/Forms/Global/User/UserProfile';

import { FormInterviewPortalUploadGlobal } from './Global/PortalUpload/Interview';
import ReportFormGlobal from './Global/Report';

import { FormCitacaoIntimacaoPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/citacao-intimacao/consulta';
import { FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/notificacao-extrajudicial/consulta';
import { FormOficioJudicialPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/oficio-judicial/consulta';
import { FormOficioPolicialPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/oficio-policial/consulta';
import { FormProconPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/procon/consulta';
import { FormOutroPicPayGroupConsultaDemandas } from './PicPayGroup/tipo-demanda/outro/consulta';
import { TipificacaoPicPayGroupEsteiraOitoPage } from './PicPayGroup/tipificacao/esteira-oito';
import { FormInterviewPortalUploadPicPayGroup } from './PicPayGroup/portalupload/Interview';
import { FormTipificacaoPicPayGroupAuditoriaOitoPage } from './PicPayGroup/tipificacao/auditoria-oito';
import { FormOficioJudicialPicPayGroupAuditoriaOito } from './PicPayGroup/tipo-demanda/oficio-judicial/auditoria-oito';
import { FormOficioPolicialPicPayGroupAuditoriaOito } from './PicPayGroup/tipo-demanda/oficio-policial/auditoria-oito';
import { FormOficioJudicialPicPayGroupEsteiraOito } from './PicPayGroup/tipo-demanda/oficio-judicial/esteira-oito';
import { FormOficioPolicialPicPayGroupEsteiraOito } from './PicPayGroup/tipo-demanda/oficio-policial/esteira-oito';
import { FormOficioJudicialPicPayGroupEsteiraCliente } from './PicPayGroup/tipo-demanda/oficio-judicial/esteira-cliente';
import { FormOficioPolicialPicPayGroupEsteiraCliente } from './PicPayGroup/tipo-demanda/oficio-policial/esteira-cliente';
import { FormOficioJudicialPicPayGroupExcecaoOito } from './PicPayGroup/tipo-demanda/oficio-judicial/excecao-oito';
import { FormOficioPolicialPicPayGroupExcecaoOito } from './PicPayGroup/tipo-demanda/oficio-policial/excecao-oito';
import { FormOficioJudicialPicPayGroupExcecaoCliente } from './PicPayGroup/tipo-demanda/oficio-judicial/excecao-cliente';
import { FormOficioPolicialPicPayGroupExcecaoCliente } from './PicPayGroup/tipo-demanda/oficio-policial/excecao-cliente';

import { FormAtualizacaoReturnConsultaDemandas } from './Return/tipo-demanda/atualizacao/consulta';
import { FormCadastroJuridicoReturnConsultaDemandas } from './Return/tipo-demanda/cadastro-juridico/consulta';
import { FormNotificacaoExtrajudicialReturnConsultaDemandas } from './Return/tipo-demanda/notificacao-extrajudicial/consulta';
import { FormProcessoTrabalhistaReturnConsultaDemandas } from './Return/tipo-demanda/processo-trabalhista/consulta';
import { FormProconReturnConsultaDemandas } from './Return/tipo-demanda/procon/consulta';
import { FormDemandaOutroReturnConsultaDemanda } from './Return/tipo-demanda/outro/consulta';
import { FormTipificacaoReturnEsteiraOito } from './Return/tipificacao/esteira-oito';
import { FormAtualizacaoReturnEsteiraOito } from './Return/tipo-demanda/atualizacao/esteira-oito';
import { FormCadastroJuridicoReturnEsteiraOito } from './Return/tipo-demanda/cadastro-juridico/esteira-oito';
import { FormNotificacaoExtrajudicialReturnEsteiraOito } from './Return/tipo-demanda/notificacao-extrajudicial/esteira-oito';
import { FormProcessoTrabalhistaReturnEsteiraOito } from './Return/tipo-demanda/processo-trabalhista/esteira-oito';
import { FormProconReturnEsteiraOito } from './Return/tipo-demanda/procon/esteira-oito';
import { FormAtualizacaoReturnExcecaoDemandas } from './Return/tipo-demanda/atualizacao/excecao-oito';
import { FormCadastroJuridicoReturnExcecaoDemandas } from './Return/tipo-demanda/cadastro-juridico/excecao-oito';
import { FormNotificacaoExtrajudicialReturnExcecaoSistemica } from './Return/tipo-demanda/notificacao-extrajudicial/excecao-oito';
import { FormProcessoTrabalhistaReturnExcecaoDemandas } from './Return/tipo-demanda/processo-trabalhista/excecao-oito';
import { FormProconReturnExcecaoDemandas } from './Return/tipo-demanda/procon/excecao-oito';
import { FormTipificacaoReturnAuditoriaOitoPage } from './Return/tipificacao/auditoria-oito';
import { FormAtualizacaoReturnAuditoriaOito } from './Return/tipo-demanda/atualizacao/auditoria-oito';
import { FormCadastroJuridicoReturnAuditoriaOito } from './Return/tipo-demanda/cadastro-juridico/auditoria-oito';
import { FormNotificacaoExtrajudicialReturnAuditoriaOito } from './Return/tipo-demanda/notificacao-extrajudicial/auditoria-oito';
import { FormProcessoTrabalhistaReturnAuditoriaOito } from './Return/tipo-demanda/processo-trabalhista/auditoria-oito';
import { FormProconReturnAuditoriaOito } from './Return/tipo-demanda/procon/auditoria-oito';

import { FormOficioJudicialNeonEsteiraOitoPage } from './Neon/tipo-demanda/oficio-judicial/esteira-oito';
import { FormOficioJudicialNeonExcecaoOitoPage } from './Neon/tipo-demanda/oficio-judicial/excecao-oito';
import { FormOficioJudicialNeonConsultaDemandasPage } from './Neon/tipo-demanda/oficio-judicial/consulta';
import { FormOficioJudicialNeonAuditoriaOitoPage } from './Neon/tipo-demanda/oficio-judicial/auditoria-oito';
import { FormOficioJudicialNeonEsteiraClientePage } from './Neon/tipo-demanda/oficio-judicial/esteira-cliente';
import { FormOficioJudicialNeonExcecaoClientePage } from './Neon/tipo-demanda/oficio-judicial/excecao-cliente';
import { FormInterviewPortalUploadNeon } from './Neon/portalupload/Interview';

import { FormOficioJudicialSumUpAuditoriaOito } from './Sumup/tipo-demanda/oficio-judicial/auditoria-oito';
import { FormOficioPolicialSumUpAuditoriaOito } from './Sumup/tipo-demanda/oficio-policial/auditoria-oito';
import { FormOficioJudicialSumUpConsultaDemandas } from './Sumup/tipo-demanda/oficio-judicial/consulta';
import { FormOficioPolicialSumUpConsultaDemandas } from './Sumup/tipo-demanda/oficio-policial/consulta';
import { FormOficioJudicialSumUpEsteiraOito } from './Sumup/tipo-demanda/oficio-judicial/esteira-oito';
import { FormOficioPolicialSumUpEsteiraOito } from './Sumup/tipo-demanda/oficio-policial/esteira-oito';
import { FormOficioJudicialSumUpEsteiraCliente } from './Sumup/tipo-demanda/oficio-judicial/esteira-cliente';
import { FormOficioPolicialSumUpEsteiraCliente } from './Sumup/tipo-demanda/oficio-policial/esteira-cliente';
import { FormOficioJudicialSumUpExcecaoOito } from './Sumup/tipo-demanda/oficio-judicial/excecao-oito';
import { FormOficioPolicialSumUpExcecaoOito } from './Sumup/tipo-demanda/oficio-policial/excecao-oito';
import { FormOficioJudicialSumUpExcecaoCliente } from './Sumup/tipo-demanda/oficio-judicial/excecao-cliente';
import { FormOficioPolicialSumUpExcecaoCliente } from './Sumup/tipo-demanda/oficio-policial/excecao-cliente';
import { FormInterviewPortalUploadSumUp } from './Sumup/portalupload/Interview';
import { FormTipificacaoSumUpAuditoriaOito } from './Sumup/tipificacao/auditoria-oito';
import { FormTipificacaoSumUpEsteiraOito } from './Sumup/tipificacao/esteira-oito';

import { FormCadastroJuridicoBookingEsteiraOito } from './Booking/tipo-demanda/cadastro-juridico/esteira-oito';
import { FormProconBookingEsteiraOito } from './Booking/tipo-demanda/procon/esteira-oito';
import { FormTipificacaoSumUpExcecaoOito } from './Sumup/tipificacao/excecao-oito';
import { FormTipificacaoSumUpConsultaDemandas } from './Sumup/tipificacao/consulta';
import { FormTipificacaoReturnConsultaDemandas } from './Return/tipificacao/consulta';
import { FormTipificacaoReturnExcecaoOito } from './Return/tipificacao/excecao-oito';
import { FormTipificacaoPicPayGroupExcecaoOitoPage } from './PicPayGroup/tipificacao/excecao-oito';
import { FormTipificacaoPicPayGroupConsultaDemandas } from './PicPayGroup/tipificacao/consulta';
import { FormCadastroJuridicoBookingAuditoriaOito } from './Booking/tipo-demanda/cadastro-juridico/auditoria-oito';
import { FormProconBookingAuditoriaOito } from './Booking/tipo-demanda/procon/auditoria-oito';
import { FormCadastroJuridicoBookingConsultaDemandas } from './Booking/tipo-demanda/cadastro-juridico/consulta';
import { FormProconBookingConsultaDemandas } from './Booking/tipo-demanda/procon/consulta';
import { FormCadastroJuridicoBookingExcecaoOito } from './Booking/tipo-demanda/cadastro-juridico/excecao-oito';
import { FormProconBookingExcecaoOito } from './Booking/tipo-demanda/procon/excecao-oito';
import { FormAtualizacaoBookingAuditoriaOito } from './Booking/tipo-demanda/atualizacao/auditoria-oito';
import { FormAtualizacaoBookingConsultaDemandas } from './Booking/tipo-demanda/atualizacao/consulta';
import { FormAtualizacaoBookingEsteiraOito } from './Booking/tipo-demanda/atualizacao/esteira-oito';
import { FormAtualizacaoBookingExcecaoOito } from './Booking/tipo-demanda/atualizacao/excecao-oito';
import { FormCitacaoIntimacaoPicPayGroupEsteiraOito } from './PicPayGroup/tipo-demanda/citacao-intimacao/esteira-oito';
import { FormCadastroJuridicoBookingExcecaoCliente } from './Booking/tipo-demanda/cadastro-juridico/excecao-cliente';
import { FormProconBookingExcecaoCliente } from './Booking/tipo-demanda/procon/excecao-cliente';
import { FormAtualizacaoBookingExcecaoCliente } from './Booking/tipo-demanda/atualizacao/excecao-cliente';
import { FormProconSumUpEsteiraOito } from './Sumup/tipo-demanda/procon/esteira-oito';
import { FormProconSumUpExcecaoOito } from './Sumup/tipo-demanda/procon/excecao-oito';
import { FormProconSumUpExcecaoCliente } from './Sumup/tipo-demanda/procon/excecao-cliente';
import { FormProconSumUpConsultaDemandas } from './Sumup/tipo-demanda/procon/consulta';
import { FormProconSumUpAuditoriaOito } from './Sumup/tipo-demanda/procon/auditoria-oito';
import { FormCadastroJuridicoSumUpEsteiraOito } from './Sumup/tipo-demanda/cadastro-juridico/esteira-oito';
import { FormProconSumUpEsteiraCliente } from './Sumup/tipo-demanda/procon/esteira-cliente';
import { FormCadastroJuridicoSumUpExcecaoCliente } from './Sumup/tipo-demanda/cadastro-juridico/excecao-cliente';
import { FormCadastroJuridicoSumUpExcecaoOito } from './Sumup/tipo-demanda/cadastro-juridico/excecao-oito';
import { FormCadastroJuridicoSumUpConsultaDemandas } from './Sumup/tipo-demanda/cadastro-juridico/consulta';
import { FormCadastroJuridicoSumUpAuditoriaOito } from './Sumup/tipo-demanda/cadastro-juridico/auditoria-oito';


export const Form = {
  Global: {
    Auth: {
      Login: FormLoginGlobal,
      NewPasswordRequired: FormNewPasswordRequiredGlobal,
      PasswordReset: FormPasswordResetGlobal,
      PasswordResetConfirm: FormPasswordResetConfirmGlobal,
      Signup: FormSignUpGlobal,
    },
    User: {
      UserChangePassword: FormUserChangePasswordGlobal,
      UserProfile: FormUserProfileGlobal,
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadGlobal,
    },
    Report: ReportFormGlobal,
  },
  Booking: {
    Auditoria: {
      Oito: {
        CadastroJuridico: FormCadastroJuridicoBookingAuditoriaOito,
        Procon: FormProconBookingAuditoriaOito,
        Atualizacao: FormAtualizacaoBookingAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CadastroJuridico: FormCadastroJuridicoBookingConsultaDemandas,
        Procon: FormProconBookingConsultaDemandas,
        Atualizacao: FormAtualizacaoBookingConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        CadastroJuridico: FormCadastroJuridicoBookingEsteiraOito,
        Procon: FormProconBookingEsteiraOito,
        Atualizacao: FormAtualizacaoBookingEsteiraOito,
      }
    },
    Excecao: {
      Oito: {
        CadastroJuridico: FormCadastroJuridicoBookingExcecaoOito,
        Procon: FormProconBookingExcecaoOito,
        Atualizacao: FormAtualizacaoBookingExcecaoOito,
      },
      Cliente: {
        CadastroJuridico: FormCadastroJuridicoBookingExcecaoCliente,
        Procon: FormProconBookingExcecaoCliente,
        Atualizacao: FormAtualizacaoBookingExcecaoCliente,
      }
    },
  },
  PicPayIp: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupEsteiraOito,
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  PicPayOutrasEmpresas: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  PicPayBank: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  Laguz: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  Guiabolso: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  BancoOriginal: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoPicPayGroupAuditoriaOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupAuditoriaOito,
        OficioPolicial: FormOficioPolicialPicPayGroupAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialPicPayGroupConsultaDemandas,
        Procon: FormProconPicPayGroupConsultaDemandas,
        Outro: FormOutroPicPayGroupConsultaDemandas,
        OficioJudicial: FormOficioJudicialPicPayGroupConsultaDemandas,
        OficioPolicial: FormOficioPolicialPicPayGroupConsultaDemandas,
        Tipificacao: FormTipificacaoPicPayGroupConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        CitacaoIntimacao: FormCitacaoIntimacaoPicPayGroupEsteiraOito,
        Tipificacao: TipificacaoPicPayGroupEsteiraOitoPage,
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraOito,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupEsteiraCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupEsteiraCliente
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoOito,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoOito,
        Tipificacao: FormTipificacaoPicPayGroupExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialPicPayGroupExcecaoCliente,
        OficioPolicial: FormOficioPolicialPicPayGroupExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadPicPayGroup,
    },
  },
  Return: {
    Auditoria: {
      Oito: {
        Tipificacao: FormTipificacaoReturnAuditoriaOitoPage,
        Atualizacao: FormAtualizacaoReturnAuditoriaOito,
        CadastroJuridico: FormCadastroJuridicoReturnAuditoriaOito,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialReturnAuditoriaOito,
        ProcessoTrabalhista: FormProcessoTrabalhistaReturnAuditoriaOito,
        Procon: FormProconReturnAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        Atualizacao: FormAtualizacaoReturnConsultaDemandas,
        CadastroJuridico: FormCadastroJuridicoReturnConsultaDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialReturnConsultaDemandas,
        ProcessoTrabalhista: FormProcessoTrabalhistaReturnConsultaDemandas,
        Procon: FormProconReturnConsultaDemandas,
        Outro: FormDemandaOutroReturnConsultaDemanda,
        Tipificacao: FormTipificacaoReturnConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        Atualizacao: FormAtualizacaoReturnEsteiraOito,
        CadastroJuridico: FormCadastroJuridicoReturnEsteiraOito,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialReturnEsteiraOito,
        ProcessoTrabalhista: FormProcessoTrabalhistaReturnEsteiraOito,
        Tipificacao: FormTipificacaoReturnEsteiraOito,
        Procon: FormProconReturnEsteiraOito,
      }
    },
    Excecao: {
      Oito: {
        Atualizacao: FormAtualizacaoReturnExcecaoDemandas,
        CadastroJuridico: FormCadastroJuridicoReturnExcecaoDemandas,
        NotificacaoExtrajudicial: FormNotificacaoExtrajudicialReturnExcecaoSistemica,
        ProcessoTrabalhista: FormProcessoTrabalhistaReturnExcecaoDemandas,
        Procon: FormProconReturnExcecaoDemandas,
        Tipificacao: FormTipificacaoReturnExcecaoOito,
      }
    }
  },
  SumUp: {
    Auditoria: {
      Oito: {
        OficioJudicial: FormOficioJudicialSumUpAuditoriaOito,
        OficioPolicial: FormOficioPolicialSumUpAuditoriaOito,
        Tipificacao: FormTipificacaoSumUpAuditoriaOito,
        Procon: FormProconSumUpAuditoriaOito,
        CadastroJuridico: FormCadastroJuridicoSumUpAuditoriaOito,
      }
    },
    Consulta: {
      Demanda: {
        OficioJudicial: FormOficioJudicialSumUpConsultaDemandas,
        OficioPolicial: FormOficioPolicialSumUpConsultaDemandas,
        Tipificacao: FormTipificacaoSumUpConsultaDemandas,
        Procon: FormProconSumUpConsultaDemandas,
        CadastroJuridico: FormCadastroJuridicoSumUpConsultaDemandas,
      }
    },
    Esteira: {
      Oito: {
        CadastroJuridico: FormCadastroJuridicoSumUpEsteiraOito,
        OficioJudicial: FormOficioJudicialSumUpEsteiraOito,
        OficioPolicial: FormOficioPolicialSumUpEsteiraOito,
        Tipificacao: FormTipificacaoSumUpEsteiraOito,
        Procon: FormProconSumUpEsteiraOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialSumUpEsteiraCliente,
        OficioPolicial: FormOficioPolicialSumUpEsteiraCliente,
        Procon: FormProconSumUpEsteiraCliente,
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialSumUpExcecaoOito,
        OficioPolicial: FormOficioPolicialSumUpExcecaoOito,
        Tipificacao: FormTipificacaoSumUpExcecaoOito,
        Procon: FormProconSumUpExcecaoOito,
        CadastroJuridico: FormCadastroJuridicoSumUpExcecaoOito,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialSumUpExcecaoCliente,
        OficioPolicial: FormOficioPolicialSumUpExcecaoCliente,
        Procon: FormProconSumUpExcecaoCliente,
        CadastroJuridico: FormCadastroJuridicoSumUpExcecaoCliente,
      }
    },
    PortalUpload: {
      Interview: FormInterviewPortalUploadSumUp,
    },
  },
  Neon: {
    Auditoria: {
      Oito: {
        OficioJudicial: FormOficioJudicialNeonAuditoriaOitoPage,
      },
      Cliente: {
        OficioJudicial: null,
      },
    },
    Consulta: {
      Demanda: {
        OficioJudicial: FormOficioJudicialNeonConsultaDemandasPage,
      }
    },
    Esteira: {
      Oito: {
        OficioJudicial: FormOficioJudicialNeonEsteiraOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialNeonEsteiraClientePage,
      }
    },
    Excecao: {
      Oito: {
        OficioJudicial: FormOficioJudicialNeonExcecaoOitoPage,
      },
      Cliente: {
        OficioJudicial: FormOficioJudicialNeonExcecaoClientePage,
      }
    }, 
    PortalUpload: {
      Interview: FormInterviewPortalUploadNeon
    }
  }
}