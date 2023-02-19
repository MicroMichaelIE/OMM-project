import { Container } from 'react-bootstrap'
//import SendIcon from '@material-ui/icons/Send';
//import MicIcon from '@material-ui/icons/Mic';
import { Icon } from '../Icon/Icon';
import { FC, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { EntryText } from '../Entry/EntryText/EntryText';

interface Props {
  handleOnSend: (message: Message) => void
}

//TODO: add type
interface Message {
  id: string,
  text: string,
}

const MessageInput: FC<Props> = ({ handleOnSend }) => {

  const [input, setInput] = useState('')
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState<boolean>(false);
  const canUseSpeech: boolean = SpeechRecognition.browserSupportsSpeechRecognition()

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setInput(e.target.value)
  }

  const handleSend = () => {
    if (input.length !== 0) {
      handleOnSend({ id: 'user', text: input })
      setInput('')
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopListening = () => {
    if (transcript.length !== 0) {
      handleOnSend({ id: 'user', text: transcript })
      setInput('')
      resetTranscript();
    }
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  return (
    
    <Container>
      <Container >
        <EntryText
        id='name'
          label="Escribe tu mensaje"
          name='message'
          type='text'
       
          onChange={handleChange}
          value={isListening ? transcript : input}
        //   onKeyDown={handleKeyDown} 
        />
      </Container>
      {canUseSpeech &&
        <Container>
          <button onClick={!isListening ? startListening : stopListening}>
            {!isListening ? (
              <Icon name={'mic'} />
            ) : (
               <Icon name={'send'} />
            )}
          </button>
        </Container>
      }
      <Container >
        <button onClick={handleSend}>
           <Icon name={'mic'} />
        </button>
      </Container>
    </Container>

  )
}

export default MessageInput