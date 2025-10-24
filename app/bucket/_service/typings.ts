export interface PayableItem {
    id: string;
    itineraryId: string;
    title: string;
    lastUpdate: any;  // Firestore Timestamp
    data: BaseTodo[];
  }

export  type BaseTodo = {
    id_order_todo: number;
    nameTodo: string;
    descriptionTodo?: string;
    isPayable: boolean;
    cost?: number;
    imgTodoUrl?: string;
    typeTodo?: string; 
  };

  export type HotelTodo = BaseTodo & {
    uniqueId: string;
    typeTodo: "hotel";
    checkinDate: string;  
    checkoutDate: string; 
    city?:string;
    time_start?: string;
    time_end?: string;
    isPaid: boolean;
    //Penting! Jangan di Hapus: Mulai dari sini kebawah menyesuaikan parameter dari API AGODA 
    hotelId: number;
    currency: string; 
    landingURL: string;
    roomTypeName?: string; 
    starRating: number;
    reviewCount: number;
    reviewScore: number;
    crossedOutRate: number;
    discountPercentage: number;
    includeBreakfast: boolean;
    freeWifi: boolean;
  }
  export type HotelAgodaAPI = {
    hotelId: number;
    hotelName: string;
    dailyRate: number;
    currency: string; 
    imageURL: string;
    landingURL: string;
    roomTypeName?: string | undefined; 
    starRating: number;
    reviewCount: number;
    reviewScore: number;
    crossedOutRate: number;
    discountPercentage: number;
    includeBreakfast: boolean;
    freeWifi: boolean;
  }
  

  
  export type ActivityTodo = BaseTodo & {
    uniqueId?: string;
    typeTodo: "activity";
    time_start?: string;
    time_end?: string;
    location?: string;
  };
  
