import {
    NOTIFICATION_LIST_REQUEST,
    NOTIFICATION_LIST_SUCCESS,
    NOTIFICATION_LIST_FAIL,

    CONVERSATION_LIST_REQUEST,
    CONVERSATION_LIST_SUCCESS,
    CONVERSATION_LIST_FAIL,
    
    MESSSAGE_DELETE_FAIL,
    MESSSAGE_DELETE_REQUEST,
    MESSSAGE_DELETE_SUCCESS,


    CHAT_CREATE_REQUEST,
    CHAT_CREATE_SUCCESS,
    CHAT_CREATE_FAIL,
    CHAT_CREATE_RESET,


    CHAT_FETCH_REQUEST,
    CHAT_FETCH_SUCCESS,
    CHAT_FETCH_FAIL,
    CHAT_CLEAR,

    TOGGLE_FETCH_POSTS,


} from '@/server/constants/notificationConstants'



const initialState = {
    fetchPosts: false,
  };
  
  export const fetchPostsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_FETCH_POSTS':
        return {
          ...state,
          fetchPosts: true,
        };


        case 'SET_FETCH_POSTS_TO_FALSE':
            return {
              ...state,
              fetchPosts: false,
            };

      default:
        return state;
    }
  };



export const chatFetchReducer = (state = { conversations: [], loading: false, totalPages: 1 }, action) => {
    switch (action.type) {
      case CHAT_FETCH_REQUEST:
        return { ...state, loading: true };
      case CHAT_FETCH_SUCCESS:
        return { ...state, loading: false, conversations: action.payload.results, totalPages: action.payload.total_pages };
      case CHAT_FETCH_FAIL:
        return { ...state, loading: false, error: action.payload };
      case CHAT_CLEAR:
        return { conversations: [], loading: false, totalPages: 1 };
      default:
        return state;
    }
  };

















export const notificationListReducer = (state = {notifications:[]}, action) =>{
    switch (action.type) {
        case NOTIFICATION_LIST_REQUEST:
            return { loading: true, notifications: [] } 
        case NOTIFICATION_LIST_SUCCESS:
            return { loading: false, notifications: action.payload }     
        case NOTIFICATION_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 




export const conversationListReducer = (state = {conversations:[]}, action) =>{
    switch (action.type) {
        case CONVERSATION_LIST_REQUEST:
            return { loading: true, conversations: [] } 
        case CONVERSATION_LIST_SUCCESS:
            return { loading: false, conversations: action.payload }     
        case CONVERSATION_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 






export const chatCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case CHAT_CREATE_REQUEST:
            return { loading: true }
        case CHAT_CREATE_SUCCESS:
            return { loading: false,success:true, chat: action.payload}     
        case CHAT_CREATE_FAIL:
            return { loading: false, error:action.payload }
        case CHAT_CREATE_RESET:
            return {}
            
        default:
            return state
    
        
    }
} 




export const messageDeleteReducer = (state = {}, action) =>{
    switch (action.type) {
        case MESSSAGE_DELETE_REQUEST:
            return { loading: true }
        case MESSSAGE_DELETE_SUCCESS:
            return { loading: false, success:true }     
        case MESSSAGE_DELETE_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 
