import axios from "axios";

const SERVER = "https://5y0of7w8hj.execute-api.ap-southeast-1.amazonaws.com";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4NDJkZmY2LWViMzEtNGFiZS1iZDc1LTJhZmJjMjZiMzlhMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzExNzY5NjUyLCJleHAiOjE3MTIyODgwNTJ9.GradmLvMi6xu7LHsZKC_CY3M0PNBYyu3SO0bOCnaYb4";
export const endpoints = {
  like: {
    create: `${SERVER}/dev/like/create`,
    delete: `${SERVER}/dev/like/delete`,
  },
  blog: {
    base: `${SERVER}/blog`,
    details: (id: string) => `${SERVER}/blog/{id}`,
  },
  hashtag: {
    create: `${SERVER}/dev/hashtag/create`,
  },
  user: {
    signin: `/user/signin`,
    signup: `/user`,
  },
};
export const authAPI = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  });
};
export const API = axios.create({
  baseURL: SERVER,
});
