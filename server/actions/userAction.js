import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_RESET,
    VERIFY_NUMBER_FAIL,
    VERIFY_NUMBER_REQUEST,
    VERIFY_NUMBER_SUCCESS,


    
    USER_SEND_FAIL,
    USER_SEND_REQUEST,
    USER_SEND_SUCCESS,
    USER_SEND_RESET,


    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,

    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,

    USER_LIST_RESET,
    USER_DELETE_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
 
    
    ACCOUNT_DELETE_FAIL,
    ACCOUNT_DELETE_REQUEST,
    ACCOUNT_DELETE_SUCCESS,
    ACCOUNT_DELETE_RESET,


    USER_FOLLOW_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,




    PASSWORD_RESET_REQUEST,
  


    
    PASSWORD_RESET_CONFIRM_REQUEST,



} from '@/server/constants/userConstants'
import axios from 'axios'



export const resetAccountDelete = () => (dispatch) => {
    dispatch({ type: ACCOUNT_DELETE_RESET });
  };



export const verifyOtpAction = (otp) => async (dispatch, getState) => {
    
    try {
        console.log(otp)
        dispatch({
            type: VERIFY_NUMBER_REQUEST

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


    const { data } = await axios.post(`${API_URL}/api/users/verify/`,{otp}, config);
        dispatch({
            type: VERIFY_NUMBER_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: VERIFY_NUMBER_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};




import API_URL from '../constants/URL';



import AsyncStorage from '@react-native-async-storage/async-storage';






export const getOtpAction = () => async (dispatch, getState) => {
    
    try {

        dispatch({
            type: USER_SEND_REQUEST

        })
        // console.log("hi whats good cuz")


        const {

            userLogin: { userInfo },
        } = getState()
        

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }




    const { data } = await axios.post(`${API_URL}/api/users/getotp/`, 
    {},
    config);
    console.log("hi whats good cuz")


        dispatch({
            type: USER_SEND_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: USER_SEND_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};



export const forgot_password = (email) => async dispatch => {
    
    try {

        dispatch({
            type: PASSWORD_RESET_REQUEST

        })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };


    const { data } = await axios.post(`${API_URL}/api/users/password-reset/`, { email }, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};



export const reset_password = (new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {


        dispatch({
            type: PASSWORD_RESET_CONFIRM_REQUEST

        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };


        const { data } =  await axios.patch(`${API_URL}/api/users/set-new-password/`, new_password, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload:data

        });
    } catch (error) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};








export const login = (email, password) => async(dispatch) => {
    try{
        dispatch({
            type: USER_LOGIN_REQUEST

        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
console.log(email, password)

        const { data } = await axios.post(`${API_URL}/api/users/login/`, { 'username': email, 'password': password }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload:data
        })

        AsyncStorage.setItem('userInfo', JSON.stringify(data))


    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const logout = () => (dispatch) => {
    AsyncStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_DETAILS_RESET })
    dispatch({ type: USER_LIST_RESET })


}


export const register = (name, email, password) => async(dispatch) => {
    try{
        dispatch({
            type: USER_REGISTER_REQUEST

        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(`${API_URL}/api/users/register/`, { 'name': name, 'email': email, 'password': password }, config);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload:data
        })


        AsyncStorage.setItem('userInfo', JSON.stringify(data))


    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}






export const getUserDetails = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_DETAILS_REQUEST

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

        const { data } = await axios.get(`${API_URL}/api/users/${id}/`, config);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload:data
        })




    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const updateUserProfile = (user) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST

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

        console.log(user)

        const { data } = await axios.put(
            `${API_URL}/api/users/profile/update/`,
            user,
            config
        )
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload:data
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload:data
        })

        AsyncStorage.setItem('userInfo', JSON.stringify(data))


    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}




export const deleteUser = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_DELETE_REQUEST

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
        const { data } = await axios.delete(`${API_URL}/api/users/delete/${id}/`, config);

        dispatch({
            type: USER_DELETE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const followUser = (id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_FOLLOW_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(`${API_URL}/api/users/${id}/follow/`, {}, config);
  
      dispatch({
        type: USER_FOLLOW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_FOLLOW_FAIL,
        payload: error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      });
    }
  };


  export const followPrivate = (id, action) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_FOLLOW_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(`${API_URL}/api/users/request/${id}/`, action, config);
  
      dispatch({
        type: USER_FOLLOW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_FOLLOW_FAIL,
        payload: error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
      });
    }
  };
  

export const deleteAccount = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: ACCOUNT_DELETE_REQUEST

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

        const { data } = await axios.delete(`${API_URL}/api/users/delete/`, config);

        dispatch({
            type: ACCOUNT_DELETE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type: ACCOUNT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const updateUser = (user) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_UPDATE_REQUEST

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
        const { data } = await axios.put(`${API_URL}/api/users/update/${user._id}/`, user, config);

        dispatch({
            type: USER_UPDATE_SUCCESS,
        })
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}






