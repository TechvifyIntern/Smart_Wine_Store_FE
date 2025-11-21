"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userAddresses as initialAddresses } from "@/data/profile";

interface Address {
  id: string | number;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export const SavedAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmAddressId, setDeleteConfirmAddressId] = useState<
    string | number | null
  >(null);

  const [newAddress, setNewAddress] = useState({
    type: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });

  const [editAddress, setEditAddress] = useState({
    type: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    if (!newAddress.type || !newAddress.street || !newAddress.city) return;

    // If new address is default, remove default from others
    const updatedAddresses = newAddress.isDefault
      ? addresses.map((addr) => ({ ...addr, isDefault: false }))
      : addresses;

    const newId =
      Math.max(...addresses.map((a) => (typeof a.id === "number" ? a.id : 0))) +
      1;
    setAddresses([...updatedAddresses, { ...newAddress, id: newId }]);
    setNewAddress({
      type: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    });
    setIsAddModalOpen(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setEditAddress({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault ?? false,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingAddress) return;

    const updatedAddresses = editAddress.isDefault
      ? addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...editAddress }
            : { ...addr, isDefault: false }
        )
      : addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...editAddress } : addr
        );

    setAddresses(updatedAddresses);
    setIsEditModalOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string | number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    setDeleteConfirmAddressId(null);
  };

  const handleSetDefault = (id: string | number) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, isDefault: true }
          : { ...addr, isDefault: false }
      )
    );
  };

  return (
    <>
      <div className=" bg-card/40 rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Saved Addresses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 relative dark:bg-white/10 bg-card ${
                address.isDefault ? "border-primary" : "border-gray-200"
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-2 py-1 bg-primary text-primary-foreground font-semibold rounded">
                    Default
                  </span>
                </div>
              )}
              <h3 className="font-bold mb-2">{address.type}</h3>
              <p className="text-sm mb-4">
                {address.street}
                <br />
                {address.city}, {address.state} {address.zip}
                <br />
                {address.country}
              </p>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 gap-2"
                    title="Set as default"
                  >
                    <Star size={16} />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEditAddress(address)}
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setDeleteConfirmAddressId(address.id)}
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
          >
            <Plus size={16} />
            Add New Address
          </Button>
        </div>
      </div>

      {/* Add Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-type">Type</Label>
              <Select
                value={newAddress.type}
                onValueChange={(value) =>
                  setNewAddress({ ...newAddress, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-street">Street Address</Label>
              <Textarea
                id="add-street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-city">City</Label>
                <Input
                  id="add-city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="add-state">State</Label>
                <Input
                  id="add-state"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-zip">ZIP Code</Label>
                <Input
                  id="add-zip"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="add-country">Country</Label>
                <Input
                  id="add-country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="add-default"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
              />
              <Label htmlFor="add-default">Set as default address</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddress}>Add Address</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editAddress.type}
                onValueChange={(value) =>
                  setEditAddress({ ...editAddress, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-street">Street Address</Label>
              <Textarea
                id="edit-street"
                value={editAddress.street}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, street: e.target.value })
                }
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editAddress.city}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={editAddress.state}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, state: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-zip">ZIP Code</Label>
                <Input
                  id="edit-zip"
                  value={editAddress.zip}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, zip: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={editAddress.country}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, country: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-default"
                checked={editAddress.isDefault}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    isDefault: e.target.checked,
                  })
                }
              />
              <Label htmlFor="edit-default">Set as default address</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmAddressId}
        onOpenChange={() => setDeleteConfirmAddressId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteConfirmAddressId &&
                handleDeleteAddress(deleteConfirmAddressId)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
