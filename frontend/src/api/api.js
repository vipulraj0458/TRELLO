import axios from 'axios';

// Creating an axios instance that targets the backend server
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

export const fetchBoards = async () => {
    const response = await api.get('/boards');
    return response.data;
};

export const fetchBoardDetails = async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
};

export const createBoard = async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
};

export const updateBoard = async (boardId, boardData) => {
    const response = await api.put(`/boards/${boardId}`, boardData);
    return response.data;
};

export const deleteBoard = async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
};

export const createList = async (listData) => {
    const response = await api.post('/api/lists', listData);
    return response.data;
};

export const createCard = async (cardData) => {
    const response = await api.post('/api/cards', cardData);
    return response.data;
};

export const moveCard = async (cardId, newListId, newPosition) => {
    const response = await api.put('/cards/move', { 
        card_id: cardId, 
        new_list_id: newListId, 
        new_position: newPosition 
    });
    return response.data;
};

export const updateList = async (listId, title) => {
    // Note: handle possible "list-1" prefix from ui state mapping
    const cleanId = String(listId).replace('list-', '');
    const response = await api.put(`/api/lists/${cleanId}`, { title });
    return response.data;
};

export const updateCard = async (cardId, title) => {
    const cleanId = String(cardId).replace('card-', '');
    const response = await api.put(`/api/cards/${cleanId}`, { title });
    return response.data;
};
