import { useState } from "react"
export const useLocalStorage=()=>{
    const [localStorageItem,setLocalStorageItem]=useState(()=>{
        if(JSON.parse(localStorage.getItem('watched')))
            return JSON.parse(localStorage.getItem('watched'))
        else
            return []
    })
    const setStorage=(data)=>{
        localStorage.setItem("watched",JSON.stringify(data))
        setLocalStorageItem(data)
    }
    const getStorage=()=>{
        const data=JSON.parse(localStorage.getItem('watched'))
        return data
    }
    return [setStorage,localStorageItem]
}