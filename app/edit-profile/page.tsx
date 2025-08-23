import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const fetchUserProfile = async () => {
  const { data } = await axios.get('/api/user/profile');
  return data;
};

const updateUserProfile = async (updatedProfile: any) => {
  const { data } = await axios.put('/api/user/profile', updatedProfile);
  return data;
};

const EditProfile = () => {
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: 'userProfile', 
    queryFn: fetchUserProfile});

  const mutation = useMutation({
    mutationFn: updateUserProfile
});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        alert('Profile updated successfully!');
      },
      onError: () => {
        alert('Failed to update profile.');
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile.</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;