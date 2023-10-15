import { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
type PagingProps = {
    onChangePage: any;
    currentPage: number;
    totalPages: number;
    pageStartNum: number;
    setpageStartNum: (pageNum: number) => void;
};
export default function TablePagination(props: PagingProps) {
    const { onChangePage, currentPage, totalPages, pageStartNum, setpageStartNum } = props;

    const handlePrevClick = () => {
        if (pageStartNum > 1) {
            setpageStartNum(pageStartNum - 1);
        }
        onChangePage(currentPage - 1);
    }

    const handleNextClick = () => {
        if (currentPage > 3) {
            if (totalPages >= pageStartNum+7) {
                setpageStartNum(pageStartNum + 1);
            }
        }
        onChangePage(currentPage + 1);
    }

    let items = []
    items.push(<Pagination.Prev key="prev" onClick={handlePrevClick} disabled={currentPage === 1} />)
    for (let page = pageStartNum; page < pageStartNum+7; page++) {
        page <= totalPages && items.push(
            <Pagination.Item key={page} data-page={page} active={page === currentPage} onClick={() => onChangePage(page)}>{page}</Pagination.Item>
        )
    }
    items.push(<Pagination.Next key="next" onClick={handleNextClick} disabled={currentPage === totalPages} />)
    return (
        <Pagination>{items}</Pagination>
    )

}