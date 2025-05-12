'use client';

import { Tab } from '@/components/Tab3.0';
import { useMemo } from 'react';
import { ToggleTheme } from '@/components/ToggleTheme';
import { TabProps, useNavigationStore } from '@/zustand-store/navigation.store';
import { Tooltip } from '@/components/Tooltip2.0';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';
import { useAuthStore } from '@/zustand-store/auth.store';
import { FontSizeControl } from '@/components/FontSizeControl';

export function Header() { 
  const menu = useNavigationStore((state) => state.menu);

  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const rootSelected = menu?.find((item) => item.selected);

  const tabs: TabProps[] = useMemo(() => rootSelected?.tabs?.filter((tab) => tab.visible)?.map((tab) => {
    return {
      id: tab.id,
      title: tab.title,
      href: tab.href,
      pathname: tab.pathname,
      selected: tab.selected,
      visible: tab.visible,
      permissions: tab.permissions,
    }
  }) ?? [], [rootSelected?.tabs]);

  return (
    <header className='sticky top-0 z-50 w-full'>
      <div className='flex items-center w-full bg-zinc-100 dark:bg-zinc-800 pr-6 gap-4'>
        <nav className='w-full'>
          <Tab.Root>
            {
              tabs.map((tab, index) => {
                return (
                  <Tab.Item 
                    key={tab.id + tab.title}
                    href={tab.href}
                    selected={tab.selected}
                  >
                    { tab.title.toUpperCase() }
                  </Tab.Item>
                )
              })
            }
          </Tab.Root>
        </nav>

        <div className="flex items-center gap-2">
          <ToggleTheme.Root className="justify-center items-center cursor-pointer">
            <ToggleTheme.Icon />
          </ToggleTheme.Root>
        </div>

        <div className="flex items-center gap-2">
          <FontSizeControl.Root className="justify-center items-center cursor-pointer">
            <FontSizeControl.Actions />
          </FontSizeControl.Root>
        </div>

        {
          menu.filter((item) => item.level === 999 && item.visible).map((item, index) => {
            return (
              <Tooltip.Root key={item.title}>
                <Tooltip.Trigger>
                  <Link href='/user/profile'>
                    <Avatar src='' text={user?.name} />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content side='left'>
                  {user?.name}
                </Tooltip.Content>
              </Tooltip.Root>
            )
          })
        }
      </div>
    </header>
  )
}
