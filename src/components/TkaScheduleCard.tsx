import React from "react";
import { TkaSchedule } from "../services/api";

interface TkaScheduleCardProps {
  schedule: TkaSchedule;
  showActions?: boolean;
  onEdit?: (schedule: TkaSchedule) => void;
  onCancel?: (schedule: TkaSchedule) => void;
  onDelete?: (schedule: TkaSchedule) => void;
}

const TkaScheduleCard: React.FC<TkaScheduleCardProps> = ({
  schedule,
  showActions = false,
  onEdit,
  onCancel,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "regular":
        return "bg-blue-100 text-blue-800";
      case "makeup":
        return "bg-yellow-100 text-yellow-800";
      case "special":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "regular":
        return "📅";
      case "makeup":
        return "🔄";
      case "special":
        return "⭐";
      default:
        return "📅";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = new Date(schedule.start_date) > new Date();
  const isOngoing =
    new Date(schedule.start_date) <= new Date() &&
    new Date(schedule.end_date) >= new Date();
  const isCompleted = new Date(schedule.end_date) < new Date();

  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isOngoing
          ? "border-green-300 bg-green-50"
          : isUpcoming
          ? "border-blue-300 bg-blue-50"
          : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon(schedule.type)}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {schedule.title}
            </h3>
          </div>
          {schedule.description && (
            <p className="text-sm text-gray-600 mb-2">{schedule.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              schedule.status
            )}`}
          >
            {schedule.status === "scheduled"
              ? "Terjadwal"
              : schedule.status === "ongoing"
              ? "Berlangsung"
              : schedule.status === "completed"
              ? "Selesai"
              : "Dibatalkan"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
              schedule.type
            )}`}
          >
            {schedule.type === "regular"
              ? "Reguler"
              : schedule.type === "makeup"
              ? "Susulan"
              : "Khusus"}
          </span>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600">🕐</span>
            <span className="text-sm font-medium text-gray-700">Mulai</span>
          </div>
          <p className="text-sm text-gray-900 font-medium">
            {formatDate(schedule.start_date)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-600">🏁</span>
            <span className="text-sm font-medium text-gray-700">Selesai</span>
          </div>
          <p className="text-sm text-gray-900 font-medium">
            {formatDate(schedule.end_date)}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">⏱️</span>
          <span className="text-sm font-medium text-gray-700">Durasi</span>
        </div>
        <p className="text-sm text-gray-900 font-medium">
          {formatTime(schedule.start_date)} - {formatTime(schedule.end_date)}
        </p>
      </div>

      {/* Instructions */}
      {schedule.instructions && (
        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">📋</span>
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">
                Instruksi Khusus
              </span>
              <p className="text-sm text-gray-800">{schedule.instructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Target Schools */}
      {schedule.target_schools && schedule.target_schools.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-purple-600">🏫</span>
            <span className="text-sm font-medium text-gray-700">
              Sekolah Terpilih
            </span>
          </div>
          <p className="text-sm text-gray-800">
            {schedule.target_schools.length} sekolah terpilih
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {schedule.status === "scheduled" && onEdit && (
            <button
              onClick={() => onEdit(schedule)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
          {(schedule.status === "scheduled" || schedule.status === "ongoing") &&
            onCancel && (
              <button
                onClick={() => onCancel(schedule)}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
              >
                Batalkan
              </button>
            )}
          {onDelete && (
            <button
              onClick={() => onDelete(schedule)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          )}
        </div>
      )}

      {/* Created By */}
      {schedule.created_by && (
        <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
          Dibuat oleh: {schedule.created_by}
        </div>
      )}
    </div>
  );
};

export default TkaScheduleCard;
