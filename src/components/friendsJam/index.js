// 'use client';

// import { useEffect, useState } from "react";

// const ChatComponent = () => {
//     const [message, setMessage] = useState('');
//     const [newMessage, setNewMessage] = useState('');
//     const [randomCode, setRandomCode] = useState(() => {
//         // Retrieve randomCode from localStorage, or generate a new one if it doesn't exist
//         const savedCode = localStorage.getItem('randomCode');
//         return savedCode ? parseInt(savedCode, 10) : Math.floor(Math.random() * 100000);
//     });

//     useEffect(() => {
//         // Save the randomCode to localStorage
//         localStorage.setItem('randomCode', randomCode);

//         async function createARow() {
//             const { data, error } = await supabase
//                 .from('messages')
//                 .select('*')
//                 .eq('code', randomCode)
//                 .single();

//             if (error) {
//                 if (error.code === 'PGRST116') { // Row does not exist
//                     const { data: newData, error: insertError } = await supabase
//                         .from('messages')
//                         .insert([{ content: '', code: randomCode }])
//                         .select()
//                         .single();
//                 }
//             }
//         }

//         createARow();

//         const fetchMessage = async () => {
//             const { data, error } = await supabase
//                 .from('messages')
//                 .select('*')
//                 .eq('code', 123456)
//                 .single();

//             if (error) {
//                 console.error('Error fetching message:', error);
//             } else {
//                 console.log("data", data);
//                 setMessage(data.content);
//             }
//         };

//         fetchMessage();

//         // Subscribe to real-time updates
//         const channel = supabase
//             .channel('public:messages')
//             .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
//                 console.log("payload", payload);
//                 if (payload.new.code === 123456) {
//                     setMessage(payload.new.content);
//                 }
//             })
//             .subscribe();

//         // Add an event listener to handle page unloads
//         const handleUnload = async () => {
//             await supabase.from('messages').delete().eq('code', randomCode);
//             localStorage.removeItem('randomCode');  // Clear the saved randomCode on unload
//         };

//         window.addEventListener('beforeunload', handleUnload);

//         // Cleanup subscription and remove event listener on component unmount
//         return () => {
//             supabase.removeChannel(channel);
//             window.removeEventListener('beforeunload', handleUnload);
//         };
//     }, [randomCode]);

//     const handleUpdateMessage = async () => {
//         if (newMessage.trim() !== '') {
//             const { data, error } = await supabase
//                 .from('messages')
//                 .update({ content: newMessage })
//                 .eq('code', 123456);

//             if (error) {
//                 console.error('Error updating message:', error);
//             } else {
//                 setNewMessage('');
//             }
//         }
//     };

//     return (
//         <div>
//             <ul>
//                 <li>{message}</li>
//             </ul>
//             <input
//                 className="outline"
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//             />
//             <button onClick={handleUpdateMessage}>Update</button>
//         </div>
//     );
// };

// export default ChatComponent;
