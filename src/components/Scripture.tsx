import BibleQuoteSkeleton from "./Skeleton"

type Props = {
  isRecording: boolean
  reference: string
  quote: string
  error: string
}

const Scripture = ({ isRecording, quote, reference, error }: Props) => {
  // If isRecording is false and everything is empty, show nothing
  if (!isRecording && !quote && !reference && !error) {
    return null
  }

  // If isRecording is true OR false but some data is missing, show the skeleton

  if ((!quote || !reference) && !error) {
    return <BibleQuoteSkeleton />
  }

  // If there's an error, show the error message
  if (error) {
    return <p className="text-red-500">{error.split(":")[1]}</p>
  }

  // Show the actual quote when all required data is available
  return (
    <div className="text-center flex flex-col items-center justify-center gap-y-2 w-[23rem] p-3">
      <p className="font-semibold underline text-[1.1rem]">{reference}</p>
      <p>{quote}</p>
    </div>
  )
}

export default Scripture
