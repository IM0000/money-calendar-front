import { useState, useRef, useEffect } from 'react';
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosCalendar,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';
import Calendar from '@/components/FilterPanel/Calendar'; // 달력 컴포넌트 import
import CalendarEventCards from '@/components/FilterPanel/CalendarEventCards';
import useCalendarStore from '@/zustand/useCalendarDateStore';
import { DateRange } from '@/types/calendar-date-range';
import { useQuery } from '@tanstack/react-query';
import {
  getCalendarEvents,
  getFavoriteCalendarEvents,
} from '@/api/services/calendarService';
import {
  DividendEvent,
  EarningsEvent,
  EconomicIndicatorEvent,
} from '@/types/calendar-event';
import { CalendarPanelSkeleton } from '@/components/UI/Skeleton';
import { useAuthStore } from '@/zustand/useAuthStore';
import toast from 'react-hot-toast';

interface CalendarPanelProps {
  dateRange: DateRange;
  data?: {
    earnings: EarningsEvent[];
    dividends: DividendEvent[];
    economicIndicators: EconomicIndicatorEvent[];
  } | null;
  isLoading?: boolean;
  error?: Error | null;
  isFavoritePage?: boolean; // 관심 일정 페이지 여부
}

export default function CalendarPanel({
  dateRange,
  data: externalData,
  isLoading: externalIsLoading = false,
  error: externalError = null,
  isFavoritePage = false, // 기본값: 일반 페이지
}: CalendarPanelProps) {
  // 로그인 상태 확인
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Zustand 스토어에서 날짜 관련 상태와 setter들을 가져옵니다.
  const { selectedDate, subSelectedDates, setSelectedDate } =
    useCalendarStore();

  // 카드 섹션 토글 상태 등 기존 UI 관련 상태
  const [showCards, setShowCards] = useState(true);
  const toggleCards = () => setShowCards((prev) => !prev);

  // 달력 팝오버 토글 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  // "오늘" 버튼: 오늘 날짜를 스토어에 업데이트 (subSelectedDates도 자동 업데이트)
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  // 지난주 버튼: 현재 선택된 날짜에서 7일 이전 날짜를 스토어에 업데이트
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  // 다음주 버튼: 현재 선택된 날짜에서 7일 이후 날짜를 스토어에 업데이트
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // 날짜를 "YYYY년 M월 D일" 형식으로 포맷하는 헬퍼 함수
  const formatHeaderDate = (date: Date): string =>
    `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  // 일주일 범위(일요일~토요일)가 준비되었다면 헤더에 표시할 텍스트 생성
  let dateRangeText = '';
  if (subSelectedDates.length === 7) {
    const start = subSelectedDates[0];
    const end = subSelectedDates[6];
    // 같은 연도, 같은 월이면 시작 날짜만 연도, 월을 표시하고 끝 날짜는 일(day)만 표시
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
    ) {
      dateRangeText = `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getDate()}일`;
    } else {
      dateRangeText = `${formatHeaderDate(start)} - ${formatHeaderDate(end)}`;
    }
  }

  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // 인증 상태 확인 (특히 관심 일정 페이지에서 필요)
  useEffect(() => {
    if (isFavoritePage) {
      checkAuth();
    }
  }, [isFavoritePage, checkAuth]);

  // Outside click handler for calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 오늘 날짜와 비교하여 dateRange가 과거 데이터인지 판단
  const today = new Date();
  const endDateObj = new Date(dateRange.endDate);
  const isPastData = endDateObj < today;

  // 일반 일정 데이터 쿼리 (외부 데이터가 없을 때만 실행)
  const {
    data: regularData,
    isLoading: isRegularLoading,
    error: regularError,
  } = useQuery({
    queryKey: ['calendarEvents', dateRange.startDate, dateRange.endDate],
    queryFn: () => getCalendarEvents(dateRange.startDate, dateRange.endDate),
    enabled:
      !!dateRange.startDate &&
      !!dateRange.endDate &&
      !isFavoritePage &&
      !externalData,
    staleTime: isPastData ? Infinity : 1000 * 60 * 1, // 과거 데이터는 무한 캐시, 아니면 1분 유지
    gcTime: isPastData ? Infinity : 1000 * 60 * 5, // 과거 데이터는 무한, 아니면 5분 후 삭제
    refetchOnWindowFocus: isPastData ? false : true, // 창이 포커스될 때마다 refetch 실행
  });

  // 관심 일정 데이터 쿼리
  const {
    data: favoriteData,
    isLoading: isFavoriteLoading,
    error: favoriteError,
  } = useQuery({
    queryKey: [
      'favoriteCalendarEvents',
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getFavoriteCalendarEvents(dateRange.startDate, dateRange.endDate),
    enabled:
      !!dateRange.startDate &&
      !!dateRange.endDate &&
      isFavoritePage &&
      isAuthenticated,
    staleTime: isPastData ? Infinity : 1000 * 60 * 1,
    gcTime: isPastData ? Infinity : 1000 * 60 * 5,
    refetchOnWindowFocus: isPastData ? false : true,
  });

  // 사용할 데이터와 로딩 상태 결정 (외부 데이터 우선)
  const data = externalData
    ? { data: externalData }
    : isFavoritePage
      ? favoriteData
      : regularData;
  const isLoading = externalData
    ? externalIsLoading
    : isFavoritePage
      ? isFavoriteLoading
      : isRegularLoading;
  const error = externalData
    ? externalError
    : isFavoritePage
      ? favoriteError
      : regularError;

  // 백엔드에서 받아온 데이터 (패칭 실패 시 빈 배열 처리)
  const earnings = data?.data?.earnings ?? [];
  const dividends = data?.data?.dividends ?? [];
  const economicIndicators = data?.data?.economicIndicators ?? [];

  if (isLoading) {
    return <CalendarPanelSkeleton />;
  }

  if (error) {
    toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    return <CalendarPanelSkeleton />;
  }

  return (
    <div className="w-full max-w-full">
      {/* 헤더 섹션: 토글 버튼, 오늘 버튼, 달력 버튼 및 주간 화살표, 날짜 범위 */}
      <div className="mb-2 flex items-center gap-2">
        {/* 카드 섹션 표시/숨기기 토글 */}
        <button
          className="rounded-full bg-gray-200 p-2 shadow-md"
          onClick={toggleCards}
        >
          {showCards ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </button>
        {/* 오늘 버튼: 오늘 날짜로 업데이트 */}
        <button
          onClick={goToToday}
          className="text-md rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-200"
        >
          오늘
        </button>
        {/* 달력 버튼 및 주간 이동 버튼 */}
        <div className="flex items-center gap-1">
          {/* 달력 버튼 및 팝오버 */}
          <div className="relative" ref={calendarContainerRef}>
            <button
              onClick={toggleCalendar}
              className="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-200"
            >
              <IoIosCalendar size={20} />
            </button>
            {isCalendarOpen && (
              <div className="absolute left-0 top-full z-50 mt-2">
                <div className="rounded bg-white p-2 shadow-lg">
                  <Calendar />
                </div>
              </div>
            )}
          </div>
          {/* 지난주 버튼 */}
          <button
            onClick={goToPreviousWeek}
            title="지난주"
            className="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-200"
          >
            <IoIosArrowBack size={20} />
          </button>
          {/* 다음주 버튼 */}
          <button
            onClick={goToNextWeek}
            title="다음주"
            className="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-200"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
        {/* 선택된 일주일 범위를 표시 */}
        <span className="text-sm font-medium">{dateRangeText}</span>
      </div>

      {/* 카드 섹션 (이벤트 목록) */}
      {showCards && (
        <CalendarEventCards
          earnings={earnings}
          dividends={dividends}
          economicIndicators={economicIndicators}
        />
      )}
    </div>
  );
}
