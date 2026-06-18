import axios, { AxiosInstance } from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Room APIs
export const roomAPI = {
  createRoom: async (name: string, isPublic: boolean = true, password?: string) => {
    const response = await apiClient.post('/api/rooms', {
      name,
      isPublic,
      password: password || null,
    });
    return response.data;
  },

  getAllRooms: async () => {
    const response = await apiClient.get('/api/rooms');
    return response.data;
  },

  getRoom: async (roomId: string) => {
    const response = await apiClient.get(`/api/rooms/${roomId}`);
    return response.data;
  },

  updateRoom: async (roomId: string, updates: any) => {
    const response = await apiClient.put(`/api/rooms/${roomId}`, updates);
    return response.data;
  },

  deleteRoom: async (roomId: string) => {
    const response = await apiClient.delete(`/api/rooms/${roomId}`);
    return response.data;
  },

  getMembers: async (roomId: string) => {
    const response = await apiClient.get(`/api/rooms/${roomId}/members`);
    return response.data;
  },

  addMember: async (roomId: string, memberId: string, memberName: string) => {
    const response = await apiClient.post(`/api/rooms/${roomId}/members`, {
      memberId,
      memberName,
    });
    return response.data;
  },

  removeMember: async (roomId: string, memberId: string) => {
    const response = await apiClient.delete(`/api/rooms/${roomId}/members/${memberId}`);
    return response.data;
  },
};

// File APIs
export const fileAPI = {
  uploadFile: async (
    roomId: string,
    file: File,
    uploaderName: string,
    onProgress?: (progress: number) => void
  ) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const response = await apiClient.post(`/api/rooms/${roomId}/files`, {
            filename: file.name,
            mimetype: file.type || 'application/octet-stream',
            size: file.size,
            uploaderName,
            data: base64Data,
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  getFiles: async (roomId: string) => {
    const response = await apiClient.get(`/api/rooms/${roomId}/files`);
    return response.data;
  },

  downloadFile: async (roomId: string, fileId: string) => {
    const response = await apiClient.get(`/api/rooms/${roomId}/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteFile: async (roomId: string, fileId: string) => {
    const response = await apiClient.delete(`/api/rooms/${roomId}/files/${fileId}`);
    return response.data;
  },
};

export default apiClient;
