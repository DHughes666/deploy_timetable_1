import styled from "styled-components";
import {TableContainer, Table, 
  TableCell, TableRow} from '@mui/material'

const StyledTableContainer = styled(TableContainer)`
  width: 80%;
  margin: 10 auto; /* Center the table on the page */
`;

const StyledTable = styled(Table)`
  min-width: 650px;
  border-collapse: collapse;
  width: 100%;
`;

const StyledTableHeader = styled(TableRow)`
  background-color: #f4f4f4;
`;

const StyledTableHeaderCell = styled(TableCell)`
  padding: 16px;
  text-align: left;
  font-weight: bold;
`;

const StyledTableCell = styled(TableCell)`
  height: 50px;
  text-align: center;
  padding: 16px;
  border: 1px solid #ddd;
`;

const ClassSlotRow = styled(TableRow)`
  background-color: #e0f7fa;
`;

export { ClassSlotRow, StyledTable, StyledTableCell, StyledTableHeaderCell,
    StyledTableContainer, StyledTableHeader}