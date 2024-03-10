import { FieldValues, useForm } from 'react-hook-form'
import S from './App.module.css'
import { Message } from './components/Message'
import './global.css'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useSocket } from './hooks/useSocket'

type MessageProps = {
  text: string,
  id: string,
  isOwner?: boolean
}

export const App = () => {
  const { register, handleSubmit } = useForm()
  const { socketInstance } = useSocket() 

  const messagesContent = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<MessageProps[]>([])

  useEffect(() => {
    socketInstance.on<string>('message', (message) => {
      setMessages((prev) => [
      ...prev,
      message
    ])
    })

    return () => {
      socketInstance.off('message')
    }
  }, [socketInstance])

  useEffect(() => {
    messagesContent.current?.scrollTo(0, messagesContent.current.scrollHeight)
  }, [messages])

  const onSubmit = (data: FieldValues) => {
    console.log(data)
    const newMessage: MessageProps = {
      text: data.message,
      id: uuid()
    }

    socketInstance.emit('message', newMessage)
   
    setMessages((prev) => [ ...prev, { ...newMessage, isOwner: true } ])
  }

  return (
    <main className={S.container}>
      <section className={S.chat_container}>
        <div className={S.chat_header}>Chat Teste</div>
        <hr className={S.divider}></hr>
        <div className={S.chat_content} ref={messagesContent}>
          {messages.map((message) => (
            <Message key={message.id} message={message.text} isOwner={message.isOwner} /> 
          ))}
        </div>  
        <hr className={S.divider}></hr>
        <form onSubmit={handleSubmit(onSubmit)} className={S.chat_footer}>
          <label htmlFor="message"></label>
          <textarea {...register('message')} className={S.textarea}></textarea> 
          <button className={S.button_submit}>Enviar</button>
        </form> 
      </section>
    </main>
  )
}

    
