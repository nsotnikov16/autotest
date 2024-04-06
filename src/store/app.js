import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'app',
    initialState: {
        nodes: [
            {id: '1', type: 'StartNode', position: {x: 0, y: 0}, data: {label: '1124'}},
            {id: '2', type: 'ClickNode', position: {x: 0, y: 100}, data: {label: 'Клик'}},
            {id: '3', type: 'TimeoutNode', position: {x: 200, y: 400}, data: {label: '321412'}},
            {id: '4', type: 'FocusNode', position: {x: 300, y: 500}, data: {label: '1122'}},
            {id: '5', type: 'InputNode', position: {x: 350, y: 600}, data: {label: '1122'}},
            {id: '6', type: 'ScriptNode', position: {x: 500, y: 300}, data: {label: '1122'}},]
    },
    reducers: {
        setNotifications: (state, {payload: notifications}) => {
            return [...notifications];
        },
    },
});

export const {} = appSlice.actions;
export default appSlice.reducer