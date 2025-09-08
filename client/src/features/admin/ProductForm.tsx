import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  CreateProductSchema,
} from "../../lib/schemas/createProductSchema";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid2,
} from "@mui/material";
import AppTextInput from "../../app/shared/components/AppTextInput";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import { useFetchFiltersQuery } from "../catalog/catalogApi";

export default function ProductForm() {
  const { control, handleSubmit } = useForm<CreateProductSchema>({
    mode: "onTouched",
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data } = useFetchFiltersQuery();

  const onSubmit = (data: CreateProductSchema) => {
    console.log(data);
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <AppTextInput control={control} name="name" label="Product name" />
          </Grid2>
          <Grid2 size={6}>
            {data?.brands && (
              <AppSelectInput
                control={control}
                name="brand"
                label="Brand"
                items={data.brands}
              />
            )}
          </Grid2>{" "}
          <Grid2 size={6}>
              {data?.types && (
                <AppSelectInput
                  control={control}
                  name="type"
                  label="Type"
                  items={data.types}
                />
              )}
          </Grid2>{" "}
          <Grid2 size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="Price"
            />
          </Grid2>{" "}
          <Grid2 size={6}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="Quantity in Stock"
            />
          </Grid2>{" "}
          <Grid2 size={12}>
            <AppTextInput
              control={control}
              multiline
              rows={4}
              name="description"
              label="Description"
            />
          </Grid2>{" "}
          <Grid2 size={12}>
            <AppTextInput control={control} name="file" label="Image" />
          </Grid2>{" "}
        </Grid2>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button variant="contained" color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
