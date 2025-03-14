import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PaginatedData } from "@/types/pagination";

type PageAndSize = {
    page: number;
    size: number;
};

type PaginationProps = {
    pagination: PageAndSize;
    onPagination: (pagination: PageAndSize) => void;
    paginatedMetadata: PaginatedData<unknown>["metadata"]
};

const Pagination = ({ pagination, onPagination, paginatedMetadata: { count, hasNextPage } }: PaginationProps) => {
    const startOffset = pagination.page * pagination.size + 1;
    const endOffset = startOffset - 1 + pagination.size;
    const actualEndOffset = Math.min(endOffset, count);

    const label = `${startOffset}-${actualEndOffset} of ${count}`;

    const handlePreviousPage = () => {
        onPagination({
            ...pagination, page: pagination.page - 1
        });
    };

    const handleNextPage = () => {
        onPagination({
            ...pagination, page: pagination.page + 1
        });
    };

    const previousButton = (
        <Button
            variant="outline"
            size="sm"
            disabled={pagination.page < 1}
            onClick={handlePreviousPage}
        >
            Previous
        </Button>
    );

    const nextButton = (
        <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={handleNextPage}
        >
            Next
        </Button>
    );

    const handleChangeSize = (size: string) => {
        onPagination({ page: 0, size: parseInt(size) });
    };

    const pageSizes = [5, 10, 25, 50, 100];

    const sizeButton = (
        <Select
            onValueChange={handleChangeSize}
            defaultValue={pagination.size.toString()}
        >
            <SelectTrigger className="h-[36px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {pageSizes.map((ps) => {
                  return <SelectItem key={ps} value={ps.toString()}>{ps}</SelectItem>;
                })}
            </SelectContent>
        </Select>
    );

    return (
        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex gap-x-2">
                {sizeButton}
                {previousButton}
                {nextButton}
            </div>
        </div>
    );
};

export { Pagination };