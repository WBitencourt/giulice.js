'use client'

import { ChevronRight, LogOut, MenuIcon, PanelLeftClose } from "lucide-react"

import { CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { Collapsible, CollapsibleContent } from "../ui/collapsible"
import { useShallow } from "zustand/shallow"
import { useAuthStore } from "@/zustand-store/auth.store"
import { useRouter } from "next/navigation"
import { toast } from "@/utils/toast"
import { useEffect } from "react"
import { IconName, useNavigationStore } from "@/zustand-store/navigation.store"
import * as Icon from '@phosphor-icons/react';
import React from "react"
import Link from "next/link"
import { Tooltip } from "../Tooltip2.0"
import { Slot } from "@radix-ui/react-slot";

import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

interface GetIconMenuProps {
  name: IconName;
  selected?: boolean;
}

export function Sidebar() {

  const router = useRouter();

  const { open, setOpen } = useSidebar();

  const { menu, updateIconCountBadge } = useNavigationStore(
    useShallow((state) => ({
      menu: state.menu,
      updateIconCountBadge: state.updateIconCountBadge,
    }))
  );

  const { signOut, isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      signOut: state.signOut,
      isAuthenticated: state.isAuthenticated,
    }))
  );

  const handleSignOut = async () => {
    try {
      await signOut();

      router.push('/auth/login');
    } catch (error: any) {
      toast.error({
        title: 'Falha ao fazer logout',
        description: error.message,
      });
    }
  }

  const getIconMenu = ({ name, selected = false }: GetIconMenuProps) => {
    const IconComponent = Icon[name] as React.ComponentType<Icon.IconProps>;
  
    const selectedIcon = () => (
      <IconComponent className="text-cyan-400 text-xl" weight="duotone" />
    );

    selectedIcon.displayName = `SelectedIcon-${name}`; // Adiciona o displayName
  
    const defaultIcon = () => (
      <IconComponent className="text-zinc-500 dark:text-zinc-400 text-xl" weight="regular" />
    );

    defaultIcon.displayName = `DefaultIcon-${name}`; // Adiciona o displayName
  
    return selected ? selectedIcon : defaultIcon;
  };
  
  const Menu = () => {
    const levels = menu.reduce((acc, item) => {
      if(!acc.includes(item.level)) {
        acc.push(item.level);
      }

      return acc;
    }, [] as number[]);

    const MenuLevel = ({ level }: { level: number}) => (
      menu.filter((item) => level !== 999 && item.level === level && item.visible).map((item, index) => {
        const Icon = getIconMenu({ name: item.icon.name, selected: item.selected });

        const tabs = item?.tabs?.filter((tab) => tab.visible);

        return (
          <SidebarMenuItem key={item.title}>
            {
              tabs && tabs.length > 1 ? (
                <Collapsible className="group">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Slot>
                        <Link href={open ? '' : item.href}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild={false}>
                              <Icon />
                            </Tooltip.Trigger>
                            <Tooltip.Content side='right'>
                              {item.title}
                            </Tooltip.Content>
                          </Tooltip.Root>
                          <span>{item.title}</span>
                          <ChevronRight 
                            className="ml-auto group-data-[state=open]:rotate-90 transition-transform" 
                          />
                        </Link>
                      </Slot>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="flex flex-col py-2 gap-4">
                      {tabs.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link href={subItem.href}>{subItem.title}</Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <>
                  <SidebarMenuButton asChild>
                    <Slot>
                      <Link href={item.href}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild={false}>
                            <Icon />
                          </Tooltip.Trigger>
                          <Tooltip.Content side='right'>
                            {item.title}
                          </Tooltip.Content>
                        </Tooltip.Root>
                        <span>{item.title}</span>
                      </Link>
                    </Slot>
                  </SidebarMenuButton>
                  {
                    item.badge.count.valid > 0 || item.badge.count.expired > 0 ? (
                      <SidebarMenuBadge className="flex gap-2">
                        <div className="text-green-500">{item.badge.count.valid}</div>
                        <div className="text-red-500">{item.badge.count.expired}</div>
                      </SidebarMenuBadge>
                    ) : null
                  }
                </>
              )
            }
          </SidebarMenuItem>
        )
      })
    )

    return levels.map((level, index) => {
      return (
        <React.Fragment key={level}>
          <MenuLevel level={level} />
          {
            index < levels.length - 1 &&
            <hr className="bg-zinc-300 dark:bg-zinc-700" />
          }
        </React.Fragment>
      )
    })
  }

  useEffect(() => {
    if(isAuthenticated) {
      updateIconCountBadge();
    }
  }, [isAuthenticated])

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="bg-zinc-100 dark:bg-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {
                open ? (
                  <Slot>
                    <div onClick={() => setOpen(!open)}>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <PanelLeftClose className="w-6 h-6 text-red-500 cursor-pointer" />
                        </Tooltip.Trigger>
                        <Tooltip.Content side='right'>
                          Fechar menu
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <span className="text-sm cursor-pointer">Fechar menu</span>
                    </div>
                  </Slot>
                ) : (
                  <Slot>
                    <div className="flex items-center justify-center" onClick={() => setOpen(!open)}>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <MenuIcon className="w-6 h-6 text-cyan-500 cursor-pointer" />
                        </Tooltip.Trigger>
                        <Tooltip.Content side='right'>
                          Abrir o menu
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </div>
                  </Slot>
                )
              }
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu de navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Menu />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut} 
              asChild
            >
              <button>
                <LogOut className="text-red-500" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
