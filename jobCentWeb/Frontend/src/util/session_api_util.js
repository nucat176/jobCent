import axios from "axios";

export const login = user => axios.post("/api/session", { user });
export const logout = () => axios.delete("api/session");
export const signup = user => axios.post("api/user", { user });
// export const login = (user) => (
//     $.ajax({
//         url: "api/session",
//         method: "POST",
//         data: user
//     })
// );
// export const logout = () => (
//     $.ajax({
//         url: "api/session",
//         method: "DELETE",
//     })
// );
// export const signup = (user) => (
//     $.ajax({
//         url: "api/users",
//         method: "POST",
//         data: user
//     })
// );
