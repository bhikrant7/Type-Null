import os
import subprocess
import wave
import json
from vosk import Model, KaldiRecognizer

MOVIE_PATH = "vid.mp4"
AUDIO_PATH = "audio.wav"
SRT_PATH = "subtitles.srt"
MODEL_PATH = "vosk-model-small-en-us-0.15"

def extract_audio(movie_path, output_audio_path):
    """Extracts audio from the movie using FFmpeg."""
    command = [
        "ffmpeg", "-y", "-i", movie_path, 
        "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", output_audio_path
    ]
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("✅ Audio extracted successfully.")

def transcribe_audio(audio_path, model_path=MODEL_PATH):
    text = ""
    """Transcribes audio using the Vosk model."""
    if not os.path.exists(model_path):
        raise ValueError(f"Model path '{model_path}' does not exist. Please download a Vosk model.")

    print("🔄 Loading Vosk model...")
    model = Model(model_path)
    print("✅ Vosk model loaded successfully.")

    recognizer = KaldiRecognizer(model, 16000)
    transcription = []

    try:
        with wave.open(audio_path, "rb") as wf:
            print("🔄 Opening audio file...")
            if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
                raise ValueError("Audio file must be WAV format, mono, 16-bit, and 16kHz.")

            print("🔄 Transcribing audio...")
            frame_rate = wf.getframerate()
            frames_processed = 0

            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    print("✅ Reached end of audio file.")
                    break

                current_time = frames_processed / frame_rate

                if recognizer.AcceptWaveform(data):
                    result = json.loads(recognizer.Result())
                    # print("🔍 Result:", result)
                    text = text + result["text"]
              
        print("✅ Transcription completed.")
        return text

    except Exception as e:
        print(f"❌ Error during transcription: {e}")
        return []



# if __name__ == "__main__":
#     extract_audio(MOVIE_PATH, AUDIO_PATH)
#     text = transcribe_audio(AUDIO_PATH, MODEL_PATH)
    
