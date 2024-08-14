import { times, weeks } from '@/constants/ShadcnCalendarConstants';
import { cn } from '@/lib/utils';

export default function ShadcnCalendar() {
  // 9 by 18 table
  const boxClassname = 'py-4 px-6';
  const borderClassname = 'border border-[#E0E0E0]';
  return (
    <div className="flex flex-col w-full bg-white">
      {Array.from({ length: 18 }).map((_, i) => {
        return (
          <div className="flex w-full" key={i}>
            {Array.from({ length: 8 }).map((_, j) => {
              return (
                <div
                  className={cn(
                    'h-[60px] flex items-center justify-center border border-[#E0E0E0]',
                    j % 8 === 0 ? 'flex-[0.5]' : 'flex-1',
                  )}
                  key={j}
                >
                  {i === 0 && j > 0 && <h4 className={cn('text-[#374151] text-sm')}>{weeks[j - 1].title}</h4>}
                  {j === 0 && i > 0 && <h4 className={cn('text-[#374151] text-sm')}>{times[i - 1].time}</h4>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
