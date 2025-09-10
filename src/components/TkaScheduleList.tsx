"use client";

import React, { useState, useMemo } from "react";
import { TkaSchedule } from "@/services/api";
import TkaScheduleCard from "./TkaScheduleCard";

interface TkaScheduleListProps {
  schedules: TkaSchedule[];
  loading?: boolean;
  showActions?: boolean;
  onEdit?: (schedule: TkaSchedule) => void;
  onCancel?: (schedule: TkaSchedule) => void;
  onDelete?: (schedule: TkaSchedule) => void;
}

export default function TkaScheduleList({
  schedules,
  loading = false,
  showActions = false,
  onEdit,
  onCancel,
  onDelete,
}: TkaScheduleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "ongoing" | "completed" | "cancelled"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "regular" | "makeup" | "special"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");

  const filteredSchedules = useMemo(() => {
    const filtered = schedules.filter((schedule) => {
      // Search filter
      const matchesSearch =
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        schedule.instructions
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || schedule.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === "all" || schedule.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort schedules
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [schedules, searchQuery, statusFilter, typeFilter, sortBy]);

  const getStatusCount = (status: string) => {
    return schedules.filter((schedule) => schedule.status === status).length;
  };

  const getTypeCount = (type: string) => {
    return schedules.filter((schedule) => schedule.type === type).length;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Jadwal
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul, deskripsi..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "all"
                    | "scheduled"
                    | "ongoing"
                    | "completed"
                    | "cancelled"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Status ({schedules.length})</option>
              <option value="scheduled">
                Terjadwal ({getStatusCount("scheduled")})
              </option>
              <option value="ongoing">
                Berlangsung ({getStatusCount("ongoing")})
              </option>
              <option value="completed">
                Selesai ({getStatusCount("completed")})
              </option>
              <option value="cancelled">
                Dibatalkan ({getStatusCount("cancelled")})
              </option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe
            </label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value as "all" | "regular" | "makeup" | "special"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Tipe ({schedules.length})</option>
              <option value="regular">
                Reguler ({getTypeCount("regular")})
              </option>
              <option value="makeup">Susulan ({getTypeCount("makeup")})</option>
              <option value="special">
                Khusus ({getTypeCount("special")})
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "title" | "status")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Tanggal</option>
              <option value="title">Judul</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              🔄 Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredSchedules.length} dari {schedules.length} jadwal
        </p>
        {filteredSchedules.length !== schedules.length && (
          <p className="text-sm text-red-600">Filter aktif</p>
        )}
      </div>

      {/* Schedules List */}
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak ada jadwal ArahPotensi
          </h3>
          <p className="text-gray-600">
            {schedules.length === 0
              ? "Belum ada jadwal ArahPotensi yang tersedia"
              : "Tidak ada jadwal yang sesuai dengan filter yang dipilih"}
          </p>
          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="mt-4 text-red-600 hover:text-red-800 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredSchedules.map((schedule) => (
            <TkaScheduleCard
              key={schedule.id}
              schedule={schedule}
              showActions={showActions}
              onEdit={onEdit}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
