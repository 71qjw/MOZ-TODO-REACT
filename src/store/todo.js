import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
 
const SERVER_URL = "http://localhost:8080";
export const useTaskStore = create()(
    persist((set,get) =>({
        allTasks: [],

        fetchAllTasks: ()=>{
            fetch("http://localhost:8080/todo/all").then((res) =>{
                return res.json();
              }).then((todos) =>{
                console.log(todos);
                set({allTasks : todos})
              })
        },

        addTask: (name) =>{
            const id = `todo-${nanoid()}`;
            fetch(SERVER_URL + "/todo/add?id=" + id + "&name=" +name,{
                method: "POST"
            }).then((res) =>{
                const newTask = {id,name,completed:false};
                set({ allTasks: [...get().allTasks,newTask]})
              })
        },

        deleteTask:(id) =>{
            fetch(SERVER_URL + "/todo/delete?id=" + id ).then((res) =>{
                const remainingTasks = get().allTasks.filter((task) => id != task.id);
                set({ allTasks: remainingTasks})
              })
        },

        editTask: (id,newName,completed) =>{
            fetch(SERVER_URL + "/todo/update?id=" + id + "&name=" + newName + "&completed=" + completed,{
                method: "POST"
            }).then((res) =>{
                const editTaskList = get().allTasks.map((task) => {
                    if(id === task.id){
                        return{...task, name:newName };
                    }
                    return task;
                });

                set({ allTasks: editTaskList});
              })
 
        },

        toggleTaskCompleted: (id,name,completed) => {
            fetch(SERVER_URL + "/todo/update?id=" + id + "&name=" + name + "&completed=" + completed,{
                method: "POST"
            }).then((res) =>{
                const updatedTasks = get().allTasks.map((task) => {
                    if(id === task.id){
                        return{...task, completed: !task.completed };
                    }
                    return task;
                });
                set({ allTasks: updatedTasks });
            })
        }
    }),
      { name : "tasks" }
    )
)