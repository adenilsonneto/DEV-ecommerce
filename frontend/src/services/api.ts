import axios from'axios';

// Cria uma intância do Axios com a URL base da API
const api = axios.create({
  baseURL:'http://localhost:8000', 
  headers:{
    'Content-Type':'application/json',
    },
});

api.interceptors.response.use(
  (response) => response,  //sucesso: passa adiante
  (error) => {
    //traduz erros comuns para mensagens amigáveis
    if (error.code === 'ERR_NETWORK') {
      console.error('Sem conexão com o backend. Verifique se o servidor está rodando.');
    }
    return Promise.reject(error);
  }
);
export default api;