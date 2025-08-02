import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  roundedFull?: boolean;
  animationDuration?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  roundedFull = false,
  animationDuration = '1.5s',
}) => {
  const classes = [
    'bg-gray-200 animate-pulse',
    roundedFull ? 'rounded-full' : 'rounded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    width: width,
    height: height,
    animationDuration,
  };

  return <div className={classes} style={style} />;
};

// 테이블 행을 위한 스켈레톤
export const TableRowSkeleton: React.FC<{
  columns: number;
  className?: string;
}> = ({ columns, className = '' }) => {
  return (
    <tr className={className}>
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="px-4 py-2">
            <Skeleton width="100%" height="1.5rem" />
          </td>
        ))}
    </tr>
  );
};

// 테이블 그룹을 위한 스켈레톤 (날짜 헤더 + 여러 행)
export const TableGroupSkeleton: React.FC<{
  columns: number;
  rows: number;
  className?: string;
}> = ({ columns, rows, className = '' }) => {
  return (
    <React.Fragment>
      {/* 날짜 헤더 */}
      <tr className={`bg-gray-100 ${className}`}>
        <td colSpan={columns} className="px-4 py-2">
          <Skeleton width="40%" height="1.5rem" />
        </td>
      </tr>
      {/* 데이터 행 */}
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
    </React.Fragment>
  );
};

// 완전한 테이블 스켈레톤 (경제지표용)
export const EconomicIndicatorTableSkeleton: React.FC = () => {
  return (
    <div className="relative w-screen max-w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="w-[70px] min-w-[70px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[50px] min-w-[50px] px-2 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-auto min-w-[300px] px-4 py-2">
              <Skeleton width="60%" height="1rem" />
            </th>
            <th className="w-[90px] min-w-[100px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[110px] min-w-[140px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[110px] min-w-[140px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[110px] min-w-[120px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
          </tr>
        </thead>
        <tbody>
          <TableGroupSkeleton columns={7} rows={3} />
          <TableGroupSkeleton columns={7} rows={2} />
          <TableGroupSkeleton columns={7} rows={4} />
        </tbody>
      </table>
    </div>
  );
};

// 완전한 테이블 스켈레톤 (실적용)
export const EarningsTableSkeleton: React.FC = () => {
  return (
    <div className="relative w-screen max-w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="w-[60px] min-w-[60px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[50px] min-w-[50px] px-2 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-auto min-w-[150px] px-4 py-2">
              <Skeleton width="60%" height="1rem" />
            </th>
            <th className="w-[140px] min-w-[140px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[140px] min-w-[140px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[100px] min-w-[100px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[90px] min-w-[90px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
          </tr>
        </thead>
        <tbody>
          <TableGroupSkeleton columns={7} rows={4} />
          <TableGroupSkeleton columns={7} rows={2} />
          <TableGroupSkeleton columns={7} rows={3} />
        </tbody>
      </table>
    </div>
  );
};

// 완전한 테이블 스켈레톤 (배당용)
export const DividendTableSkeleton: React.FC = () => {
  return (
    <div className="relative w-screen max-w-full overflow-y-auto" style={{ maxHeight: '600px' }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="w-[50px] min-w-[50px] px-2 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-auto min-w-[180px] px-4 py-2">
              <Skeleton width="60%" height="1rem" />
            </th>
            <th className="w-[120px] min-w-[120px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[80px] min-w-[80px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[120px] min-w-[120px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[90px] min-w-[90px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[100px] min-w-[100px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
            <th className="w-[90px] min-w-[90px] px-3 py-2">
              <Skeleton width="100%" height="1rem" />
            </th>
          </tr>
        </thead>
        <tbody>
          <TableGroupSkeleton columns={8} rows={3} />
          <TableGroupSkeleton columns={8} rows={2} />
          <TableGroupSkeleton columns={8} rows={2} />
        </tbody>
      </table>
    </div>
  );
};

// 캘린더 패널 스켈레톤
export const CalendarPanelSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton width="2.5rem" height="2.5rem" roundedFull />
        <Skeleton width="4rem" height="2rem" className="rounded" />
        <div className="flex items-center gap-1">
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
        </div>
        <Skeleton width="12rem" height="2rem" className="ml-2" />
      </div>

      {/* 날짜 이벤트 카드들 */}
      <div className="flex pb-2 overflow-x-auto">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 p-3 mr-2 bg-white border border-gray-300 rounded shadow-sm"
              style={{ width: '11rem' }}
            >
              <Skeleton width="60%" height="1.25rem" className="mb-2" />
              <div className="space-y-2">
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="80%" height="1rem" />
                <Skeleton width="90%" height="1rem" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
