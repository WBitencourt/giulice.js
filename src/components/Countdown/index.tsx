import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
import * as Icon from '@phosphor-icons/react';
import { Tooltip } from '@/components/Tooltip2.0';
import { object } from "@/utils/Object";

interface CountdownProps {
  label?: string;
  time: {
    now: string | undefined;
    start?: string | undefined;
    deadline: string | undefined;
  }
  visible?: boolean;
  paused?: boolean;
  onFinalCountdown?: () => void;
}

const PrimitiveCountdown = ({ 
  label = 'Tempo restante', 
  time,
  onFinalCountdown, 
  visible = true,
  paused = false
}: CountdownProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [now, setNow] = useState(moment(time.now));
  const [display, setDisplay] = useState('');

  const updateTimer = useCallback(() => {
    const updateTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const newTimeoutID = setTimeout(updateTimer, 1000);
      timeoutRef.current = newTimeoutID;
    }

    if (!time?.deadline) {
      setDisplay('--:--:--');
      return;
    }

    if (paused) return;

    const start = moment(time.start);
    const end = moment(time.deadline);

    if (start && now.isBefore(start)) {
      setDisplay('Início as ' + start.format('DD/MM/YYYY HH:mm:ss'));
      updateTimeout();
      return;
    }

    if (now.isAfter(end)) {
      if(onFinalCountdown) {
        onFinalCountdown();
      }

      setDisplay('00:00:00');
      return;
    } 

    const remaining = moment.duration(end.diff(now));
    const hours = remaining.hours().toFixed().padStart(2, '0');
    const minutes = remaining.minutes().toFixed().padStart(2, '0');
    const seconds = remaining.seconds().toFixed().padStart(2, '0');

    setDisplay(`${hours}:${minutes}:${seconds}`);
    setNow(now.add(1, 'second'));
    
    updateTimeout();
  }, [now, time, paused, onFinalCountdown]);

  useEffect(() => {
    updateTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateTimer]);

  useEffect(() => {
    setNow(moment(time.now));
  }, [time.now]);

  if (!visible) {
    return null;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div 
          data-paused={paused}
          data-
          className='flex justify-center items-center gap-2 data-[paused=true]:cursor-wait data-[paused=true]:bg-zinc-300 data-[paused=true]:dark:bg-zinc-500 bg-orange-300 dark:bg-orange-500 p-3 rounded w-full self-start text-black'
        >
          <Icon.Clock className='text-black text-3xl' weight='fill' />
          <p>{label} 
            {' '}
            <strong className='text-xl'>{display}</strong> 
          </p>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side='top'>
        { paused ? 'Timer parado' : '' }
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

const Countdown = React.memo(PrimitiveCountdown, (prevProps, nextProps) => {
  return (
    object.isEqual(prevProps.time, nextProps.time) &&
    prevProps.onFinalCountdown?.toString() === nextProps.onFinalCountdown?.toString() &&
    prevProps.label === nextProps.label &&
    prevProps.visible === nextProps.visible &&
    prevProps.paused === nextProps.paused
  );
});

export default Countdown;
