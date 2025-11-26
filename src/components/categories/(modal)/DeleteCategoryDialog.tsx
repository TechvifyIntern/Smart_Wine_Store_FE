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
import { ProductCategory } from "@/data/product_categories";

interface DeleteCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: ProductCategory | null;
    onConfirm: () => void;
}

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    category,
    onConfirm,
}: DeleteCategoryDialogProps) {
    if (!category) return null;

    const hasProducts = category.ProductCount > 0;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white! border-gray-200!">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900!">
                        {hasProducts ? "Cannot Delete Category" : "Delete Category?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600!">
                        {hasProducts ? (
                            <>
                                The category <strong className="text-gray-900">&quot;{category.CategoryName}&quot;</strong> contains{" "}
                                <strong className="text-red-600">{category.ProductCount} product{category.ProductCount !== 1 ? "s" : ""}</strong>.
                                <br /><br />
                                You cannot delete a category that contains products. Please move or delete all products in this category first.
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete the category{" "}
                                <strong className="text-gray-900">&quot;{category.CategoryName}&quot;</strong>?
                                <br /><br />
                                <span className="text-red-600 font-medium">This action cannot be undone.</span>
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!">
                        {hasProducts ? "Close" : "Cancel"}
                    </AlertDialogCancel>
                    {!hasProducts && (
                        <AlertDialogAction
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Category
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
