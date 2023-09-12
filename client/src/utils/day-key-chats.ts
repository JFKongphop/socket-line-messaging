import { PersonalChat } from "@/type/chat-type";


// show today, yesterday, date format
export const separateDayChats = (personalChats: PersonalChat[]) => {
  const today = new Date();
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);
  
  const timestampsByDay: any = {};
  
  personalChats.forEach((chats) => {
    const date = new Date(chats.timestamp);
    const dateString = date.toLocaleDateString();

    if (dateString === today.toLocaleDateString()) {
      if (!timestampsByDay['today']) {
        timestampsByDay['today'] = [];
      }
      timestampsByDay['today'].push(chats);
    } 
    else if (dateString === oneDayAgo.toLocaleDateString()) {
      if (!timestampsByDay['yesterday']) {
        timestampsByDay['yesterday'] = [];
      }
      timestampsByDay['yesterday'].push(chats);
    }
    else {
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
      if (!timestampsByDay[formattedDate]) {
        timestampsByDay[formattedDate] = [];
      }
      timestampsByDay[formattedDate].push(chats);
    }
  });
  
  return timestampsByDay;
}

// show day only
// export const separateDayChats = (personalChats: PersonalChat[]) => {
//   const today = new Date();
//   const oneDayAgo = new Date(today);
//   oneDayAgo.setDate(today.getDate() - 1);

//   const timestampsByDay: any = {};

//   personalChats.forEach((chats) => {
//     const date = new Date(chats.timestamp);
//     const daysAgo = Math.floor(
//       (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     if (daysAgo <= 7) {
//       const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
//         date
//       );
//       if (!timestampsByDay[dayOfWeek]) {
//         timestampsByDay[dayOfWeek] = [];
//       }
//       timestampsByDay[dayOfWeek].push(chats);
//     } else {
//       const formattedDate = `${(date.getMonth() + 1).toString().padStart(
//         2,
//         '0'
//       )}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
//       if (!timestampsByDay[formattedDate]) {
//         timestampsByDay[formattedDate] = [];
//       }
//       timestampsByDay[formattedDate].push(chats);
//     }
//   });

//   return timestampsByDay;
// };
