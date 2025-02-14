import React from "react"

const Instructions = ({
  setOpenModal,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="bg-white rounded-md p-5 w-[30rem]">
      <p className="font-bold text-[1.2rem]">Instructions</p>
      <div className=" flex flex-col gap-y-7">
        <ul>
          <li>
            Click on the microphone button to start listening. Speak a Bible
            verse and wait for a while and the app will transcribe it in real
            time.
          </li>
        </ul>
        <button
          onClick={() => setOpenModal(false)}
          className=" rounded-full bg-red-300 px-3 cursor-pointer py-1"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Instructions
