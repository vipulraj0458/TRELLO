import axios from 'axios';

// Creating an axios instance that targets the backend server
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

export const fetchBoardDetails = async (boardId) => {
    // Specifically hits /boards/1 using the base URL
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
};

export const createList = async (listData) => {
    const response = await api.post('/lists', listData);
    return response.data;
};

export const createCard = async (cardData) => {
    const response = await api.post('/cards', cardData);
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
