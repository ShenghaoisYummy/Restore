import {
  Box,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  TableBody,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useFetchProductsQuery } from "../catalog/catalogApi";
import { Delete, Edit } from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "../catalog/catalogSlice";

export default function InventoryPage() {
  /* 
   * get product params from redux store catalogSlice
   * the productParams looks like this:
     const initialState: ProductParams = {
       pageNumber: 1,        // Start on page 1
       pageSize: 8,          // Show 8 products per page
       types: [],            // No type filters initially
       brands: [],           // No brand filters initially
       searchTerm: "",       // No search term initially
       orderBy: "name",      // Sort by name initially
     };
   * use useFetchProductsQuery to get products data ordered by name:
     
         {
             items: Product[],      // Array of products
             pagination: {          // Pagination info
                 currentPage: 1,
                 totalPages: 5,
                 pageSize: 8,
                 totalCount: 35
         }
     }
   * use useAppDispatch to dispatch actions
   */
  const productParams = useAppSelector((state) => state.catalog);
  const { data } = useFetchProductsQuery(productParams);
  const dispatch = useAppDispatch();

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Inventory
        </Typography>
        <Button sx={{ m: 2 }} size="large" variant="contained">
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell align="left">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={product.pictureUrl}
                      alt={product.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">{product.price}</TableCell>
                <TableCell align="left">{product.quantityInStock}</TableCell>
                <TableCell align="left">{product.type}</TableCell>
                <TableCell align="left">{product.brand}</TableCell>
                <TableCell align="center">
                  <Button startIcon={<Edit />} color="primary" />
                  <Button startIcon={<Delete />} color="error" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box>
          {data?.pagination && data.items.length > 0 && (
            <AppPagination
              metaData={data.pagination}
              onPageChange={(page: number) => dispatch(setPageNumber(page))}
            />
          )}
        </Box>
      </TableContainer>
    </>
  );
}
