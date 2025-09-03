import React from "react";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  height = "h-4",
  width = "w-full",
  rounded = true,
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${height} ${width} ${
        rounded ? "rounded" : ""
      } ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <Skeleton height="h-6" width="w-3/4" className="mb-2" />
      <Skeleton height="h-4" width="w-full" className="mb-2" />
      <Skeleton height="h-4" width="w-2/3" className="mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton height="h-6" width="w-20" />
        <Skeleton height="h-8" width="w-16" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border">
      <div className="px-4 sm:px-6 py-4 border-b">
        <Skeleton height="h-6" width="w-32" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height="h-4" width="w-24" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height="h-4" width="w-20" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height="h-4" width="w-32" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton height="h-4" width="w-16" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height="h-4" width="w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height="h-4" width="w-20" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton height="h-4" width="w-32" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton height="h-4" width="w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <ul className="divide-y divide-gray-200">
        {Array.from({ length: items }).map((_, index) => (
          <li key={index} className="px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Skeleton height="h-8" width="w-8" rounded />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <Skeleton height="h-4" width="w-3/4" className="mb-2" />
                <Skeleton height="h-3" width="w-1/2" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton height="h-4" width="w-16" />
                <Skeleton height="h-4" width="w-4" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ items?: number; columns?: number }> = ({
  items = 6,
  columns = 3,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default Skeleton;
