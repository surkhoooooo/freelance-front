import { createAsyncThunk } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    orders:[],
    role: localStorage.getItem("role")
}


export const follow = createAsyncThunk('patch/order', 
async ({orderId, id}, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:3030/followOrder/${orderId}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: id} )
    });
  
    return await res.json();

  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const fetchOrders= createAsyncThunk(
    "fetch/orders",
    async (_, thunkAPI)=>{
        try {
            const res = await fetch("http://localhost:3030/order")
            const data = await res.json()
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)


export const addOrder = createAsyncThunk(
    "add/orders",
    async ({creator,price,inner,term,title,location,categoryId }, thunkAPI) => {
      try {
        const res = await fetch("http://localhost:3030/order", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${thunkAPI.getState().application.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({creator,price,text:inner,workTime:term,title,location,categoryId }),
        });
        
        const data = await res.json();
  
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );


  const OrderSclice = createSlice({
    name: "movie",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrders.fulfilled,(state,action)=>{
            state.orders = action.payload
        })
        .addCase(addOrder.fulfilled,(state,action)=>{
            state.orders.push(action.payload)
        })
      //  .addCase(follow.fulfilled, (state, action) => {
      //    state.orders.map((item) => {
      //     if (item._id === action.payload._id) {
      //      item.freelancers.push(action.payload)
      //     }
      //     return item
      //   });
      //  })
      .addCase(follow.fulfilled, (state, action) => {
        state.orders = state.orders.map((item) => {
          if (item._id === action.payload._id) {
           item.freelancers.push(action.payload)
          }
          return item
        });
       })

    },
  });
 
  
  export default OrderSclice.reducer;