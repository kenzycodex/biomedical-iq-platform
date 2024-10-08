'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  IconButton, Typography, Box, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as EyeIcon, Add as AddIcon } from '@mui/icons-material';
import { showToast } from "@/components/Notifications/ToastNotification";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FallbackWards from "./FallbackWards";  // Import the fallback component

// Schema validation using Yup
const wardSchema = yup.object().shape({
  ward_name: yup.string().required("Ward name is required"),
  description: yup.string().required("Description is required").max(255, "Description must be less than 255 characters"),
  capacity: yup.number().typeError("Capacity must be a number").required("Capacity is required").positive("Capacity must be positive").integer(),
  floor_number: yup.number().typeError("Floor number must be a number").required("Floor number is required").positive("Floor number must be positive").integer(),
});

interface WardFormData {
  id?: number;
  ward_name: string;
  description: string;
  capacity: number;
  floor_number: number;
}

const WardsDisplay: React.FC = () => {
  const [wards, setWards] = useState<WardFormData[]>([]);  // Initialize with an empty array, no default wards
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [currentWard, setCurrentWard] = useState<WardFormData | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<WardFormData>({
    resolver: yupResolver(wardSchema),
  });  

  // Fetch Wards, prioritize localStorage if available
  const fetchWards = useCallback(async () => {
    setIsLoading(true);
    const cachedWards = localStorage.getItem('wardData');
    if (cachedWards) {
      setWards(JSON.parse(cachedWards));
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/ward/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setWards(response.data.wards);
      localStorage.setItem('wardData', JSON.stringify(response.data.wards));  // Cache updated wards
    } catch (error) {
      console.error('Failed to load wards', error);  // Handle silently
      showToast('Failed to fetch wards. Showing default view.', 'error'); // Make noise..lol
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const handleOpenDialog = (mode: 'add' | 'edit' | 'delete', ward: WardFormData | null = null) => {
    setDialogMode(mode);
    setCurrentWard(ward);

    if (mode === 'edit' && ward) {
      setValue('ward_name', ward.ward_name);
      setValue('description', ward.description);
      setValue('capacity', ward.capacity);
      setValue('floor_number', ward.floor_number);
    } else {
      reset();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWard(null);
  };

  const onSubmit: SubmitHandler<WardFormData> = async (data) => {
    setIsLoading(true);
    try {
      if (dialogMode === 'add') {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/ward/create`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        showToast('Ward added successfully.', 'success');
        setWards([...wards, response.data.ward]);  // Optimistically update UI
        localStorage.setItem('wardData', JSON.stringify([...wards, response.data.ward]));  // Cache updated wards
      } else if (dialogMode === 'edit' && currentWard) {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/ward/update/${currentWard.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        showToast('Ward updated successfully.', 'success');
        const updatedWards = wards.map((ward) => (ward.id === currentWard.id ? response.data.ward : ward));
        setWards(updatedWards);
        localStorage.setItem('wardData', JSON.stringify(updatedWards));  // Cache updated wards
      }
      handleCloseDialog();
    } catch (error) {
      console.error(`Failed to ${dialogMode === 'add' ? 'add' : 'update'} ward`, error);  // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (wardId: number) => {
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/ward/delete/${wardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      showToast('Ward deleted successfully.', 'success');
      const filteredWards = wards.filter(ward => ward.id !== wardId);
      setWards(filteredWards);
      localStorage.setItem('wardData', JSON.stringify(filteredWards));  // Cache updated wards
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to delete ward', error);  // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="p-6 max-w-full overflow-auto dark:bg-boxdark min-h-screen">
      <Box className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <Typography variant="h4" component="h1" gutterBottom className="text-primary font-semibold">
            Wards
          </Typography>
          <Typography variant="body1" className="text-body dark:text-bodydark">
            Manage all your wards below. Add new wards or update existing ones as needed.
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
          className="mt-4 md:mt-0 rounded-lg px-6 py-2 shadow-lg hover:bg-primary-dark transition-all duration-300 ease-in-out"
        >
          Add Ward
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center items-center">
          <CircularProgress className="text-primary" />
        </Box>
      ) : wards.length === 0 ? (
        <FallbackWards />  // Show a fallback view if no wards are available
      ) : (
        <TableContainer component={Paper} className="rounded-lg shadow-md overflow-auto no-scrollbar dark:bg-boxdark">
          <Table>
            <TableHead>
              <TableRow className="bg-primary text-body dark:text-bodydark">
                <TableCell className="font-semibold text-white">Name</TableCell>
                <TableCell className="font-semibold text-white">Description</TableCell>
                <TableCell className="font-semibold text-white">Capacity</TableCell>
                <TableCell className="font-semibold text-white">Floor Number</TableCell>
                <TableCell className="font-semibold text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wards.map((ward) => (
                <TableRow key={ward.id} className="hover:bg-gray-100 transition-all duration-300 ease-in-out dark:bg-boxdark dark:hover:bg-strokedark">
                  <TableCell>{ward.ward_name}</TableCell>
                  <TableCell>{ward.description}</TableCell>
                  <TableCell>{ward.capacity}</TableCell>
                  <TableCell>{ward.floor_number}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog('edit', ward)}
                      className="text-primary hover:text-primary-dark transition-all duration-300 ease-in-out"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => window.location.href = `/ward/${ward.id}`}
                      className="text-info hover:text-info-dark transition-all duration-300 ease-in-out"
                    >
                      <EyeIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDialog('delete', ward)}
                      className="text-danger hover:text-danger-dark transition-all duration-300 ease-in-out"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for add/edit/delete actions */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        className="rounded-lg"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className: "dark:bg-boxdark bg-whiten transition-all duration-300 ease-in-out"
        }}
      >
        <DialogTitle className="text-primary font-semibold">
          {dialogMode === 'add' ? 'Add New Ward' : dialogMode === 'edit' ? 'Edit Ward' : 'Delete Ward'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <Typography className="text-body dark:text-bodydark">
              Are you sure you want to delete this ward? This action cannot be undone.
            </Typography>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <TextField
                fullWidth
                margin="normal"
                label="Ward Name"
                {...register('ward_name')}
                error={!!errors.ward_name}
                helperText={errors.ward_name?.message}
                className="rounded-lg dark:bg-boxdark"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                className="rounded-lg dark:bg-boxdark"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Capacity"
                type="number"
                {...register('capacity')}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
                className="rounded-lg dark:bg-boxdark"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Floor Number"
                type="number"
                {...register('floor_number')}
                error={!!errors.floor_number}
                helperText={errors.floor_number?.message}
                className="rounded-lg dark:bg-boxdark"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="text-graydark hover:text-graydark-dark transition-all duration-300 ease-in-out">
            Cancel
          </Button>
          {dialogMode === 'delete' ? (
            <Button
              onClick={() => currentWard?.id !== undefined && handleDelete(currentWard.id)}  // Check if `id` is not undefined
              color="error"
              className="text-danger hover:text-danger-dark transition-all duration-300 ease-in-out"
            >
              Delete
            </Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)} color="primary" className="bg-primary text-white hover:bg-primary-dark transition-all duration-300 ease-in-out">
              {dialogMode === 'add' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardsDisplay;
