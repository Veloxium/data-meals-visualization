"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { CategoryMeal, JenisMeal, TypeOfMeal } from "@/lib/types";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  date: string;
  typeOfMeal: string;
  qtyFrozen: number;
  qtyFresh: number;
  category: string;
  jenis: string;
};

export default function AddMeal() {
  const router = useRouter();
  const [openCalendar, setOpenCalendar] = useState(false);

  const { handleSubmit, control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      date: "",
      typeOfMeal: "",
      qtyFrozen: 0,
      qtyFresh: 0,
      category: "",
      jenis: "",
    },
  });

  const submit = async (data: FormValues) => {
    const res = await fetch("/api/chartlist", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if(!res.ok){
      toast.error("Failed to add meal record");
      return;
    }
    router.push("/chart");
    router.refresh();
  };

  return (
    <div className="p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Add Meal Record</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col gap-2">
          <Label>Select Date</Label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between text-gray-500 font-normal"
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    key={field.value}
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(d) => {
                      if (!d) return;
                      const isoLocal = new Date(
                        d.getFullYear(),
                        d.getMonth(),
                        d.getDate(),
                        0,
                        0,
                        0
                      ).toISOString();
                      field.onChange(isoLocal);
                      setOpenCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Type of Meal</Label>
          <Controller
            control={control}
            name="typeOfMeal"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type of Meal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type of Meal</SelectLabel>
                    {TypeOfMeal.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Quantity Frozen</Label>
          <Controller
            control={control}
            name="qtyFrozen"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={field.value === 0 ? "0" : field.value}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    field.onChange(0);
                  } else {
                    const num = Number(val.replace(/^0+/, "") || "0");
                    field.onChange(num);
                  }
                }}
                placeholder="Enter quantity of frozen meal"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Quantity Fresh</Label>
          <Controller
            control={control}
            name="qtyFresh"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                value={field.value === 0 ? "0" : field.value}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    field.onChange(0);
                  } else {
                    const num = Number(val.replace(/^0+/, "") || "0");
                    field.onChange(num);
                  }
                }}
                placeholder="Enter quantity of fresh meal"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {CategoryMeal.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Label>Jenis</Label>
          <Controller
            control={control}
            name="jenis"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jenis</SelectLabel>
                    {JenisMeal.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Button type="submit" className="mt-4 w-full">
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/chart")}
          className="mt-2 w-full"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
