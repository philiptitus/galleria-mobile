



import { createStore, combineReducers, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {thunk} from 'redux-thunk'; // Correct import for thunk
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Import your reducers here...
import {
  postListReducer, postDetailsReducer, ComentListReducer, postDeleteReducer,
  postCreateReducer, postCommentCreateReducer, bookmarkCreateReducer,
  LikeCreateReducer, postUpdateReducer
} from '@/server/reducers/postReducers';
import {
  notificationListReducer, conversationListReducer, chatCreateReducer,
  messageDeleteReducer
} from '@/server/reducers/notificationReducers';
import {
  userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer,
  userListReducer, userDeleteReducer, userUpdateReducer, accountDeleteReducer,
  userFollowReducer, resetPasswordReducer, forgotPasswordReducer,
  privateFollowReducer, requestListReducer, getOtpReducer, verifyOtpReducer
} from '@/server/reducers/userReducers';
import {
  chatFetchReducer, fetchPostsReducer
} from '@/server/reducers/notificationReducers';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2, // Choose the state reconciler that suits your needs
};

// Root reducer
const rootReducer = combineReducers({
  postList: postListReducer,
  postDetails: postDetailsReducer,
  commentList: ComentListReducer,
  postDelete: postDeleteReducer,
  postCreate: postCreateReducer,
  postUpdate: postUpdateReducer,
  postCommentCreate: postCommentCreateReducer,
  bookmarkCreate: bookmarkCreateReducer,
  likeCreate: LikeCreateReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userList: userListReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userFollow: userFollowReducer,
  accountDelete: accountDeleteReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  privateFollow: privateFollowReducer,
  requestList: requestListReducer,
  getOtp: getOtpReducer,
  verifyOtp: verifyOtpReducer,
  fetchPostsState: fetchPostsReducer,
  notificationList: notificationListReducer,
  conversationList: conversationListReducer,
  chatCreate: chatCreateReducer,
  chatFetch: chatFetchReducer,
  messageDelete: messageDeleteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {
  userLogin: { userInfo: null },
};

const middleware = [thunk];

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export { store, persistor };
