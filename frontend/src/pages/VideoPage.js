//Pseudocode Sarah Park

// import React, { useState, useRef, useEffect } from "react";

// // Import necessary assets and components
// import videoIcon from "../assets/Video Chat Icon.png"; 
// import { startVideoCall } from "./videoCall"; 
// import { getUser } from "../helpers/userHelper"; 


// const VideoChat = () => {
// // State to manage video call status and user information
//   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//   const [userName, setUserName] = useState("");
//   const videoContainerRef = useRef(null);
//   useEffect(() => {
//     const user = getUser();
//     if (user) {
//       setUserName(user.name); 
//     }
//   }, []);

//   // Function to handle starting a video call
//   const handleStartVideoCall = () => {
//     if (!isVideoCallActive) {
//       // Call the backend or initiate WebRTC call setup
//       startVideoCall(userName)
//         .then(() => {
//           // Update state to show that the video call is now active
//           setIsVideoCallActive(true);
//           // Optional: You can also add logic to show the video call UI here
//         })
//         .catch((error) => {
//           console.log("Error starting video call:", error);
//         });
//     }
//   };

//   // Function to handle ending a video call
//   const handleEndVideoCall = () => {
//     if (isVideoCallActive) {
//       // Logic to end the video call, probably with backend or WebRTC API
//       endVideoCall()
//         .then(() => {
//           // Update state to show that the video call has ended
//           setIsVideoCallActive(false);
//           // Optional: Add logic to remove or hide the video call UI
//         })
//         .catch((error) => {
//           console.log("Error ending video call:", error);
//         });
//     }
//   };

//   // Rendering the VideoChat component
//   return (
//     <div className="video-chat-container">
//       {/* Video Call Icon Button - To start a call */}
//       <div className="start-video-call">
//         <img
//           src={videoIcon}
//           alt="Start Video Call"
//           onClick={handleStartVideoCall}
//           className="video-call-icon"
//         />
//       </div>

//       {/* Video Call Controls */}
//       {isVideoCallActive && (
//         <div className="video-call-controls">
//           <button onClick={handleEndVideoCall}>End Call</button>
//           {/* Optional: Add UI for controlling microphone, camera, etc. */}
//         </div>
//       )}

//       {/* Video Chat Content - This is where video content would go */}
//       <div ref={videoContainerRef} className="video-call-content">
//         {/* Video streams will be shown here, managed by WebRTC or backend */}
//       </div>
//     </div>
//   );
// };

// export default VideoChat;
