import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Box } from '@mui/material';

interface Ward {
  id: number;
  ward_name: string;
  description: string;
  capacity: number;
  floor_number: number;
}

// Default fallback wards in case there are none retrieved
export const defaultWards: Ward[] = [
  {
    id: 1,
    ward_name: "General Ward",
    description: "Default general ward",
    capacity: 30,
    floor_number: 1,
  },
  {
    id: 2,
    ward_name: "ICU",
    description: "Default Intensive Care Unit",
    capacity: 10,
    floor_number: 2,
  },
  {
    id: 3,
    ward_name: "Maternity Ward",
    description: "Default Maternity Ward",
    capacity: 20,
    floor_number: 3,
  },
  {
    id: 4,
    ward_name: "Pediatrics Ward",
    description: "Default Pediatrics Ward",
    capacity: 15,
    floor_number: 4,
  },
  {
    id: 5,
    ward_name: "Surgical Ward",
    description: "Default Surgical Ward",
    capacity: 25,
    floor_number: 5,
  },
  {
    id: 6,
    ward_name: "Psychiatric Ward",
    description: "Default Psychiatric Ward",
    capacity: 12,
    floor_number: 6,
  },
  {
    id: 7,
    ward_name: "Cardiology Ward",
    description: "Default Cardiology Ward",
    capacity: 18,
    floor_number: 7,
  },
  {
    id: 8,
    ward_name: "Neurology Ward",
    description: "Default Neurology Ward",
    capacity: 16,
    floor_number: 8,
  },
  {
    id: 9,
    ward_name: "Oncology Ward",
    description: "Default Oncology Ward",
    capacity: 14,
    floor_number: 9,
  },
  {
    id: 10,
    ward_name: "Geriatrics Ward",
    description: "Default Geriatrics Ward",
    capacity: 22,
    floor_number: 10,
  },
  {
    id: 11,
    ward_name: "Burns Ward",
    description: "Default Burns Treatment Ward",
    capacity: 12,
    floor_number: 11,
  },
  {
    id: 12,
    ward_name: "Neonatal Ward",
    description: "Default Neonatal Care Ward",
    capacity: 10,
    floor_number: 12,
  },
  {
    id: 13,
    ward_name: "Orthopedic Ward",
    description: "Default Orthopedic Care Ward",
    capacity: 20,
    floor_number: 13,
  },
  {
    id: 14,
    ward_name: "Renal Ward",
    description: "Default Renal Treatment Ward",
    capacity: 15,
    floor_number: 14,
  },
  {
    id: 15,
    ward_name: "Gastroenterology Ward",
    description: "Default Gastroenterology Care Ward",
    capacity: 18,
    floor_number: 15,
  },
];

const FallbackWards: React.FC = () => {
  return (
    <Box className="mt-6 dark:bg-boxdark p-4 rounded-lg shadow-md">
      <Paper elevation={3} className="p-4 dark:bg-boxdark bg-whiten rounded-lg">
        <Typography variant="h6" gutterBottom className="text-primary dark:text-bodydark font-semibold">
          Default Wards (Fallback)
        </Typography>
        <Typography variant="body2" gutterBottom className="text-body dark:text-bodydark">
          No real data available. Displaying default wards as placeholders.
        </Typography>
        <Divider className="my-2" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Ward Name</TableCell>
                <TableCell className="font-semibold">Description</TableCell>
                <TableCell className="font-semibold">Capacity</TableCell>
                <TableCell className="font-semibold">Floor Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defaultWards.map((ward) => (
                <TableRow key={ward.id}>
                  <TableCell>{ward.ward_name}</TableCell>
                  <TableCell>{ward.description}</TableCell>
                  <TableCell>{ward.capacity}</TableCell>
                  <TableCell>{ward.floor_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FallbackWards;
