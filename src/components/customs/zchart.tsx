"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";



const chartConfig = {
  frozen: {
    label: "Frozen",
    color: "var(--chart-1)",
  },
  fresh: {
    label: "Fresh",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ZChart({ data: chartData }: { data: any[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Bar Chart - Meals</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 0, top: 40, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="meal"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="fresh" fill="var(--color-fresh)" radius={4}>
              <LabelList
                dataKey="fresh"
                position="top"
                offset={20}
                className="fill-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="freshPercent"
                position="top"
                offset={4}
                className="fill-muted-foreground"
                fontSize={10}
                content={(props) => {
                  const { x, y, width, index } = props as any;
                  const cx = x + (width ?? 0) / 2;
                  const cy = (y ?? 0) - 6;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      className="fill-muted-foreground"
                      fontSize={10}
                      textAnchor="middle"
                    >
                      {`(${chartData[index].freshPercent}%)`}
                    </text>
                  );
                }}
              />
            </Bar>
            <Bar dataKey="frozen" fill="var(--color-frozen)" radius={4}>
              <LabelList
                dataKey="frozen"
                position="top"
                offset={20}
                className="fill-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="frozenPercent"
                position="top"
                offset={4}
                className="fill-muted-foreground"
                fontSize={10}
                content={(props) => {
                  const { x, y, width, index } = props as any;
                  const cx = x + (width ?? 0) / 2;
                  const cy = (y ?? 0) - 6;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      className="fill-muted-foreground"
                      fontSize={10}
                      textAnchor="middle"
                    >
                      {`(${chartData[index].frozenPercent}%)`}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Showing data meals.
        </div>
        <div>
          <div className="h-2 w-2 bg-" />
        </div>
      </CardFooter>
    </Card>
  );
}
