import axiosInstance from "@/lib/axios";

export type Me = {
  phone: string;
  email: string | null;
  first_name: string;
  last_name: string;
};

export const accountsApi = {
  register: (data: {
    phone: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => axiosInstance.post("/accounts/user/register/", data), // [file:18]

  login: (data: { phone: string; password: string }) =>
    axiosInstance.post("/accounts/user/login/", data), // [file:18]

  me: async () => (await axiosInstance.get<Me>("/accounts/me/")).data, // [file:18]

  updateMe: async (patch: Partial<Pick<Me, "first_name" | "last_name">>) =>
    (await axiosInstance.patch("/accounts/me/", patch)).data, // [file:18]
};
