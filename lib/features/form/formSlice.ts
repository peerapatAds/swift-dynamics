import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type FieldType = {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
  nationality: string;
  citizenId?: string;
  gender: string;
  mobilePhone: string;
  passportNo?: string;
  expectedSalary: string;
};

const formSlice = createSlice({
  name: "form",
  initialState: {
    data: [] as FieldType[],
    selectedData: {} as FieldType | undefined,
  },

  reducers: {
    formGetById(state, action) {
      state.selectedData = state.data.find(
        (form) => form.id === action.payload
      );
    },
    formAdd(state, action) {
      state.data.push({ ...action.payload, id: uuidv4() });
      localStorage.setItem("dataList", JSON.stringify(state.data));
      state.selectedData = {} as FieldType;
    },
    setFormByLocalStore: (state, action) => {
      state.data = action.payload;
    },
    formUpdateById(state, action) {
      const index = state.data.findIndex(
        (form) => form.id === action.payload.id
      );
      state.data[index] = action.payload;
      localStorage.setItem("dataList", JSON.stringify(state.data));
      state.selectedData = {} as FieldType;
    },
    deleteFormById(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload);
      localStorage.setItem("dataList", JSON.stringify(state.data));
    },
    deleteFormBySelect(state, action) {
      action.payload.forEach((id: string) => {
        state.data = state.data.filter((item) => item.id !== id);
      });
      localStorage.setItem("dataList", JSON.stringify(state.data));
    },
  },
});

export const {
  formGetById,
  formAdd,
  setFormByLocalStore,
  formUpdateById,
  deleteFormById,
  deleteFormBySelect,
} = formSlice.actions;
export const selectedData = (state: { form: { selectedData: FieldType } }) =>
  state.form.selectedData;
export const dataList = (state: { form: { data: FieldType[] } }) =>
  state.form.data;
export default formSlice.reducer;
