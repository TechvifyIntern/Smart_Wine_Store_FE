"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { UserAddress, AddAddressPayload } from "@/types/profile"; // Import AddAddressPayload
import {
  addAddress,
  updateAddress,
  deleteAddress,
  updateDefaultAddress,
} from "@/services/profile/api"; // Import addAddress API call
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { AxiosError } from "axios"; // Import AxiosError

interface SavedAddressesProps {
  userAddresses: UserAddress[] | null;
}

export const SavedAddresses: React.FC<SavedAddressesProps> = ({
  userAddresses,
}) => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [deleteConfirmAddressId, setDeleteConfirmAddressId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Form add
  const [newAddress, setNewAddress] = useState<AddAddressPayload>({
    StreetAddress: "",
    Ward: "",
    Province: "",
    IsDefault: false,
  });

  // Form edit
  const [editAddress, setEditAddress] = useState<UserAddress>({
    UserAddressID: 0,
    UserID: 0,
    StreetAddress: "",
    Ward: "",
    Province: "",
    IsDefault: false,
  });

  // Load from props
  useEffect(() => {
    if (userAddresses) {
      setAddresses(userAddresses);
    }
  }, [userAddresses]);

  // Add new address
  const handleAddAddress = async () => {
    if (!newAddress.StreetAddress || !newAddress.Ward || !newAddress.Province) {
      toast({
        title: "Validation Error",
        description: "Street Address, Ward, and Province are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await addAddress(newAddress);
      if (response.success) {
        // If the new address is default, ensure others are not
        const updatedAddresses = newAddress.IsDefault
          ? addresses.map((a) => ({ ...a, IsDefault: false }))
          : addresses;

        setAddresses([...updatedAddresses, response.data]);
        toast({
          title: "Success",
          description: "Address added successfully!",
          variant: "default",
        });
        setNewAddress({
          StreetAddress: "",
          Ward: "",
          Province: "",
          IsDefault: false,
        });
        setIsAddModalOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add address.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("API Error - addAddress:", err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "Failed to add address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal
  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setEditAddress(address);
    setIsEditModalOpen(true);
  };

  // Save edited address
  const handleSaveEdit = async () => {
    if (!editingAddress) return;

    if (
      !editAddress.StreetAddress ||
      !editAddress.Ward ||
      !editAddress.Province
    ) {
      toast({
        title: "Validation Error",
        description: "Street Address, Ward, and Province are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateAddress(
        {
          StreetAddress: editAddress.StreetAddress,
          Ward: editAddress.Ward,
          Province: editAddress.Province,
          IsDefault: editAddress.IsDefault,
        },
        editingAddress.UserAddressID
      );

      if (response.success) {
        // If the updated address is default, ensure others are not
        const updatedAddresses = response.data.IsDefault
          ? addresses.map((a) =>
              a.UserAddressID === response.data.UserAddressID
                ? response.data
                : { ...a, IsDefault: false }
            )
          : addresses.map((a) =>
              a.UserAddressID === response.data.UserAddressID
                ? response.data
                : a
            );

        setAddresses(updatedAddresses);
        toast({
          title: "Success",
          description: "Address updated successfully!",
          variant: "default",
        });
        setIsEditModalOpen(false);
        setEditingAddress(null);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update address.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("API Error - updateAddress:", err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "Failed to update address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDeleteAddress = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await deleteAddress(id);
      if (response) {
        setAddresses(addresses.filter((addr) => addr.UserAddressID !== id));
        toast({
          title: "Success",
          description: "Address deleted successfully!",
          variant: "default",
        });
        setDeleteConfirmAddressId(null);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete address.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("API Error - deleteAddress:", err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "Failed to delete address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Set default
  const handleSetDefault = async (id: number) => {
    setIsLoading(true);
    try {
      // Find the address to set as default
      const defaultAddress = addresses.find(
        (addr) => addr.UserAddressID === id
      );
      if (!defaultAddress) {
        toast({
          title: "Error",
          description: "Address not found.",
          variant: "destructive",
        });
        return;
      }

      const response = await updateDefaultAddress(id);

      if (response.success) {
        setAddresses(
          addresses.map((addr) =>
            addr.UserAddressID === id
              ? { ...addr, IsDefault: true }
              : { ...addr, IsDefault: false }
          )
        );
        toast({
          title: "Success",
          description: "Default address set successfully!",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to set default address.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("API Error - setDefaultAddress:", err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            err.message ||
            "Failed to set default address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userAddresses) return null;

  return (
    <>
      <div className="bg-card/40 rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Saved Addresses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {addresses.map((address, i) => (
            <div
              key={address.UserAddressID}
              className={`border rounded-lg p-4 relative dark:bg-white/10 bg-card ${
                address.IsDefault ? "border-primary" : "border-gray-200"
              }`}
            >
              {address.IsDefault && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-2 py-1 bg-primary text-primary-foreground font-semibold rounded">
                    Default
                  </span>
                </div>
              )}

              <h3 className="font-bold mb-2">Address #{i + 1}</h3>

              <p className="text-sm mb-4">
                {address.StreetAddress}
                <br />
                {address.Ward}
                <br />
                {address.Province}
              </p>

              <div className="flex gap-2">
                {!address.IsDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleSetDefault(address.UserAddressID)}
                  >
                    <Star size={16} />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEditAddress(address)}
                  disabled={isLoading}
                >
                  <Edit size={16} />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() =>
                    setDeleteConfirmAddressId(address.UserAddressID)
                  }
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200">
          <Button
            className="w-full gap-2"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            <Plus size={16} />
            Add New Address
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="StreetAddress">Street Address</Label>
              <Textarea
                id="StreetAddress"
                value={newAddress.StreetAddress}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    StreetAddress: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="Ward">Ward</Label>
              <Input
                id="Ward"
                value={newAddress.Ward}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, Ward: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="Province">Province</Label>
              <Input
                id="Province"
                value={newAddress.Province}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, Province: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="IsDefault"
                checked={newAddress.IsDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, IsDefault: e.target.checked })
                }
                disabled={isLoading}
              />
              <Label htmlFor="IsDefault">Set as default</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAddress} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Street Address</Label>
              <Textarea
                value={editAddress.StreetAddress}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    StreetAddress: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Ward</Label>
              <Input
                value={editAddress.Ward}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, Ward: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Province</Label>
              <Input
                value={editAddress.Province}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, Province: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editAddress.IsDefault}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    IsDefault: e.target.checked,
                  })
                }
                disabled={isLoading}
              />
              <Label>Set as default</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteConfirmAddressId}
        onOpenChange={() => setDeleteConfirmAddressId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() =>
                deleteConfirmAddressId &&
                handleDeleteAddress(deleteConfirmAddressId)
              }
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
