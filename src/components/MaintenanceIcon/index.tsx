import moment from "moment";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import * as Icon from "@phosphor-icons/react";
import { useAuthStore } from "@/zustand-store/auth.store";
import React from "react";
import { useShallow } from "zustand/shallow";

const MaintenanceIconPrimitive = () => {
  const router = useRouter();

  const maintenanceDate = new Date();

  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const startAt = new Date();
  const endAt = new Date();

  const modalMaintenanceRef = useRef<any>(null);

  const openModalMaintenance = () => {
    modalMaintenanceRef.current?.openModal();
  }

  const redirectMaintenancePage = () => {
    router.push('/maintenance');
  };

  const getMaintenanceIcon = () => {
    const startAt = new Date();
    const endAt = new Date();
  
    if(!startAt) {
      return function IconTimer() {
        return null
      }
    }
  
    if(moment().isSameOrAfter(moment(startAt)) && moment().isSameOrBefore(moment(endAt))) {   
      return function IconTimer() {
        return <Icon.Timer className="text-red-500 text-3xl" weight="duotone" />
      }
    }
  
    if(moment().isSameOrAfter(moment(startAt).subtract(10, 'minutes')) && moment().isBefore(moment(startAt))) {     
      return function IconTimer() {
        return <Icon.Timer className="text-orange-500 text-3xl" weight="duotone" />
      }
    }
  
    if(moment().isSameOrAfter(moment(startAt).subtract(1, 'hour')) && moment().isBefore(moment(startAt))) {
      return function IconTimer() {
        return <Icon.Timer className="text-yellow-500 text-3xl" weight="duotone" />
      }
    }
  
    if(moment().isBefore(moment(startAt).subtract(1, 'hour'))) {
      return function IconTimer() {
        return <Icon.Timer className="text-green-500 text-3xl" weight="duotone" />
      }
    }
  
    return function IconTimer() {
      return <Icon.Timer className="text-black dark:text-white text-3xl" weight="duotone" />
    }
  }

  const MaintenanceIcon = getMaintenanceIcon();

  return (
    <>
      <button onClick={openModalMaintenance}>
        <MaintenanceIcon />
      </button>
    </>
  )
}

export const MaintenanceIcon = React.memo(MaintenanceIconPrimitive);