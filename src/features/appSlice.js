import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentChatId: null,
	isOpenMessages: false
}

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setCurrentChatId: (state, action) => {
			state.currentChatId = action.payload;
		},
		setIsOpenMessages: (state, action) => {
			state.isOpenMessages = action.payload;
		}
	}
})

export const { setCurrentChatId, setIsOpenMessages } = appSlice.actions;
export const selectCurrentChatId = state => state.app.currentChatId;
export const selectIsOpenMessages = state => state.app.isOpenMessages;

export default appSlice.reducer;