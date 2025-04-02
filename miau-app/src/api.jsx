import api from "./axios";

export const tokenPost = async (body) => {
    try {
      const response = await api.post('/Auth/login', body);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar login:', error.response.data.message);
      throw error.response.data.message;
    }
  };
  
  export const tokenValidatePost = async () => {
    try {
      const response = await api.post('/Auth/validate');
      return response.data;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw error;
    }
  };
  
  export const userGet = async () => {
    try {
      const response = await api.get('/Auth/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  };
  
  export const userPost = async (body) => {
    try {
      const response = await api.post('/Auth/register', body);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  };
  
  export const photoPost = async (formData) => {
    try {
      const response = await api.post('/api/photo', formData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      throw error;
    }
  };
  
  export const photosGet = async ({ page, total, user }) => {
    try {
      const response = await api.get(`/Posts?page=${page}&pageSize=${total}&userId=${user ?? ""}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      throw error;
    }
  };
  
  export const photoGet = async (id) => {
    try {
      const response = await api.get(`/Posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar foto:', error);
      throw error;
    }
  };
  
  export const commentPost = async (id, body) => {
    try {
      const response = await api.post(`/Posts/${id}/comments`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao postar comentário:', error);
      throw error;
    }
  };
  
  export const photoDelete = async (id) => {
    try {
      const response = await api.delete(`/api/photo/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      throw error;
    }
  };
  
  export const passwordLost = async (body) => {
    try {
      const response = await api.post('/api/password/lost', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw error;
    }
  };
  
  export const passwordReset = async (body) => {
    try {
      const response = await api.post('/api/password/reset', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  };
  
  export const statsGet = async () => {
    try {
      const response = await api.get('/api/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  };
