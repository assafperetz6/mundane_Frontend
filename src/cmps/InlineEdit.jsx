// InlineEdit.jsx
import { useState, useRef, useEffect } from 'react'
import { TooltipContainer } from './TooltipContainer'

export function InlineEdit({ value: initialValue, onSave, isEditing: externalIsEditing }) {
  const [isEditing, setIsEditing] = useState(externalIsEditing)
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef(null)

  useEffect(() => {
    if (externalIsEditing) {
      setIsEditing(externalIsEditing)
    }
    setIsEditing(false)
  }, [externalIsEditing])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  function handleSave() {
    onSave(value)
    setIsEditing(false)
  }

  function handleCancel() {
    setValue(initialValue)
    setIsEditing(false)
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  function onBlur() {
    if (value) {
      onSave(value)
      setIsEditing(false)
    } else return
  }

  return (
    <div className={`inline-edit ${isEditing ? 'edit' : ''}`}>
      {isEditing ? (
        <input ref={inputRef} type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyPress} onBlur={onBlur} />
      ) : (
        <TooltipContainer txt={value}>
          <span onClick={() => setIsEditing(true)}>{value}</span>
        </TooltipContainer>
      )}
    </div>
  )
}
