import { useRef, useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Card, CardContent, CardHeader } from '@/components/UI/card';
import { formatLocalISOString, formatDate } from '@/utils/dateUtils';
import useCalendarStore from '@/zustand/useCalendarDateStore';
import {
  DividendEvent,
  EarningsEvent,
  EconomicIndicatorEvent,
} from '@/types/calendar-event';

interface CalendarEventCardsProps {
  earnings: EarningsEvent[];
  dividends: DividendEvent[];
  economicIndicators: EconomicIndicatorEvent[];
}

export default function CalendarEventCards({
  earnings,
  dividends,
  economicIndicators,
}: CalendarEventCardsProps) {
  const { subSelectedDates, currentTableTopDate, setSelectedDate } = useCalendarStore();
  
  // 스크롤 관련 로직
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const dayKorean = ['일', '월', '화', '수', '목', '금', '토'];
  const events = subSelectedDates.map((date) => {
    const eventDateStr = formatDate(date); // 예: "2024-07-03"

    const earningCount = earnings.filter(
      (item: EarningsEvent) =>
        formatDate(new Date(item.releaseDate)) === eventDateStr,
    ).length;

    const dividendCount = dividends.filter(
      (item: DividendEvent) =>
        formatDate(new Date(item.exDividendDate)) === eventDateStr,
    ).length;

    const economicIndicatorCount = economicIndicators.filter(
      (item: EconomicIndicatorEvent) =>
        formatDate(new Date(item.releaseDate)) === eventDateStr,
    ).length;

    return {
      rawDate: date,
      date: `${dayKorean[date.getDay()]} ${date.getDate()}일`,
      econ: economicIndicatorCount,
      earning: earningCount,
      dividend: dividendCount,
      event: null,
    };
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* 좌측 스크롤 버튼 (필요할 때만) */}
      {showScrollButtons && (
        <button
          className="absolute left-0 z-10 p-2 transform -translate-y-1/2 bg-gray-200 rounded-full shadow-md opacity-50 top-1/2"
          onClick={scrollLeft}
        >
          <IoIosArrowBack size={24} />
        </button>
      )}

      {/* 카드들을 감싸는 래퍼 */}
      <div
        ref={scrollRef}
        className="flex w-full gap-4 overflow-x-auto scrollbar-hide snap-x"
      >
        {events.map((event, index) => {
          const isFixed =
            currentTableTopDate &&
            formatLocalISOString(event.rawDate).slice(0, 10) ===
              currentTableTopDate;
          return (
            <Card
              key={index}
              onClick={() => {
                setSelectedDate(event.rawDate);
              }}
              className={`w-[calc((100%-6rem)/7)] min-w-[120px] flex-shrink-0 snap-start ${event.event ? 'opacity-50' : ''} ${isFixed ? 'bg-gray-300' : ''}`}
            >
              <CardHeader
                className={`font-semibold ${
                  isToday(event.rawDate)
                    ? 'font-bold underline decoration-[0.20rem] underline-offset-8'
                    : ''
                }`}
              >
                {event.date}
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                {event.event ? (
                  <p>{event.event}</p>
                ) : (
                  <>
                    <p className="flex items-center justify-between">
                      <span>경제지표</span>
                      <span
                        className={`${event.econ > 0 ? 'font-bold' : ''}`}
                      >
                        {event.econ}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>실적</span>
                      <span
                        className={`${
                          event.earning > 0 ? 'font-bold' : ''
                        }`}
                      >
                        {event.earning}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>배당</span>
                      <span
                        className={`${
                          event.dividend > 0 ? 'font-bold' : ''
                        }`}
                      >
                        {event.dividend}
                      </span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 우측 스크롤 버튼 (필요할 때만) */}
      {showScrollButtons && (
        <button
          className="absolute right-0 z-10 p-2 transform -translate-y-1/2 bg-gray-200 rounded-full shadow-md opacity-50 top-1/2"
          onClick={scrollRight}
        >
          <IoIosArrowForward size={24} />
        </button>
      )}
    </div>
  );
}