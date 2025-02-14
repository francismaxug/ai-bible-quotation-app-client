import { useState, useRef, useEffect } from "react"
import { io } from "socket.io-client"
import { Socket } from "socket.io-client"
import { VscRecordSmall } from "react-icons/vsc"
import { BiMicrophone } from "react-icons/bi"
import { IoMicOff } from "react-icons/io5"
import { BsSoundwave } from "react-icons/bs"
import Scripture from "./components/Scripture"
import { BiQuestionMark } from "react-icons/bi"
import InstructionModal from "./components/Modal"
import Instructions from "./components/Instructions"

const App = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [reference, setReference] = useState("")
  const [quote, setQuote] = useState("")
  const [error, setError] = useState("")
  const audioChunksRef = useRef<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    //    console.log("Attempting to connect to socket...")
    socketRef.current = io(process.env.BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected! ID:", socketRef.current?.id)
    })

    socketRef.current.on("connect_error", (error: Error) => {
      // console.error("Socket connection error:", error)
      setError(`Connection error: ${error.message}`)
    })

    socketRef.current.on("message", (data: string) => {
      //console.log("Socket connected! ID:", socketRef.current?.id)
      const { quote, reference, error } = JSON.parse(data)
      if (error) {
        setError(error)
        setQuote("")
        setReference("")
      } else {
        setError("")
        setQuote(quote)
        setReference(reference)
      }
      console.log(quote, reference, error)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  console.log(quote, reference, error.split(":")[1])

  const startRecording = async () => {
    try {
      //  console.log("Requesting microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("Microphone access granted")

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event: any) => {
        console.log("Recording data available:", event.data.size, "bytes")
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped, preparing to send data...")
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        })
        const audioFile = new File([audioBlob], "audio.wav", {
          type: "audio/wav",
        })

        //   console.log("Audio file created:", audioFile.size, "bytes")

        if (socketRef.current?.connected) {
          console.log("Emitting audio data to server...")
          socketRef.current.emit("audio", audioFile)
        } else {
          console.error("Socket not connected!")
          setError("Not connected to server")
        }
        audioChunksRef.current = []
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      console.log("Recording started")
    } catch (err) {
      console.error("Error accessing microphone:", err)
      //   setError(`Microphone error: ${(err as Error).message}`);
    }
  }

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Stopping recording...")
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }
  return (
    <section className="h-screen p-8 mx-auto max-w-full bg-gray-100">
      <div
        onClick={() => setOpenModal(true)}
        className=" absolute right-0 mr-5 rounded-full size-9 bg-gray-100 flex items-center justify-center"
      >
        <BiQuestionMark className="inline-block text-[1.2rem]" />
      </div>
      {openModal && (
        <InstructionModal>
          <Instructions setOpenModal={setOpenModal} />
        </InstructionModal>
      )}
      <div className=" p-3  w-full h-full flex flex-col items-center justify-between">
        <div>
          <p className=" font-bold text-[1.2rem]">VerseCatch</p>
        </div>

        <Scripture
          isRecording={isRecording}
          reference={reference}
          quote={quote}
          error={error}
        />

        <div>
          <div className=" w-[20rem] px-10 bg-white rounded-md py-4  flex flex-col w-full items-center justify-between gap-y-3">
            <div className=" rounded-full size-10 bg-gray-100 flex items-center justify-center">
              {isRecording ? (
                <BsSoundwave className=" inline-block text-gray-500 animate-ping text-[1rem]" />
              ) : (
                <VscRecordSmall className=" inline-block text-[1.5rem]" />
              )}
            </div>
            <div className=" text-[0.9rem] flex flex-col items-center justify-center">
              <p>Transcribing and detecting</p>
              <p>Bible quotations in real time</p>
            </div>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full px-6 flex items-center py-1.5 gap-x-2 ${
                isRecording ? "bg-red-200" : "bg-black"
              } justify-center `}
            >
              {isRecording ? (
                <IoMicOff className=" text-red-400 inline-block" />
              ) : (
                <BiMicrophone className=" text-white inline-block" />
              )}

              <div className=" text-white text-[0.8rem]">
                {isRecording ? (
                  <p className=" text-red-400">Stop Listening</p>
                ) : (
                  <p>Start Listening</p>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
