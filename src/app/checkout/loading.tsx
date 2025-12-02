import { Spinner } from "@/components/ui/spinner";

export default function CheckoutLoading() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Spinner size="lg" />
        </div>
    );
}
