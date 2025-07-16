import { Grid2 } from "@mui/material";
import { useFetchProductsQuery } from "./catalogApi";
import ProductList from "./ProductList";
import Filters from "./Filters";
import { useAppSelector } from "../../app/store/store";
import Pagination from "@mui/material/Pagination";

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);

  const { data, isLoading } = useFetchProductsQuery(productParams);

  if (isLoading || !data) return <div>"Loading products..." </div>;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        <Filters />
      </Grid2>
      <Grid2 size={9}>
        <ProductList products={data.items} />
        <Pagination
          color="secondary"
          size="large"
          count={data.pagination.totalPages}
          page={data.pagination.currentPage}
        />
      </Grid2>
    </Grid2>
  );
}
