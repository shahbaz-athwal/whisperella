"use client"
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios"
import { useState } from "react";


export default function page() {
  const [messages, setMessages] = useState<ApiResponse["messages"]>([])

  async function handleClick(){
    const response = await axios.get<ApiResponse>("/api/getmessages")
    setMessages(response.data.messages)
  }
  return (
    <>
    <Button onClick={handleClick}>CLick Me</Button>
    {messages?.map((message) => {
      return <div key={message.id}>{message.content}</div>
    })}
    
    </>
  )
}
