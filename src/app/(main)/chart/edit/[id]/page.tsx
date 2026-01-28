"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

export default function EditMeal({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [openCalendar, setOpenCalendar] = useState(false);

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            date: "",
            typeOfMeal: "",
            qtyFrozen: 0,
            qtyFresh: 0,
            category: "",
            jenis: "",
        },
    });

    useEffect(() => {
        fetch(`/api/chartlist/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.data) {
                    reset(json.data);
                }
            });
    }, [id, reset]);

    const submit = async (data: any) => {
        const re = await fetch(`/api/chartlist/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (!re.ok) {
            toast.error("Failed to update meal record");
            return;
        }
        router.push("/chart");
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="p-4 max-w-lg">
                <h1 className="text-2xl font-bold mb-4">Add Meal Record</h1>
                <div className="flex flex-col gap-2">
                    <Label>Select Date</Label>
                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between text-gray-500 font-normal"
                                        type="button"
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
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
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
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
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
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

                <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
                    Save
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push("/chart")}
                    className="mt-2 w-full"
                    type="button"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
