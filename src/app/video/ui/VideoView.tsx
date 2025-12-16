import "./VideoView.css"
import {useEffect, useRef} from "react";
import {useAppDispatch, useDynamicSlice} from "@/store/hooks";
import {createVideoSlice, type VideoActions, type VideoState} from "../videoSlice";
import { srcLocal } from "@/hooks/utils";
import useOnload from "@/hooks/useOnload";

function VideoView() {
  const videoId = "video"
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    state: videoState,
    actions: videoActions
  } = useDynamicSlice<VideoState, VideoActions>(videoId, createVideoSlice)
  const dispatch = useAppDispatch();
  const {onLoad} = useOnload();

  onLoad(() => {

    if (videoActions === undefined) return;
    console.log("onload", videoState)

    dispatch(videoActions.setMediaPath("C:\\Users\\kkt\\Downloads\\english\\1초면 구분합니다! ｜ 원어민만 느끼는 뉘앙스 구분법 [bfsY18cvveo].mp4"))
  })

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = (e: Event) => {console.log("loadstart", e)}
    const handleProgress = (e: Event) => {console.log("progress", e)}
    const handleSuspend = (e: Event) => {console.log("suspend", e)}
    const handleAbort = (e: Event) => {console.log("abort", e)}
    const handleError = (e: Event) => {console.log("error", e)}
    const handleStalled = (e: Event) => {console.log("stalled", e)}
    const handleLoadedMetadata = (e: Event) => {console.log("loadedmetadata", e)}
    const handleLoadedData = (e: Event) => {console.log("loadeddata", e)}
    const handleCanPlay = (e: Event) => {console.log("canplay", e)}
    const handleCanplayThrough = (e: Event) => {console.log("canplaythrough", e)}
    const handleEmptied = (e: Event) => {console.log("emptied", e)}
    const handlePlay = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("play", e)
      dispatch(videoActions.setIsPlaying(true))
    }
    const handlePlaying = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("playing", e)
      dispatch(videoActions.setIsPlaying(true))
    }
    const handlePause = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("pause", e)
      dispatch(videoActions.setIsPlaying(false))
    }
    const handleWaiting = (e: Event) => {console.log("waiting", e)}
    const handleSeeking = (e: Event) => {console.log("seeking", e)}
    const handleSeeked = (e: Event) => {console.log("seeked", e)}
    const handleEnded = (e: Event) => {console.log("ended", e)}
    const handleRateChange = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("ratechange", e)
      dispatch(videoActions.setPlaybackRate(video.playbackRate))
    }
    const handleTimeUpdate = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("timeupdate", e)
      dispatch(videoActions.setCurrentTime(video.currentTime))
    }
    const handleDurationChange = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("durationchange", e)
      dispatch(videoActions.setDuration(video.duration))
    }
    const handleVolumeChange = (e: Event) => {
      if (videoActions === undefined) return;
      const video = videoRef.current;
      if (!video) return;
      console.log("volumechange", e)
      dispatch(videoActions.setVolume(video.volume))
      dispatch(videoActions.setMuted(video.muted))
    }
    const handleCueChange = (e: Event) => {console.log("cuechange", e)}
    const handleAddTrack = (e: Event) => {console.log("addtrack", e)}
    const handleRemoveTrack = (e: Event) => {console.log("removetrack", e)}

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('suspend', handleSuspend);
    video.addEventListener('abort', handleAbort);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanplayThrough);
    video.addEventListener('emptied', handleEmptied);
    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('cuechange', handleCueChange);
    video.addEventListener('addtrack', handleAddTrack);
    video.addEventListener('removetrack', handleRemoveTrack);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('suspend', handleSuspend);
      video.removeEventListener('abort', handleAbort);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanplayThrough);
      video.removeEventListener('emptied', handleEmptied);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('cuechange', handleCueChange);
      video.removeEventListener('addtrack', handleAddTrack);
      video.removeEventListener('removetrack', handleRemoveTrack);
    }

  }, [])

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoState?.mediaPath) {
      video.src = srcLocal(videoState.mediaPath);
      video.load();
    }
  }, [videoState?.mediaPath])
  return (
    <>
      <div>
        <video
          ref={videoRef}
          autoPlay={videoState?.autoPlay}
          controls={videoState?.controls}
        >
          <source />
        </video>
      </div>
      <pre>{JSON.stringify(videoState, null, 2)}</pre>
      <input type="file" />
    </>
  )
}

export default VideoView
