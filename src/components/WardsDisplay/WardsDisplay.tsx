'use client';

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, IconButton, Typography, Box, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { showToast } from "@/components/Notifications/ToastNotification";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema for Ward form using Yup
const wardSchema = yup.object().shape({
  ward_name: yup.string().required("Ward name is required"),
  description: yup.string().required("Description is required").max(255, "Description must be less than 255 characters"),
  capacity: yup.number().typeError("Capacity must be a number").required("Capacity is required").positive("Capacity must be positive"),
  floor_number: yup.number().typeError("Floor number must be a number").required("Floor number is required").positive("Floor number must be positive"),
});

interface WardFormData {
  ward_name: string;
  description: string;
  capacity: number;
  floor_number: number;
}

const WardsDisplay: React.FC = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [currentWard, setCurrentWard] = useState<any>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<WardFormData>({
    resolver: yupResolver(wardSchema),
  });

  useEffect(() => {
    loadWards();
  }, []);

  // Load wards from backend
  const loadWards = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/wards/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setWards(response.data.wards);
    } catch (error) {
      showToast('Failed to fetch wards. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open
  const handleOpenDialog = (mode: 'add' | 'edit' | 'delete', ward: any = null) => {
    setDialogMode(mode);
    setCurrentWard(ward);
    if (mode === 'edit' && ward) {
      // Set form values to the selected ward for editing
      setValue('ward_name', ward.ward_name);
      setValue('description', ward.description);
      setValue('capacity', ward.capacity);
      setValue('floor_number', ward.floor_number);
    } else {
      reset();  // Reset the form for adding a new ward
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWard(null);
  };

  // Handle form submission for adding or editing wards
  const onSubmit: SubmitHandler<WardFormData> = async (data) => {
    try {
      if (dialogMode === 'add') {
        await axios.post(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/wards/create`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        showToast('Ward added successfully.', 'success');
      } else if (dialogMode === 'edit' && currentWard) {
        await axios.put(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/wards/update/${currentWard.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        showToast('Ward updated successfully.', 'success');
      }
      handleCloseDialog();
      loadWards();
    } catch (error) {
      showToast(`Failed to ${dialogMode === 'add' ? 'add' : 'update'} ward. Please try again.`, 'error');
    }
  };

  // Handle ward deletion
  const handleDelete = async (wardId: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/wards/delete/${wardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      showToast('Ward deleted successfully.', 'success');
      loadWards();
      handleCloseDialog();
    } catch (error) {
      showToast('Failed to delete ward. Please try again.', 'error');
    }
  };

  return (
    <Box className="p-6 max-w-full overflow-auto">
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
        <Box className="text-center text-body dark:text-bodydark p-6">
          No wards available. Please add a ward to get started.
        </Box>
      ) : (
        <TableContainer component={Paper} className="rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHead>
              <TableRow className="bg-primary text-white">
                <TableCell className="font-semibold text-white">Name</TableCell>
                <TableCell className="font-semibold text-white">Description</TableCell>
                <TableCell className="font-semibold text-white">Capacity</TableCell>
                <TableCell className="font-semibold text-white">Floor Number</TableCell>
                <TableCell className="font-semibold text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wards.map((ward) => (
                <TableRow key={ward.id} className="hover:bg-gray-100 transition-all duration-300 ease-in-out">
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

      <Dialog open={openDialog} onClose={handleCloseDialog} className="rounded-lg">
        <DialogTitle className="text-primary font-semibold">
          {dialogMode === 'add' ? 'Add New Ward' : dialogMode === 'edit' ? 'Edit Ward' : 'Delete Ward'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <DialogContentText className="text-body">
              Are you sure you want to delete this ward? This action cannot be undone.
            </DialogContentText>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <TextField
                fullWidth
                margin="normal"
                label="Ward Name"
                {...register('ward_name')}
                error={!!errors.ward_name}
                helperText={errors.ward_name?.message}
                className="rounded-lg"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                className="rounded-lg"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Capacity"
                type="number"
                {...register('capacity')}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
                className="rounded-lg"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Floor Number"
                type="number"
                {...register('floor_number')}
                error={!!errors.floor_number}
                helperText={errors.floor_number?.message}
                className="rounded-lg"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="text-graydark hover:text-graydark-dark transition-all duration-300 ease-in-out">Cancel</Button>
          {dialogMode === 'delete' ? (
            <Button onClick={() => currentWard && handleDelete(currentWard.id)} color="error" className="text-danger hover:text-danger-dark transition-all duration-300 ease-in-out">
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
