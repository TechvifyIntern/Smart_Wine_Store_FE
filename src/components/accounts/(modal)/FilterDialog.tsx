"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterPopoverContentProps {
  selectedRoles: number[];
  selectedTiers: number[];
  selectedStatuses: number[];
  onApplyFilters: (filters: {
    roles: number[];
    tiers: number[];
    statuses: number[];
  }) => void;
  onClose: () => void;
}

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Seller" },
  { id: 3, name: "Customer" },
];

const tiers = [
  { id: 1, name: "Bronze" },
  { id: 2, name: "Silver" },
  { id: 3, name: "Gold" },
];

const statuses = [
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
  { id: 3, name: "Banned" },
];

export function FilterDialog({
  selectedRoles,
  selectedTiers,
  selectedStatuses,
  onApplyFilters,
  onClose,
}: FilterPopoverContentProps) {
  const [localRoles, setLocalRoles] = useState<number[]>(selectedRoles);
  const [localTiers, setLocalTiers] = useState<number[]>(selectedTiers);
  const [localStatuses, setLocalStatuses] =
    useState<number[]>(selectedStatuses);

  // Sync local state with props when component mounts/updates
  useEffect(() => {
    setLocalRoles(selectedRoles);
    setLocalTiers(selectedTiers);
    setLocalStatuses(selectedStatuses);
  }, [selectedRoles, selectedTiers, selectedStatuses]);

  const handleRoleChange = (roleId: number, checked: boolean) => {
    const newRoles = checked
      ? [...localRoles, roleId]
      : localRoles.filter((id) => id !== roleId);

    setLocalRoles(newRoles);
    onApplyFilters({
      roles: newRoles,
      tiers: localTiers,
      statuses: localStatuses,
    });
  };

  const handleTierChange = (tierId: number, checked: boolean) => {
    const newTiers = checked
      ? [...localTiers, tierId]
      : localTiers.filter((id) => id !== tierId);

    setLocalTiers(newTiers);
    onApplyFilters({
      roles: localRoles,
      tiers: newTiers,
      statuses: localStatuses,
    });
  };

  const handleStatusChange = (statusId: number, checked: boolean) => {
    const newStatuses = checked
      ? [...localStatuses, statusId]
      : localStatuses.filter((id) => id !== statusId);

    setLocalStatuses(newStatuses);
    onApplyFilters({
      roles: localRoles,
      tiers: localTiers,
      statuses: newStatuses,
    });
  };

  const handleClearAll = () => {
    setLocalRoles([]);
    setLocalTiers([]);
    setLocalStatuses([]);
    onApplyFilters({
      roles: [],
      tiers: [],
      statuses: [],
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="font-medium text-gray-900">Filter Accounts</div>

      {/* Roles Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Role</Label>
        <div className="flex flex-wrap gap-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={localRoles.includes(role.id)}
                onCheckedChange={(checked) =>
                  handleRoleChange(role.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`role-${role.id}`}
                className="text-sm font-normal text-gray-700"
              >
                {role.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Tier</Label>
        <div className="flex flex-wrap gap-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tier-${tier.id}`}
                checked={localTiers.includes(tier.id)}
                onCheckedChange={(checked) =>
                  handleTierChange(tier.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`tier-${tier.id}`}
                className="text-sm font-normal text-gray-700"
              >
                {tier.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Statuses Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-900">Status</Label>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.id}`}
                checked={localStatuses.includes(status.id)}
                onCheckedChange={(checked) =>
                  handleStatusChange(status.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`status-${status.id}`}
                className="text-sm font-normal text-gray-700"
              >
                {status.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
