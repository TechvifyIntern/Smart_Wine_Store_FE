import { DiscountEvent } from "@/data/discount_event";
import EventRow from "./EventRow";
import NotFoundEvent from "./NotFoundEvent";

interface EventsTableProps {
    events: DiscountEvent[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    getEventStatus: (timeStart: string, timeEnd: string) => string;
    formatDate: (dateString: string) => string;
    emptyMessage?: string;
}

export default function EventsTable({
    events,
    onView,
    onEdit,
    onDelete,
    getEventStatus,
    formatDate,
    emptyMessage = "No events found",
}: EventsTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#FFFFFF] border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.length > 0 ? (
                            events.map((event) => {
                                const status = getEventStatus(
                                    event.TimeStart,
                                    event.TimeEnd
                                );
                                return (
                                    <EventRow
                                        key={event.DiscountEventID}
                                        event={event}
                                        status={status}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        formatDate={formatDate}
                                    />
                                );
                            })
                        ) : (
                            <tr>
                            <NotFoundEvent message={emptyMessage} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
