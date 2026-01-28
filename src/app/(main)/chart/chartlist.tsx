"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function ChartList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const filter = searchParams.get("filter") || "";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState(filter);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(
        `/api/chartlist?page=${page}&limit=10&filter=${filter}`,
      );
      const json = await res.json();

      setData(json.data || []);
      setPagination(json.pagination);
      setIsLoading(false);
    };

    fetchData();
  }, [page, filter]);

  const goToPage = (p: number) => {
    router.push(`?page=${p}&filter=${filter}`);
  };

  const handleSearch = () => {
    router.push(`?page=1&filter=${search}`);
  };

  const handleReset = () => {
    setSearch("");
    router.push(`?page=1`);
  };

  // Delete function
  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/chartlist/${deleteId}`, {
      method: "DELETE",
    });
    setOpenDialog(false);
    setDeleteId(null);
    data.filter((item: any) => item.id !== deleteId);

    // Refresh data
    const res = await fetch(
      `/api/chartlist?page=${page}&limit=10&filter=${filter}`,
    );
    const json = await res.json();
    setData(json.data || []);
    setPagination(json.pagination);
  };

  return (
    <div className="p-4">
      <p className="text-2xl font-bold mb-4">Data Meals</p>

      {/* Search & Add */}
      <div className="flex items-center gap-3 mb-4">
        <Input
          placeholder="Search Type of Meal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button className="ml-auto" onClick={() => router.push("/chart/add")}>
          + Add Meal
        </Button>
      </div>

      <div className="border rounded-xl">
        <Table>
          <TableCaption className="mb-10">List of meals.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type of Meal</TableHead>
              <TableHead>Frozen</TableHead>
              <TableHead>Fresh</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Loader2 className="mx-auto my-10 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: any, index: number) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {(page - 1) * pagination.limit + (index + 1)}
                  </TableCell>
                  <TableCell>{item.date?.slice(0, 10)}</TableCell>
                  <TableCell>{item.typeOfMeal}</TableCell>
                  <TableCell>{item.qtyFrozen}</TableCell>
                  <TableCell>{item.qtyFresh}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.jenis}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="link"
                      onClick={() => router.push(`/chart/edit/${item.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-500"
                      onClick={() => {
                        setDeleteId(item.id);
                        setOpenDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <Button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
          Previous
        </Button>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <Button
          disabled={page >= pagination.totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this meal?</div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
