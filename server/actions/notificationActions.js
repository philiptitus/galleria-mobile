import {
    NOTIFICATION_LIST_REQUEST,
    NOTIFICATION_LIST_SUCCESS,
    NOTIFICATION_LIST_FAIL,

    CONVERSATION_LIST_REQUEST,
    CONVERSATION_LIST_SUCCESS,
    CONVERSATION_LIST_FAIL,


    TOGGLE_FETCH_POSTS,



    MESSSAGE_DELETE_FAIL,
    MESSSAGE_DELETE_REQUEST,
    MESSSAGE_DELETE_SUCCESS,

    CHAT_FETCH_REQUEST,
    CHAT_FETCH_SUCCESS,
    CHAT_FETCH_FAIL,
    CHAT_CLEAR,
    
    CHAT_CREATE_REQUEST,
    CHAT_CREATE_SUCCESS,
    CHAT_CREATE_FAIL,
    CHAT_CREATE_RESET,



} from '@/server/constants/notificationConstants'
import axios from 'axios'
import API_URL from '@/server/constants/URL'







export const sendTokenToBackend = (token) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'SEND_TOKEN_REQUEST' });
console.log(token)
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const response = await fetch(`${API_URL}/api/notifications/register-push-token/`, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                token: token,
            }),
        });


        console.log(response)


        if (!response.ok) {
            throw new Error('Failed to send token to backend');
        }

        const data = await response.json();

        dispatch({
            type: 'SEND_TOKEN_SUCCESS',
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: 'SEND_TOKEN_FAIL',
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};



export const fetchChats = (id, searchText, page) => async (dispatch, getState) => {
    try {
      dispatch({ type: CHAT_FETCH_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.get(`${API_URL}/api/notifications/chats/${id}/?name=${searchText}&page=${page}`, config);
  
      dispatch({
        type: CHAT_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CHAT_FETCH_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };
  
  export const clearChats = () => (dispatch) => {
    dispatch({ type: CHAT_CLEAR });
  };





export const createChat = (chat) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_CREATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }


        const { data } = await axios.post(`${API_URL}/api/notifications/chat/`, chat, config);
console.log(data)

        dispatch({
            type: CHAT_CREATE_SUCCESS,
            payload: {
                data,
                message:
                    data && data.message
                        ? data.message
                        : 'Comment saved successfully', // Default message if not present
            },
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type: CHAT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const deleteMessage = (messageId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: MESSSAGE_DELETE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(`${API_URL}/api/notifications/${messageId}/delete/`, config);

        dispatch({
            type: MESSSAGE_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: MESSSAGE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



// actions/fetchPostsActions.js
export const setFetchPostsToFalse = () => ({
    type: 'SET_FETCH_POSTS_TO_FALSE',
  });
  



// actions/fetchPostsActions.js
export const toggleFetchPosts = () => ({
    type: 'TOGGLE_FETCH_POSTS',
  });
  
