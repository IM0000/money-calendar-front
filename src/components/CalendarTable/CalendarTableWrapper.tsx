// CalendarTableWrapper.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import useFixedDateObserver from '@/hooks/useFixedDateObserver';
import useCalendarStore from '@/zustand/useCalendarDateStore';
import { formatLocalISOString } from '@/utils/dateUtils';

interface CalendarTableWrapperProps {
  headerRefs: React.RefObject<HTMLTableRowElement>[];
  children: React.ReactNode;
  isLoading?: boolean; // 로딩 상태 prop 추가
}

export default function CalendarTableWrapper({
  headerRefs,
  children,
  isLoading = false,
}: CalendarTableWrapperProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const userInteracted = useRef(false); // 사용자가 직접 선택했는지 추적

  // 공통 observer 적용
  useFixedDateObserver({
    headerRefs,
    containerSelector: '.calendar-table-container',
  });

  const { selectedDate } = useCalendarStore();

  // 선택된 날짜로 스크롤하는 함수
  const scrollToSelectedDate = useCallback(
    (behavior: 'auto' | 'smooth' = 'auto') => {
      if (!selectedDate || !tableContainerRef.current || isLoading) return;

      const dateStr = formatLocalISOString(selectedDate).slice(0, 10);
      const targetHeaderRef = headerRefs.find(
        (ref) => ref.current?.getAttribute('data-date') === dateStr,
      );

      if (targetHeaderRef && targetHeaderRef.current) {
        const tableHeader = document.querySelector('.calendar-table-header');
        const headerHeight = tableHeader
          ? tableHeader.getBoundingClientRect().height
          : 0;
        const tolerance = 0.3; // tolerance 추가

        const targetScrollTop =
          targetHeaderRef.current.offsetTop - headerHeight + tolerance;
        tableContainerRef.current.scrollTo({
          top: targetScrollTop,
          behavior,
        });
      }
    },
    [selectedDate, headerRefs, isLoading],
  );

  // selectedDate 변경 감지 - 사용자 상호작용 추적
  const prevSelectedDate = useRef(selectedDate);
  useEffect(() => {
    if (
      prevSelectedDate.current &&
      prevSelectedDate.current.getTime() !== selectedDate.getTime()
    ) {
      userInteracted.current = true;
    }
    prevSelectedDate.current = selectedDate;
  }, [selectedDate]);

  // 1. 초기 로드 완료 시 → 즉시 스크롤 (auto)
  useEffect(() => {
    if (!isLoading && !isInitialized.current) {
      const timer = setTimeout(() => {
        scrollToSelectedDate('auto');
        isInitialized.current = true;
        userInteracted.current = false; // 초기화 후 사용자 상호작용 리셋
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isLoading, scrollToSelectedDate]);

  // 2. 사용자가 날짜를 선택했을 때 → 부드러운 스크롤 (smooth)
  useEffect(() => {
    if (isInitialized.current && userInteracted.current && !isLoading) {
      const timer = setTimeout(() => {
        scrollToSelectedDate('smooth');
        userInteracted.current = false; // 스크롤 후 리셋
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [selectedDate, scrollToSelectedDate, isLoading]);

  return (
    <div
      ref={tableContainerRef}
      className="relative w-screen max-w-full overflow-y-auto calendar-table-container"
      style={{ maxHeight: '600px' }}
    >
      {children}
    </div>
  );
}
