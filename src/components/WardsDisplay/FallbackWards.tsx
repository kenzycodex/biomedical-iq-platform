import React from 'react';

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
];

const FallbackWards: React.FC = () => {
  return (
    <div>
      <p>This is a fallback wards component. The wards listed here are default:</p>
      <ul>
        {defaultWards.map((ward) => (
          <li key={ward.id}>
            {ward.ward_name} - {ward.description}, Capacity: {ward.capacity}, Floor: {ward.floor_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FallbackWards;
