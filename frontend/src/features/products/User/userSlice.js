const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        registerRequest: (state) => {
            state.loading = true;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        registerFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});