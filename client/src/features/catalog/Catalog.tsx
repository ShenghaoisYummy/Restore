import { Grid2, Typography } from "@mui/material";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import ProductList from "./ProductList";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setPageNumber } from "./catalogSlice";
import AppPagination from "../../app/shared/components/AppPagination";

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalog);

  const { data, isLoading } = useFetchProductsQuery(productParams);
  const { data: filtersData, isLoading: filtersLoading } =
    useFetchFiltersQuery();

  const dispatch = useAppDispatch();
  if (isLoading || !data || filtersLoading || !filtersData)
    return <div>"Loading products..." </div>;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        <Filters filtersData={filtersData} />
      </Grid2>
      <Grid2 size={9}>
        {data.items && data.items.length > 0 ? (
          <>
            <ProductList products={data.items} />
            <AppPagination
              metaData={data.pagination}
              onPageChange={(page) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        ) : (
          <Typography variant="h5">No products found</Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
