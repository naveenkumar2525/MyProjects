import { Pagination } from "react-bootstrap";

type paginationProps = {
  onPageChange: any;
  currentPage: number;
  totalRecords: number;
  offsetTo: number;
};

export default function PaginationWithPrevNext(props: paginationProps) {
  const { onPageChange, currentPage, totalRecords, offsetTo} = props;

  const handlePrevClick = () => {
    onPageChange(currentPage - 1, 'prev');
  }

  const handleNextClick = () => {
    onPageChange(currentPage + 1, 'next');
  }

  let items = 
  [
    <Pagination.Prev key="prev" onClick={handlePrevClick} disabled={currentPage === 1} />,
    <Pagination.Next key="next" onClick={handleNextClick} disabled={offsetTo === totalRecords} />
  ]

  return (
    <>
      <Pagination>{items}</Pagination>
    </>
  )

}