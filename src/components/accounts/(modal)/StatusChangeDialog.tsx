"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Account } from "@/data/accounts";
import {
  ArrowRight,
  CheckCircle2,
  Ban,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  newStatusId: number;
  onConfirm: () => void;
}

// Cấu hình màu sắc hỗ trợ cả Light & Dark mode
const STATUS_CONFIG: Record<
  number,
  {
    label: string;
    badgeClasses: string;
    iconWrapperClasses: string;
    icon: React.ReactNode;
    btnClasses: string;
  }
> = {
  1: {
    label: "Active",
    badgeClasses:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    iconWrapperClasses:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: <CheckCircle2 className="w-5 h-5" />,
    btnClasses:
      "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500",
  },
  2: {
    label: "Inactive",
    badgeClasses:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    iconWrapperClasses:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    icon: <PauseCircle className="w-5 h-5" />,
    btnClasses:
      "bg-slate-600 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600",
  },
  3: {
    label: "Banned",
    badgeClasses:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    iconWrapperClasses:
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    icon: <Ban className="w-5 h-5" />,
    btnClasses:
      "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500",
  },
};

export function StatusChangeDialog({
  open,
  onOpenChange,
  account,
  newStatusId,
  onConfirm,
}: StatusChangeDialogProps) {
  if (!account) return null;

  const newStatusConfig = STATUS_CONFIG[newStatusId] || STATUS_CONFIG[2];

  const getCurrentStatusText = (id: number) => {
    switch (id) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      case 3:
        return "Banned";
      default:
        return "Unknown";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-950 border-0 dark:border dark:border-slate-800 shadow-xl sm:rounded-xl max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {/* Icon Wrapper dynamic color */}
            <div
              className={`p-2 rounded-full ${newStatusConfig.iconWrapperClasses}`}
            >
              {newStatusConfig.icon}
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Update Account Status
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-gray-500 dark:text-gray-400 text-base">
            Are you sure you want to change the status for account{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              @{account.UserName}
            </span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Info Box */}
        <div className="my-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 space-y-4">
          {/* Transition Visualization */}
          <div className="flex items-center justify-between px-2">
            {/* FROM STATE */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
                From
              </span>
              {/* FIXED: Sử dụng style tĩnh (Neutral) cho trạng thái cũ để tránh xung đột và dễ nhìn hơn */}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm">
                {getCurrentStatusText(account.StatusID)}
              </span>
            </div>

            <ArrowRight className="text-gray-300 dark:text-slate-600 w-5 h-5" />

            {/* TO STATE */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
                To
              </span>
              {/* Trạng thái mới hiển thị màu sắc rõ ràng */}
              <span
                className={`text-sm font-bold px-3 py-1 rounded-md border shadow-sm ${newStatusConfig.badgeClasses}`}
              >
                {newStatusConfig.label}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-800"></div>

          {/* Account Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-xs block mb-0.5">
                Role
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {account.RoleName}
              </span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500 text-xs block mb-0.5">
                Email
              </span>
              <span
                className="text-gray-700 dark:text-gray-300 font-medium truncate"
                title={account.Email}
              >
                {account.Email}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="flex items-start gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            This action will update access rights immediately.
          </span>
        </div>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`${newStatusConfig.btnClasses} border-0 shadow-sm transition-all`}
          >
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
