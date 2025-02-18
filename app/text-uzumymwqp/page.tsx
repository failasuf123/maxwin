// "use client"
// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const ItineraryPlanner = () => {
//     const [items, setItems] = useState([
//         { id: 1, startTime: '08:00', endTime: '12:00', name: 'Monas' },
//         { id: 2, startTime: '12:30', endTime: '14:00', name: 'Istiqlal' },
//         { id: 3, startTime: '14:30', endTime: '19:00', name: 'Mall Grand Indonesia' },
//         { id: 4, startTime: '20:00', endTime: '23:00', name: 'Block M' }
//     ]);

//     const onDragEnd = (result:any) => {
//         const { destination, source } = result;

//         if (!destination) return;

//         const newItems = Array.from(items);
//         const [reorderedItem] = newItems.splice(source.index, 1);
//         newItems.splice(destination.index, 0, reorderedItem);

//         // Sort by start time after reordering
//         newItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

//         setItems(newItems);
//     };

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="itinerary">
//                 {(provided:any) => (
//                     <div {...provided.droppableProps} ref={provided.innerRef}>
//                         {items.map((item, index) => (
//                             <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
//                                 {(provided:any) => (
//                                     <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         style={{
//                                             padding: '16px',
//                                             margin: '8px 0',
//                                             backgroundColor: '#f4f4f4',
//                                             borderRadius: '4px',
//                                             ...provided.draggableProps.style
//                                         }}
//                                     >
//                                         <div>{item.name}</div>
//                                         <div>{item.startTime} - {item.endTime}</div>
//                                     </div>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//         </DragDropContext>
//     );
// };

// export default ItineraryPlanner;