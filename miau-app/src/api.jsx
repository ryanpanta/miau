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
      const response = await api.post('/Posts', formData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      throw error.response.data.message;
    }
  };

  export const addLike = async (id) => {
    try {
      const response = await api.post(`/Posts/${id}/like`, null);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      throw error.response.data.message;
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
  
  const encodeEmojis = (str) => {
    return str.split('').map(char => 
      char.codePointAt(0) > 127 ? `\\u${char.codePointAt(0).toString(16)}` : char
    ).join('');
  };
  
  export const commentPost = async (id, body) => {
    const encodedContent = encodeEmojis(body.content);
    
    try {
      const response = await api.post(`/Posts/${id}/comments`, { content: encodedContent }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
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
      const response = await api.delete(`/Posts/${id}`);
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

  export const getSuggestionComment = async (id) => {
    try {
      const response = await api.get(`/Posts/${id}/comment-suggestion`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sugestões de comentários:', error);
      throw error;
    }
  }
