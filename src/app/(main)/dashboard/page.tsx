"use client";

import { ZChart } from "@/components/customs/zchart";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    day: undefined as string | undefined,
    date: undefined as Date | undefined,
    week: undefined as string | undefined,
    month: undefined as string | undefined,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCalendar, setOpenCalendar] = useState(false);

  async function loadData(f?: typeof filters) {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (f?.day) params.set("day", f.day);
      if (f?.date) params.set("date", f.date.toISOString());
      if (f?.week) params.set("week", f.week);
      if (f?.month) params.set("month", f.month);

      const res = await fetch(`/api/chart?${params.toString()}`);
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyFilters = () => {
    loadData(filters);
  };


  const handleResetFilters = () => {
    const reset = {
      day: undefined,
      date: undefined,
      week: undefined,
      month: undefined,
    };
    setFilters(reset);
    loadData(reset);
  };

  if (loading) {
    return (
      <div className="p-4 w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 bg-yellow-500 text-white">
          <p className="text-xl font-bold">Total Meals</p>
          <p className="text-4xl font-bold">
            {chartData.reduce(
              (sum: number, d: any) => sum + d.frozen + d.fresh,
              0
            )}
          </p>
        </div>

        <div className="rounded-xl border p-4 bg-green-500 text-white">
          <p className="text-xl font-bold">Fresh Meals</p>
          <p className="text-4xl font-bold">
            {chartData.reduce((sum: number, d: any) => sum + d.fresh, 0)}
          </p>
        </div>

        <div className="rounded-xl border p-4 bg-blue-600 text-white">
          <p className="text-xl font-bold">Frozen Meals</p>
          <p className="text-4xl font-bold">
            {chartData.reduce((sum: number, d: any) => sum + d.frozen, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <ZChart data={chartData} />
        </div>

        <div className="p-4 bg-white border rounded-xl">
          <p className="text-xl font-bold mb-4">Filters</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Select Day</Label>
              <Select
                value={filters.day}
                onValueChange={(v) => setFilters((f) => ({ ...f, day: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Day</SelectLabel>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Date</Label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-gray-500 font-normal"
                  >
                    {filters.date
                      ? filters.date.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={filters.date}
                    onSelect={(d) => {
                      setFilters((f) => ({ ...f, date: d || undefined }));
                      setOpenCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Week</Label>
              <Select
                value={filters.week}
                onValueChange={(v) => setFilters((f) => ({ ...f, week: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Week</SelectLabel>
                    <SelectItem value="week-1">Week 1</SelectItem>
                    <SelectItem value="week-2">Week 2</SelectItem>
                    <SelectItem value="week-3">Week 3</SelectItem>
                    <SelectItem value="week-4">Week 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Month</Label>
              <Select
                value={filters.month}
                onValueChange={(v) => setFilters((f) => ({ ...f, month: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Month</SelectLabel>

                    {[
                      "january",
                      "february",
                      "march",
                      "april",
                      "may",
                      "june",
                      "july",
                      "august",
                      "september",
                      "october",
                      "november",
                      "december",
                    ].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleApplyFilters}>
                Apply
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
