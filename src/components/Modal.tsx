import React from "react"
import { createPortal } from "react-dom"

const InstructionModal = ({
  children,
}: {
  modalState?: boolean
  children?: React.ReactNode
  className?: string
  setOpenModalFxn?: () => void
}) => {
  return createPortal(
    <div className="fixed inset-0 z-[999] bg-gray-200 backdrop-blur bg-opacity-0 flex items-center justify-center ">
      {children}
    </div>,
    document.body
  )
}

export default InstructionModal
