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
    <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl ">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
            {events.length > 0 ? (
              events.map((event) => {
                const status = getEventStatus(event.TimeStart, event.TimeEnd);
                return (
                  <EventRow
                    key={event.EventID}
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
