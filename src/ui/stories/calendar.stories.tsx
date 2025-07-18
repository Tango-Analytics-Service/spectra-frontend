// [build] library: 'shadcn'
import Calendar from "@/ui/components/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger, } from "@/ui/components/popover";
import { Select, SelectValue } from "@/ui/components/select";
import SelectContent from "@/ui/components/select/SelectContent";
import SelectItem from "@/ui/components/select/SelectItem";
import SelectTrigger from "@/ui/components/select/SelectTrigger";

import { Button } from "@/ui/components/button";
import { addDays, format } from "date-fns";

const meta = {
    title: "ui/Calendar",
    component: Calendar,
    tags: ["autodocs"],
    argTypes: {},
};
export default meta;

export const Base = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (args: any) => <Calendar {...args}>Calendar</Calendar>,
    args: {
        mode: "single",
        className: "rounded-md border",
    },
};

export const DatePicker = {
    render: () => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={"w-[240px] justify-start text-left font-normal"}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Pick a date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" initialFocus />
                </PopoverContent>
            </Popover>
        );
    },
    args: {
        date: Date.parse("2023-11-3000"),
    },
};

export const DatePickerRange = {
    render: () => {
        let date = {
            from: new Date(2023, 0, 20),
            to: addDays(new Date(2023, 0, 20), 20),
        };
        const setDate = (newDate: typeof date) => {
            date = newDate;
        };

        return (
            <div className={"grid gap-2"}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={"w-[300px] justify-start text-left font-normal"}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        );
    },
    args: {},
};

export const DatePickerWithPresets = {
    render: () => {
        let date = new Date(2023, 0, 20);
        const setDate = (newDate: Date) => {
            date = newDate;
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={"w-[240px] justify-start text-left font-normal"}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="flex w-auto flex-col space-y-2 p-2"
                >
                    <Select
                        onValueChange={(value) => {
                            const newDate = new Date();
                            newDate.setDate(newDate.getDate() + parseInt(value));
                            setDate(newDate);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                        <Calendar
                            initialFocus
                            mode="single"
                            defaultMonth={date}
                            selected={date}
                            onSelect={setDate}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        );
    },
    args: {},
};
