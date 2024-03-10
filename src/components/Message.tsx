import S from './Message.module.css'

export const Message = ({ message, isOwner = false }: { message: string, isOwner?: boolean }) => {
 
  return (
    <div className={isOwner ? S.isOwner : S.message}>
      {message}
    </div>
  )
}
