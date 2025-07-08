// UserProfileCard.tsx
import React from "react";

type Props = {
  name: string;
  car: string;
  phone: string;
  timings: string;
  qrNumber: string;
  paymentStatus: string;
  imageUrl: string;
};

const UserProfileCard: React.FC<Props> = ({
  name,
  car,
  phone,
  timings,
  qrNumber,
  paymentStatus,
  imageUrl,
}) => {
  return (
    <div className="rounded-lg p-4 bg-white flex gap-4">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p>Car: {car}</p>
        <p>Phone No: {phone}</p>
        <div className="flex gap-4 mt-2">
          <div className="border p-2">{`Timings: ${timings}`}</div>
          <div className="border p-2">{`QR Number: ${qrNumber}`}</div>
          <div className="border p-2">{`Payment status: ${paymentStatus}`}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
