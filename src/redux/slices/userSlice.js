import { createSlice } from '@reduxjs/toolkit'
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    accessToken: '',
    _id: '',
    city: '',
    isAdmin: false,
    refreshToken: ''
  },
  reducers: {
    updateUser: (state, action) => {
      const { name = '', email = '', accessToken = '', address = '', phone = '', avatar = '', _id ='', city='', isAdmin=false,  refreshToken= ''} = action.payload
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.address = address ? address : state.address;
      state.phone = phone ? phone : state.phone;
      state.avatar = avatar ? avatar : state.avatar;
      state._id = _id ? _id : state._id;
      state.city = city ? city : state.city;
      state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
      state.accessToken = accessToken ? accessToken : state.accessToken;
      state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
  },
  resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.address = '';
      state.phone = '';
      state.avatar = '';
      state.accessToken = '';
      state._id = '';
      state.city='';
      state.isAdmin = false;
      state.refreshToken = '';
  }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer