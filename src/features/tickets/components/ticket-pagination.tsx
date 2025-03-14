"use client";

import { useQueryStates, useQueryState } from "nuqs";
import { Pagination } from "@/components/pagination";
import { paginationOptions, paginationParser, searchParser } from "../search-params";
import { useEffect, useRef } from "react";
import { PaginatedData } from "@/types/pagination";
import { TicketWithMetadata } from "../types";

type TicketPaginationProps = {
    paginatedTicketMetadata: PaginatedData<TicketWithMetadata>["metadata"];
};

const TicketPagination = ({ paginatedTicketMetadata }: TicketPaginationProps) => {
    const [pagination, setPagination] = useQueryStates(paginationParser, paginationOptions);

    const [ search ] = useQueryState("search", searchParser);
    const prevSearch = useRef(search);

    useEffect(() => {
       if (search === prevSearch.current) return;
       prevSearch.current = search;
       
       setPagination({...pagination, page: 0 });

    }, [search, pagination, setPagination]);

    return <Pagination pagination={pagination} onPagination={setPagination} paginatedMetadata={paginatedTicketMetadata} />;
};

export { TicketPagination };